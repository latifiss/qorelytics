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

    fetch('/api/billing/status')
      .then(async (response) => {
        if (!response.ok) return null
        return response.json() as Promise<BillingStatus>
      })
      .then((data) => {
        if (active && data) setBilling(data)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { ...billing, loading }
}
