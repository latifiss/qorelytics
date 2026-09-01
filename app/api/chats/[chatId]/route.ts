import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ chatId: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await context.params;

    const chat = await prisma.chatSession.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        datasetId: true,
        createdAt: true,
        updatedAt: true,
        dataset: {
          select: {
            id: true,
            name: true,
            originalFileName: true,
            fileType: true,
            fileSize: true,
            rowCount: true,
            columnCount: true,
            status: true,
            profile: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            role: true,
            content: true,
            result: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error('GET /api/chats/[chatId] failed:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load chat.' },
      { status: 500 },
    );
  }
}
