import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'
import { BillingInterval, BillingTier, getPaddlePriceId } from '@/src/lib/paddle'

export const runtime = 'nodejs'

const paidTiers: BillingTier[] = ['pro', 'team']

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: { tier?: BillingTier; interval?: BillingInterval }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const tier = body.tier
  const interval = body.interval

  if (!tier || !paidTiers.includes(tier) || !interval || !['monthly', 'yearly'].includes(interval)) {
    return NextResponse.json({ error: 'Invalid plan or billing interval' }, { status: 400 })
  }

  const priceId = getPaddlePriceId(tier, interval)

  if (!priceId) {
    return NextResponse.json(
      { error: `Paddle price is not configured for ${tier} ${interval}` },
      { status: 503 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, tier: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    priceId,
    tier,
    interval,
    userId: user.id,
    email: user.email,
    name: user.name,
  })
}
