import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

import {
  createStorageKey,
  uploadToR2,
} from "@/src/lib/storage/r2";

import {
  getFileExtension,
  validateDatasetFile,
  datasetUploadSchema,
} from "@/src/lib/validation/dataset";

import { parseDataset } from "@/src/lib/data/parser";
import { profileDataset } from "@/src/lib/data/profiler";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

    const formData = await request.formData();

    const fileValue = formData.get("file");
    const nameValue = formData.get("name");

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        {
          error: "A dataset file is required.",
        },
        {
          status: 400,
        },
      );
    }

    const parsedName = datasetUploadSchema.safeParse({
      name:
        typeof nameValue === "string"
          ? nameValue
          : fileValue.name.replace(/\.[^/.]+$/, ""),
    });

    if (!parsedName.success) {
      return NextResponse.json(
        {
          error: parsedName.error.issues[0]?.message ??
            "Invalid dataset name.",
        },
        {
          status: 400,
        },
      );
    }

    validateDatasetFile(fileValue);

    const extension = getFileExtension(fileValue.name);

    const arrayBuffer = await fileValue.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const storageKey = createStorageKey(
      session.user.id,
      fileValue.name,
    );

    await uploadToR2(
      storageKey,
      buffer,
      fileValue.type || "application/octet-stream",
    );

    const parseFile = new File(
      [buffer],
      fileValue.name,
      {
        type: fileValue.type,
      },
    );

    const parsedDataset = await parseDataset(
      parseFile,
      extension,
    );

    if (parsedDataset.rows.length === 0) {
      return NextResponse.json(
        {
          error: "The uploaded dataset contains no rows.",
        },
        {
          status: 400,
        },
      );
    }

    if (parsedDataset.columns.length === 0) {
      return NextResponse.json(
        {
          error:
            "The uploaded dataset contains no columns.",
        },
        {
          status: 400,
        },
      );
    }

    const profile = profileDataset(
      parsedDataset.rows,
      parsedDataset.columns,
    );

    const dataset = await prisma.dataset.create({
      data: {
        userId: session.user.id,

        name: parsedName.data.name,

        originalFileName: fileValue.name,

        fileUrl: storageKey,

        fileType: fileValue.type || extension,

        fileSize: fileValue.size,

        rowCount: profile.rowCount,

        columnCount: profile.columnCount,

        profile,

        status: "COMPLETED",
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
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        dataset,
        profile,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/datasets/upload failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload dataset.",
      },
      {
        status: 500,
      },
    );
  }
}