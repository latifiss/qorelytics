import { NextResponse } from 'next/server'

export async function GET() {
  if (!process.env.PADDLE_CLIENT_TOKEN) {
    return NextResponse.json({ error: 'Paddle client token is not configured' }, { status: 503 })
  }

  return NextResponse.json({
    token: process.env.PADDLE_CLIENT_TOKEN,
    environment: process.env.PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production',
  })
}
