import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

export async function GET() {
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

    const datasets = await prisma.dataset.findMany({
      where: {
        userId: session.user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        originalFileName: true,
        fileType: true,
        fileSize: true,
        rowCount: true,
        columnCount: true,
        status: true,
        errorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      datasets,
    });
  } catch (error) {
    console.error("GET /api/datasets failed:", error);

    return NextResponse.json(
      {
        error: "Failed to load datasets.",
      },
      {
        status: 500,
      },
    );
  }
}