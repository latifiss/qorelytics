import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ chatId: string }>;
}

interface MessageBody {
  role: 'USER' | 'ASSISTANT';
  content: string;
  result?: unknown;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as Partial<MessageBody>;

    if ((body.role !== 'USER' && body.role !== 'ASSISTANT') || !body.content?.trim()) {
      return NextResponse.json({ error: 'role and content are required.' }, { status: 400 });
    }

    const chat = await prisma.chatSession.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        sessionId: chatId,
        role: body.role,
        content: body.content.trim(),
        result: body.result === undefined ? undefined : body.result as object,
      },
      select: {
        id: true,
        role: true,
        content: true,
        result: true,
        createdAt: true,
      },
    });

    await prisma.chatSession.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chats/[chatId]/messages failed:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save chat message.' },
      { status: 500 },
    );
  }
}
