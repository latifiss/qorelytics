import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';

export const runtime = 'nodejs';

interface CreateChatBody {
  datasetId: string;
  title: string;
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Partial<CreateChatBody>;
    const datasetId = body.datasetId?.trim();
    const title = body.title?.trim();

    if (!datasetId || !title) {
      return NextResponse.json(
        { error: 'datasetId and title are required.' },
        { status: 400 },
      );
    }

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found.' }, { status: 404 });
    }

    const chat = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        datasetId,
        title: title.slice(0, 80),
      },
      select: {
        id: true,
        title: true,
        datasetId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chats/session failed:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create chat.' },
      { status: 500 },
    );
  }
}
