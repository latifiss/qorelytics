import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";
import { analyzeDataset } from "@/src/lib/ai/analyst";

import type { DatasetProfile } from "@/src/types/dataset";

interface RouteContext {
  params: Promise<{
    datasetId: string;
  }>;
}

export const runtime = "nodejs";

export async function POST(
  request: Request,
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

    const { datasetId } = await context.params;

    const body = (await request
      .json()
      .catch(() => ({}))) as {
      provider?: string;
      model?: string;
    };

    const model =
      body.model?.trim() ||
      "deepseek/deepseek-chat";

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        userId: session.user.id,
      },

      select: {
        id: true,
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
            "This dataset has not been profiled yet.",
        },
        {
          status: 400,
        },
      );
    }

    const analysis = await prisma.analysis.create({
      data: {
        datasetId: dataset.id,

        provider: body.provider?.trim() || "openrouter",

        model,

        status: "RUNNING",

        startedAt: new Date(),
      },
    });

    try {
      const result = await analyzeDataset(
        dataset.profile as DatasetProfile,
        model,
      );

      const completedAnalysis =
        await prisma.analysis.update({
          where: {
            id: analysis.id,
          },

          data: {
            result,
            status: "COMPLETED",
            completedAt: new Date(),
          },

          select: {
            id: true,
            datasetId: true,
            provider: true,
            model: true,
            result: true,
            status: true,
            startedAt: true,
            completedAt: true,
            createdAt: true,
          },
        });

      return NextResponse.json({
        analysis: completedAnalysis,
      });
    } catch (analysisError) {
      await prisma.analysis.update({
        where: {
          id: analysis.id,
        },

        data: {
          status: "FAILED",

          errorMessage:
            analysisError instanceof Error
              ? analysisError.message
              : "Analysis failed.",
        },
      });

      throw analysisError;
    }
  } catch (error) {
    console.error(
      "POST /api/datasets/[datasetId]/analyze failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze dataset.",
      },
      {
        status: 500,
      },
    );
  }
}