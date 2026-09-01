import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';

export const runtime = 'nodejs';

interface SaveChatBody {
  chatId?: string;
  datasetId: string;
  userMessage: string;
  assistantMessage: string;
  result?: unknown;
  title?: string;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chats = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, datasetId: true, createdAt: true, updatedAt: true },
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

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = (await request.json()) as SaveChatBody;
    if (!body.datasetId || !body.userMessage || !body.assistantMessage) {
      return NextResponse.json({ error: 'datasetId, userMessage and assistantMessage are required.' }, { status: 400 });
    }

    let chatId = body.chatId;

    if (chatId) {
      const existing = await prisma.chatSession.findFirst({
        where: { id: chatId, userId: session.user.id },
        select: { id: true },
      });
      if (!existing) return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    } else {
      const title = (body.title || body.userMessage).trim().slice(0, 120);
      const chat = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          datasetId: body.datasetId,
          title: title || 'New chat',
        },
        select: { id: true },
      });
      chatId = chat.id;
    }

    await prisma.chatSession.update({
      where: { id: chatId },
      data: {
        updatedAt: new Date(),
        title: body.title ? body.title.trim().slice(0, 120) : undefined,
        messages: {
          create: [
            { role: 'USER', content: body.userMessage },
            { role: 'ASSISTANT', content: body.assistantMessage, result: body.result ?? undefined },
          ],
        },
      },
    });

    return NextResponse.json({ chatId });
  } catch (error) {
    console.error('POST /api/chats failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save chat.' },
      { status: 500 },
    );
  }
}
