import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { paddleSubscriptionId: true },
  })

  if (!user?.paddleSubscriptionId || !process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: 'No active Paddle subscription' }, { status: 404 })
  }

  const baseUrl = process.env.PADDLE_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com'

  const response = await fetch(`${baseUrl}/subscriptions/${user.paddleSubscriptionId}`, {
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to load subscription management' }, { status: 502 })
  }

  const payload = await response.json()
  const managementUrl = payload?.data?.management_urls?.update_payment_method

  if (!managementUrl) {
    return NextResponse.json({ error: 'Subscription management is not available' }, { status: 503 })
  }

  return NextResponse.json({ url: managementUrl })
}
