import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'

export const runtime = 'nodejs'

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: 'Paddle payments are not configured' }, { status: 503 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { paddleSubscriptionId: true },
  })

  if (!user?.paddleSubscriptionId) {
    return NextResponse.json({ error: 'No active Paddle subscription' }, { status: 404 })
  }

  const baseUrl = process.env.PADDLE_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com'

  const response = await fetch(`${baseUrl}/subscriptions/${user.paddleSubscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ effective_at: 'next_billing_period' }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Paddle subscription cancellation failed:', errorText)
    return NextResponse.json({ error: 'Unable to cancel subscription' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
