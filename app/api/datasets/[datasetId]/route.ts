import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";
import { deleteFromR2 } from "@/src/lib/storage/r2";

interface RouteContext {
  params: Promise<{
    datasetId: string;
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
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { datasetId } = await context.params;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        userId: session.user.id,
      },

      include: {
        analyses: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            provider: true,
            model: true,
            status: true,
            errorMessage: true,
            startedAt: true,
            completedAt: true,
            createdAt: true,
          },
        },
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

    return NextResponse.json({
      dataset,
    });
  } catch (error) {
    console.error(
      "GET /api/datasets/[datasetId] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load dataset.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { datasetId } = await context.params;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        userId: session.user.id,
      },

      select: {
        id: true,
        fileUrl: true,
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

    await prisma.dataset.delete({
      where: {
        id: dataset.id,
      },
    });

    try {
      await deleteFromR2(dataset.fileUrl);
    } catch (storageError) {
      console.error(
        "Failed to delete dataset file from R2:",
        storageError,
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/datasets/[datasetId] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to delete dataset.",
      },
      {
        status: 500,
      },
    );
  }
}