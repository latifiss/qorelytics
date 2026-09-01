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
            analyses: {
              where: {
                status: 'COMPLETED',
              },
              orderBy: {
                createdAt: 'asc',
              },
              select: {
                id: true,
                result: true,
                createdAt: true,
              },
            },
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

    /*
     * Older chat messages may not have a persisted `result` because result
     * persistence was added after those conversations were created. The
     * corresponding Analysis records still contain the structured result
     * needed to rebuild charts and reports, so hydrate missing assistant
     * message results from the dataset's completed analyses in chronological
     * order. Newer messages keep their own persisted result unchanged.
     */
    let assistantAnalysisIndex = 0;

    const messages = chat.messages.map((message) => {
      if (message.role !== 'ASSISTANT') {
        return message;
      }

      const analysis = chat.dataset.analyses[assistantAnalysisIndex];
      assistantAnalysisIndex += 1;

      if (message.result != null || !analysis?.result) {
        return message;
      }

      return {
        ...message,
        result: analysis.result,
      };
    });

    return NextResponse.json({
      chat: {
        ...chat,
        messages,
      },
    });
  } catch (error) {
    console.error('GET /api/chats/[chatId] failed:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load chat.' },
      { status: 500 },
    );
  }
}
