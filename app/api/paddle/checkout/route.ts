import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'
import { getPaddlePriceId } from '@/src/lib/paddle'
import type { BillingInterval, BillingTier } from '@/src/lib/paddle'

export const runtime = 'nodejs'

const paidTiers: BillingTier[] = ['pro', 'team']

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: 'Paddle payments are not configured' }, { status: 503 })
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
    select: {
      id: true,
      tier: true,
      paddleSubscriptionId: true,
      paddleSubscriptionStatus: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (
    user.paddleSubscriptionId &&
    user.paddleSubscriptionStatus &&
    !['canceled', 'past_due'].includes(user.paddleSubscriptionStatus)
  ) {
    return NextResponse.json(
      { error: 'You already have a Paddle subscription. Use Manage to change your subscription.' },
      { status: 409 }
    )
  }

  const baseUrl = process.env.PADDLE_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com'

  const paddleResponse = await fetch(`${baseUrl}/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: {
        userId: user.id,
        tier,
        interval,
      },
    }),
  })

  if (!paddleResponse.ok) {
    const errorText = await paddleResponse.text()
    console.error('Paddle transaction creation failed:', errorText)
    return NextResponse.json({ error: 'Unable to create Paddle checkout' }, { status: 502 })
  }

  const paddlePayload = await paddleResponse.json()
  const transactionId = paddlePayload?.data?.id

  if (!transactionId) {
    return NextResponse.json({ error: 'Paddle did not return a transaction' }, { status: 502 })
  }

  return NextResponse.json({
    transactionId,
    tier,
    interval,
  })
}
