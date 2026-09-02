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
    return NextResponse.json({ tier: 'free' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
