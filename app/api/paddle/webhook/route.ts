import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/db/prisma'
import { getTierFromPriceId } from '@/src/lib/paddle'

export const runtime = 'nodejs'

function verifyPaddleSignature(rawBody: string, signature: string, secret: string) {
  const parts = signature.split(';').reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split('=')
    if (key && value) acc[key] = [...(acc[key] ?? []), value]
    return acc
  }, {})

  const timestamp = parts.ts?.[0]
  const signatures = parts.h1 ?? []

  if (!timestamp || signatures.length === 0) return false

  const timestampNumber = Number(timestamp)
  if (!Number.isFinite(timestampNumber)) return false

  const age = Math.abs(Date.now() / 1000 - timestampNumber)
  if (age > 5) return false

  const signedPayload = `${timestamp}:${rawBody}`
  const expected = createHmac('sha256', secret).update(signedPayload).digest('hex')

  return signatures.some((candidate) => {
    const expectedBuffer = Buffer.from(expected, 'hex')
    const candidateBuffer = Buffer.from(candidate, 'hex')
    return expectedBuffer.length === candidateBuffer.length && timingSafeEqual(expectedBuffer, candidateBuffer)
  })
}

export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  const signature = request.headers.get('paddle-signature')

  if (!secret || !signature) {
    return NextResponse.json({ error: 'Webhook verification is not configured' }, { status: 500 })
  }

  const rawBody = await request.text()

  if (!verifyPaddleSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const eventId = event?.event_id
  const eventType = event?.event_type

  if (!eventId || !eventType) {
    return NextResponse.json({ error: 'Missing event metadata' }, { status: 400 })
  }

  const existingEvent = await prisma.paddleEvent.findUnique({ where: { eventId } })
  if (existingEvent) {
    return NextResponse.json({ received: true })
  }

  await prisma.paddleEvent.create({
    data: { eventId, eventType },
  })

  if (!eventType.startsWith('subscription.')) {
    return NextResponse.json({ received: true })
  }

  const subscription = event?.data
  const customData = subscription?.custom_data
  const userId = typeof customData?.userId === 'string' ? customData.userId : null

  if (!userId || !subscription?.id) {
    return NextResponse.json({ received: true })
  }

  const priceId = subscription?.items?.[0]?.price?.id
  const tier = eventType === 'subscription.canceled'
    ? 'free'
    : getTierFromPriceId(priceId)

  const currentPeriodEnd = subscription?.current_billing_period?.ends_at
    ? new Date(subscription.current_billing_period.ends_at)
    : null

  await prisma.user.update({
    where: { id: userId },
    data: {
      tier,
      paddleCustomerId: subscription.customer_id ?? null,
      paddleSubscriptionId: subscription.id,
      paddleSubscriptionStatus: subscription.status ?? null,
      paddlePriceId: priceId ?? null,
      paddleCurrentPeriodEnd: currentPeriodEnd,
    },
  })

  return NextResponse.json({ received: true })
}
