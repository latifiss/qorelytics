'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PaddleCheckout from './paddleCheckout'
import { useUser } from '@/hooks/use-user'
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
  const { user, loading } = useUser()

  const handleManage = async () => {
    try {
      const response = await fetch('/api/paddle/manage')
      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Unable to open subscription management')
      }

      window.location.href = data.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to open subscription management')
    }
  }

  if (loading) {
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

  const currentTier = (user as typeof user & { tier?: BillingTier }).tier ?? 'free'

  if (tierRank[currentTier] > 0) {
    return (
      <button type="button" onClick={handleManage} className={className}>
        Manage
      </button>
    )
  }

  return (
    <PaddleCheckout tier={tier} interval={interval} className={className}>
      {children}
    </PaddleCheckout>
  )
}
