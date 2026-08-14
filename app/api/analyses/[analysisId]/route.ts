import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

interface RouteContext {
  params: Promise<{
    analysisId: string;
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

    const { analysisId } = await context.params;

    const analysis = await prisma.analysis.findFirst({
      where: {
        id: analysisId,

        dataset: {
          userId: session.user.id,
        },
      },

      include: {
        dataset: {
          select: {
            id: true,
            name: true,
            rowCount: true,
            columnCount: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        {
          error: "Analysis not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      analysis,
    });
  } catch (error) {
    console.error(
      "GET /api/analyses/[analysisId] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load analysis.",
      },
      {
        status: 500,
      },
    );
  }
}