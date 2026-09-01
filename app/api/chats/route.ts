import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await prisma.chatSession.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        datasetId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('GET /api/chats failed:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load chat history.' },
      { status: 500 },
    );
  }
}
