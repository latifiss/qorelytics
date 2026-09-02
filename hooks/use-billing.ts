'use client'

import { useEffect, useState } from 'react'
import type { BillingTier } from '@/src/lib/paddle'

interface BillingStatus {
  tier: BillingTier
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
}

export function useBilling() {
  const [billing, setBilling] = useState<BillingStatus>({
    tier: 'free',
    subscriptionStatus: null,
    currentPeriodEnd: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadBilling = async () => {
      try {
        const response = await fetch('/api/billing/status', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json() as BillingStatus
        if (active) setBilling(data)
      } catch {
        // Keep the last known billing state.
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadBilling()

    const handleRefresh = () => {
      void loadBilling()
    }

    window.addEventListener('qorelytics-billing-refresh', handleRefresh)
    window.addEventListener('focus', handleRefresh)

    return () => {
      active = false
      window.removeEventListener('qorelytics-billing-refresh', handleRefresh)
      window.removeEventListener('focus', handleRefresh)
    }
  }, [])

  return { ...billing, loading }
}
