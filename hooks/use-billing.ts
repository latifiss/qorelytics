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
        console.log('[Qorelytics Billing] Fetching billing status', { retries })
        const response = await fetch('/api/billing/status', { cache: 'no-store' })
        const data = await response.json().catch(() => null)
        console.log('[Qorelytics Billing] Billing status response', {
          status: response.status,
          ok: response.ok,
          data,
        })
        if (!response.ok) return
        if (active) setBilling(data as BillingStatus)

        if (active && retries > 0 && data?.tier === 'free') {
          refreshTimer = setTimeout(() => {
            void loadBilling(retries - 1)
          }, 1500)
        }
      } catch (error) {
        console.error('[Qorelytics Billing] Billing status fetch failed', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadBilling()

    const handleRefresh = (event: Event) => {
      if (refreshTimer) clearTimeout(refreshTimer)
      const detail = (event as CustomEvent<{ transactionId?: string | null }>).detail
      console.log('[Qorelytics Billing] Billing refresh event received', detail)

      const transactionId = detail?.transactionId
      const url = transactionId
        ? `/api/billing/status?transactionId=${encodeURIComponent(transactionId)}`
        : '/api/billing/status'

      const loadWithTransaction = async (retries = 0): Promise<void> => {
        try {
          console.log('[Qorelytics Billing] Verifying transaction billing status', { transactionId, retries })
          const response = await fetch(url, { cache: 'no-store' })
          const data = await response.json().catch(() => null)
          console.log('[Qorelytics Billing] Transaction billing response', {
            status: response.status,
            ok: response.ok,
            data,
          })

          if (response.ok && active) setBilling(data as BillingStatus)

          if (active && retries > 0 && data?.tier === 'free') {
            refreshTimer = setTimeout(() => {
              void loadWithTransaction(retries - 1)
            }, 1500)
          }
        } catch (error) {
          console.error('[Qorelytics Billing] Transaction billing fetch failed', error)
        }
      }

      void loadWithTransaction(20)
    }

    window.addEventListener('qorelytics-billing-refresh', handleRefresh)
    window.addEventListener('focus', () => void loadBilling(2))

    return () => {
      active = false
      if (refreshTimer) clearTimeout(refreshTimer)
      window.removeEventListener('qorelytics-billing-refresh', handleRefresh)
    }
  }, [])

  return { ...billing, loading }
}
