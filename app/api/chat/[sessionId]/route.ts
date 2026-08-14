import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

interface RouteContext {
  params: Promise<{
    sessionId: string;
  }>;
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
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { sessionId } = await context.params;

    const chatSession =
      await prisma.chatSession.findFirst({
        where: {
          id: sessionId,
          userId: session.user.id,
        },

        include: {
          dataset: {
            select: {
              id: true,
              name: true,
            },
          },

          messages: {
            orderBy: {
              createdAt: "asc",
            },

            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });

    if (!chatSession) {
      return NextResponse.json(
        {
          error: "Chat session not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      session: chatSession,
    });
  } catch (error) {
    console.error(
      "GET /api/chat/[sessionId] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load chat session.",
      },
      {
        status: 500,
      },
    );
  }
}