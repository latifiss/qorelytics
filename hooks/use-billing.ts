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
    let refreshTimer: ReturnType<typeof setTimeout> | null = null

    const loadBilling = async (retries = 0) => {
      try {
        const response = await fetch('/api/billing/status', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json() as BillingStatus
        if (active) setBilling(data)

        if (active && retries > 0 && data.tier === 'free') {
          refreshTimer = setTimeout(() => {
            void loadBilling(retries - 1)
          }, 1500)
        }
      } catch {
        // Keep the last known billing state.
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadBilling()

    const handleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer)
      void loadBilling(20)
    }

    window.addEventListener('qorelytics-billing-refresh', handleRefresh)
    window.addEventListener('focus', handleRefresh)

    return () => {
      active = false
      if (refreshTimer) clearTimeout(refreshTimer)
      window.removeEventListener('qorelytics-billing-refresh', handleRefresh)
      window.removeEventListener('focus', handleRefresh)
    }
  }, [])

  return { ...billing, loading }
}
