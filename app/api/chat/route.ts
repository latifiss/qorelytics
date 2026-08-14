import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { streamText } from "ai";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";
import { getModel } from "@/src/lib/ai/model";
import { createChatSystemPrompt } from "@/src/lib/ai/prompts";

import type { DatasetProfile } from "@/src/types/dataset";

export const runtime = "nodejs";

interface ChatRequest {
  sessionId?: string;
  datasetId: string;
  message: string;
  model?: string;
}

export async function POST(request: Request) {
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

    const body =
      (await request.json()) as ChatRequest;

    if (!body.datasetId) {
      return NextResponse.json(
        {
          error: "datasetId is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !body.message ||
      body.message.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        },
      );
    }

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: body.datasetId,
        userId: session.user.id,
      },

      select: {
        id: true,
        name: true,
        profile: true,
      },
    });

    if (!dataset) {
      return NextResponse.json(
        {
          error: "Dataset not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!dataset.profile) {
      return NextResponse.json(
        {
          error:
            "Dataset analysis information is not available.",
        },
        {
          status: 400,
        },
      );
    }

    let chatSession;

    if (body.sessionId) {
      chatSession =
        await prisma.chatSession.findFirst({
          where: {
            id: body.sessionId,
            userId: session.user.id,
            datasetId: dataset.id,
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
    } else {
      chatSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,

          datasetId: dataset.id,

          title: body.message
            .trim()
            .slice(0, 80),
        },
      });
    }

    await prisma.message.create({
      data: {
        sessionId: chatSession.id,

        role: "USER",

        content: body.message.trim(),
      },
    });

    const previousMessages =
      await prisma.message.findMany({
        where: {
          sessionId: chatSession.id,
        },

        orderBy: {
          createdAt: "asc",
        },

        select: {
          role: true,
          content: true,
        },

        take: 20,
      });

    const model =
      body.model?.trim() ||
      "deepseek/deepseek-chat";

    const result = streamText({
      model: getModel(model),

      system: createChatSystemPrompt(
        dataset.profile as DatasetProfile,
      ),

      messages: previousMessages.map(
        (message) => ({
          role:
            message.role === "USER"
              ? ("user" as const)
              : ("assistant" as const),

          content: message.content,
        }),
      ),

      temperature: 0.2,

      onFinish: async ({ text }) => {
        if (!text.trim()) {
          return;
        }

        try {
          await prisma.message.create({
            data: {
              sessionId: chatSession.id,

              role: "ASSISTANT",

              content: text,
            },
          });

          await prisma.chatSession.update({
            where: {
              id: chatSession.id,
            },

            data: {
              updatedAt: new Date(),
            },
          });
        } catch (error) {
          console.error(
            "Failed to persist assistant message:",
            error,
          );
        }
      },
    });

    return result.toTextStreamResponse({
      headers: {
        "X-Chat-Session-Id": chatSession.id,
      },
    });
  } catch (error) {
    console.error(
      "POST /api/chat failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process chat.",
      },
      {
        status: 500,
      },
    );
  }
}