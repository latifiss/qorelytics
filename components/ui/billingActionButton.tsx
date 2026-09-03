'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PaddleCheckout from './paddleCheckout'
import { useUser } from '@/hooks/use-user'
import { useBilling } from '@/hooks/use-billing'
import type { BillingTier, BillingInterval } from '@/src/lib/paddle'

interface BillingActionButtonProps {
  tier: Exclude<BillingTier, 'free'>
  interval: BillingInterval
  children: React.ReactNode
  className?: string
}

const tierRank: Record<BillingTier, number> = { free: 0, pro: 1, team: 2 }

export default function BillingActionButton({ tier, interval, children, className }: BillingActionButtonProps) {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const { tier: currentTier, loading: billingLoading } = useBilling()

  const handleCancel = async () => {
    try {
      const response = await fetch('/api/paddle/cancel', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to cancel subscription')
      }

      window.dispatchEvent(new Event('qorelytics-billing-refresh'))
      toast.success('Your subscription has been scheduled for cancellation.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to cancel subscription')
    }
  }

  if (userLoading || (user && billingLoading)) {
    return (
      <button type="button" disabled className={className}>
        Loading…
      </button>
    )
  }

  if (!user) {
    return (
      <button type="button" onClick={() => router.push('/signin')} className={className}>
        {children}
      </button>
    )
  }

  if (currentTier === tier) {
    return (
      <button type="button" onClick={handleCancel} className={className}>
        Cancel subscription
      </button>
    )
  }

  if (tierRank[currentTier] > 0) {
    return (
      <PaddleCheckout tier={tier} interval={interval} className={className}>
        {children}
      </PaddleCheckout>
    )
  }

  return (
    <PaddleCheckout tier={tier} interval={interval} className={className}>
      {children}
    </PaddleCheckout>
  )
}
