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
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    if (!token) return

    initializePaddle({
      token,
      environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production',
      checkout: {
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
          theme: 'light',
          locale: 'en',
        },
      },
    }).then((instance) => {
      if (instance) setPaddle(instance)
    })
  }, [])

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
        items: [{ priceId: data.priceId, quantity: 1 }],
        customData: {
          userId: data.userId,
          tier: data.tier,
          interval: data.interval,
        },
        customer: {
          email: data.email,
        },
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Loading…' : children}
    </button>
  )
}
