export type BillingTier = 'free' | 'pro' | 'team'
export type BillingInterval = 'monthly' | 'yearly'

export const paddleEnvironment = process.env.PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production'

export function getPaddlePriceId(tier: Exclude<BillingTier, 'free'>, interval: BillingInterval) {
  const prices: Record<Exclude<BillingTier, 'free'>, Record<BillingInterval, string | undefined>> = {
    pro: {
      monthly: process.env.PADDLE_PRO_MONTHLY_PRICE_ID,
      yearly: process.env.PADDLE_PRO_YEARLY_PRICE_ID,
    },
    team: {
      monthly: process.env.PADDLE_TEAM_MONTHLY_PRICE_ID,
      yearly: process.env.PADDLE_TEAM_YEARLY_PRICE_ID,
    },
  }

  return prices[tier][interval]
}

export function getTierFromPriceId(priceId: string | undefined): BillingTier {
  if (!priceId) return 'free'

  if (
    priceId === process.env.PADDLE_PRO_MONTHLY_PRICE_ID ||
    priceId === process.env.PADDLE_PRO_YEARLY_PRICE_ID
  ) {
    return 'pro'
  }

  if (
    priceId === process.env.PADDLE_TEAM_MONTHLY_PRICE_ID ||
    priceId === process.env.PADDLE_TEAM_YEARLY_PRICE_ID
  ) {
    return 'team'
  }

  return 'free'
}
