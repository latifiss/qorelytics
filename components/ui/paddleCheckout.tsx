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

    fetch('/api/paddle/config')
      .then((response) => response.json())
      .then(({ token, environment }) => {
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
            if (event.name === 'checkout.completed') {
              window.dispatchEvent(new Event('qorelytics-billing-refresh'))
              router.refresh()
            }
          },
        }).then((instance) => {
          if (!cancelled && instance) setPaddle(instance)
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [router])

  const handleClick = async () => {
    if (!user) {
      router.push('/signin')
      return
    }

    if (!paddle) {
      toast.error('Payment checkout is not ready yet. Please try again.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout')
      }

      paddle.Checkout.open({
        transactionId: data.transactionId,
      })
    } catch (error) {
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
