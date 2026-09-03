'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { toast } from 'sonner'
import type { BillingInterval, BillingTier } from '@/src/lib/paddle'
import { useUser } from '@/hooks/use-user'

interface PaddleCheckoutProps {
  tier: Exclude<BillingTier, 'free'>
  interval: BillingInterval
  children: React.ReactNode
  className?: string
}

export default function PaddleCheckout({ tier, interval, children, className }: PaddleCheckoutProps) {
  const router = useRouter()
  const { user } = useUser()
  const [paddle, setPaddle] = useState<Paddle>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    let activeTransactionId: string | null = null

    console.log('[Qorelytics Billing] Initializing Paddle checkout', { tier, interval })

    fetch('/api/paddle/config')
      .then(async (response) => {
        console.log('[Qorelytics Billing] Paddle config response', { status: response.status })
        return response.json()
      })
      .then(({ token, environment }) => {
        console.log('[Qorelytics Billing] Paddle config loaded', { environment, hasToken: Boolean(token) })
        if (cancelled || !token) return

        initializePaddle({
          token,
          environment,
          checkout: {
            settings: {
              displayMode: 'overlay',
              variant: 'one-page',
              theme: 'light',
              locale: 'en',
            },
          },
          eventCallback: (event) => {
            console.log('[Qorelytics Billing] Paddle event', event.name, event)

            if (event.name === 'checkout.completed') {
              console.log('[Qorelytics Billing] Checkout completed', { transactionId: activeTransactionId })
              window.dispatchEvent(new CustomEvent('qorelytics-billing-refresh', {
                detail: { transactionId: activeTransactionId },
              }))
              router.refresh()
            }
          },
        }).then((instance) => {
          console.log('[Qorelytics Billing] Paddle initialized', { initialized: Boolean(instance) })
          if (!cancelled && instance) setPaddle(instance)
        })
      })
      .catch((error) => {
        console.error('[Qorelytics Billing] Paddle initialization failed', error)
      })

    return () => {
      cancelled = true
    }
  }, [router, tier, interval])

  const handleClick = async () => {
    if (!user) {
      console.log('[Qorelytics Billing] Checkout blocked: no authenticated user')
      router.push('/signin')
      return
    }

    if (!paddle) {
      console.error('[Qorelytics Billing] Checkout blocked: Paddle is not initialized')
      toast.error('Payment checkout is not ready yet. Please try again.')
      return
    }

    setLoading(true)
    console.log('[Qorelytics Billing] Starting checkout', { tier, interval, userId: user.id })

    try {
      const response = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval }),
      })

      const data = await response.json()
      console.log('[Qorelytics Billing] Checkout API response', {
        status: response.status,
        ok: response.ok,
        transactionId: data.transactionId,
        error: data.error,
      })

      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout')
      }

      if (!data.transactionId) {
        throw new Error('Checkout did not return a transaction ID')
      }

      // Keep the transaction ID available to the Paddle event callback so the
      // billing status endpoint can verify the completed transaction directly.
      // The callback belongs to the Paddle instance created above.
      ;(window as Window & { __qorelyticsPaddleTransactionId?: string }).__qorelyticsPaddleTransactionId = data.transactionId
      console.log('[Qorelytics Billing] Opening Paddle checkout', { transactionId: data.transactionId })

      paddle.Checkout.open({
        transactionId: data.transactionId,
      })
    } catch (error) {
      console.error('[Qorelytics Billing] Checkout failed', error)
      toast.error(error instanceof Error ? error.message : 'Unable to start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className={className}>
      {loading ? (
        <span className="inline-flex items-center justify-center" aria-label="Loading">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      ) : children}
    </button>
  )
}
