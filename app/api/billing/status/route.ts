import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'
import { getTierFromPriceId } from '@/src/lib/paddle'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return NextResponse.json({ tier: 'free' }, { status: 401 })
  }

  const userId = session.user.id
  const url = new URL(request.url)
  const transactionId = url.searchParams.get('transactionId')

  if (transactionId && process.env.PADDLE_API_KEY) {
    try {
      const baseUrl = process.env.PADDLE_ENVIRONMENT === 'sandbox'
        ? 'https://sandbox-api.paddle.com'
        : 'https://api.paddle.com'

      const paddleResponse = await fetch(`${baseUrl}/transactions/${encodeURIComponent(transactionId)}`, {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (paddleResponse.ok) {
        const payload = await paddleResponse.json()
        const transaction = payload?.data
        const customData = transaction?.custom_data
        const transactionUserId = typeof customData?.userId === 'string' ? customData.userId : null
        const priceId = transaction?.items?.[0]?.price?.id

        if (transactionUserId === userId && priceId && transaction?.status === 'completed') {
          const subscriptionId = transaction?.subscription_id ?? null
          let subscription: any = null

          if (subscriptionId) {
            const subscriptionResponse = await fetch(`${baseUrl}/subscriptions/${encodeURIComponent(subscriptionId)}`, {
              headers: {
                Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              cache: 'no-store',
            })

            if (subscriptionResponse.ok) {
              const subscriptionPayload = await subscriptionResponse.json()
              subscription = subscriptionPayload?.data ?? null
            }
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              tier: getTierFromPriceId(priceId),
              paddleCustomerId: transaction?.customer_id ?? null,
              paddleSubscriptionId: subscriptionId,
              paddleSubscriptionStatus: subscription?.status ?? null,
              paddlePriceId: priceId,
              paddleCurrentPeriodEnd: subscription?.current_billing_period?.ends_at
                ? new Date(subscription.current_billing_period.ends_at)
                : null,
            },
          })
        }
      }
    } catch {
      // Fall back to the existing database billing state.
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      tier: true,
      paddleSubscriptionStatus: true,
      paddleCurrentPeriodEnd: true,
    },
  })

  return NextResponse.json({
    tier: user?.tier ?? 'free',
    subscriptionStatus: user?.paddleSubscriptionStatus ?? null,
    currentPeriodEnd: user?.paddleCurrentPeriodEnd ?? null,
  })
}
