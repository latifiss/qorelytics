import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';

import {
  getFromR2,
} from '@/src/lib/storage/r2';

import {
  getFileExtension,
} from '@/src/lib/validation/dataset';

import {
  parseDataset,
} from '@/src/lib/data/parser';

import {
  profileDataset,
} from '@/src/lib/data/profiler';

import {
  runAnalysis,
  type AnalysisMessage,
} from '@/src/lib/ai/analyzer';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface RouteContext {
  params: Promise<{
    datasetId: string;
  }>;
}

interface AnalyzeRequestBody {
  provider?: string;
  model?: string;
  userQuestion?: string;
  messages?: AnalysisMessage[];
}

export const runtime = 'nodejs';

/* -------------------------------------------------------------------------- */
/* POST                                                                       */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    console.log('');
    console.log(
      '==================================================',
    );
    console.log(
      'ANALYZE DATASET REQUEST STARTED',
    );
    console.log(
      '==================================================',
    );

    /* ---------------------------------------------------------------------- */
    /* AUTH                                                                   */
    /* ---------------------------------------------------------------------- */

    console.log(
      '[1] Checking authentication...',
    );

    const session =
      await auth.api.getSession({
        headers:
          await headers(),
      });

    if (!session?.user) {
      console.log(
        '[1] AUTH FAILED: No authenticated user.',
      );

      return NextResponse.json(
        {
          error:
            'Unauthorized',
        },
        {
          status: 401,
        },
      );
    }

    console.log(
      '[1] AUTH SUCCESS',
    );

    console.log(
      '[1] User ID:',
      session.user.id,
    );

    /* ---------------------------------------------------------------------- */
    /* REQUEST                                                                */
    /* ---------------------------------------------------------------------- */

    const { datasetId } =
      await context.params;

    console.log(
      '[2] Dataset ID:',
      datasetId,
    );

    const body =
      (await request
        .json()
        .catch(() => ({}))) as AnalyzeRequestBody;

    console.log(
      '[2] Request body:',
      {
        provider:
          body.provider,

        model:
          body.model,

        userQuestion:
          body.userQuestion,

        messageCount:
          Array.isArray(
            body.messages,
          )
            ? body.messages.length
            : 0,
      },
    );

    const provider =
      body.provider?.trim() ||
      'openrouter';

    const model =
      body.model?.trim() ||
      'deepseek/deepseek-chat';

    const userQuestion =
      body.userQuestion?.trim();

    const messages =
      Array.isArray(
        body.messages,
      )
        ? body.messages
        : [];

    console.log(
      '[2] Resolved provider:',
      provider,
    );

    console.log(
      '[2] Resolved model:',
      model,
    );

    console.log(
      '[2] Message count:',
      messages.length,
    );

    /* ---------------------------------------------------------------------- */
    /* LOAD DATASET                                                           */
    /* ---------------------------------------------------------------------- */

    console.log(
      '[3] Loading dataset from database...',
    );

    const dataset =
      await prisma.dataset.findFirst({
        where: {
          id: datasetId,

          userId:
            session.user.id,
        },

        select: {
          id: true,

          fileUrl: true,

          originalFileName:
            true,

          fileType: true,

          profile: true,
        },
      });

    if (!dataset) {
      console.log(
        '[3] DATASET NOT FOUND for this user.',
      );

      return NextResponse.json(
        {
          error:
            'Dataset not found.',
        },
        {
          status: 404,
        },
      );
    }

    console.log(
      '[3] DATASET FOUND',
    );

    console.log(
      '[3] Database dataset:',
      {
        id:
          dataset.id,

        fileUrl:
          dataset.fileUrl,

        originalFileName:
          dataset.originalFileName,

        fileType:
          dataset.fileType,

        hasProfile:
          dataset.profile !==
            null &&
          dataset.profile !==
            undefined,
      },
    );

    /* ---------------------------------------------------------------------- */
    /* CHECK FILE                                                             */
    /* ---------------------------------------------------------------------- */

    if (!dataset.fileUrl) {
      console.log(
        '[4] ERROR: Dataset has no fileUrl.',
      );

      return NextResponse.json(
        {
          error:
            'The original dataset file could not be located.',
        },
        {
          status: 400,
        },
      );
    }

    console.log(
      '[4] R2 storage key:',
      dataset.fileUrl,
    );

    /* ---------------------------------------------------------------------- */
    /* LOAD ORIGINAL FILE FROM R2                                             */
    /* ---------------------------------------------------------------------- */

    console.log(
      '[5] Downloading original file from R2...',
    );

    const fileBuffer =
      await getFromR2(
        dataset.fileUrl,
      );

    console.log(
      '[5] R2 download complete.',
    );

    console.log(
      '[5] Downloaded bytes:',
      fileBuffer.length,
    );

    if (
      !fileBuffer.length
    ) {
      console.log(
        '[5] ERROR: R2 returned an empty file.',
      );

      return NextResponse.json(
        {
          error:
            'The stored dataset file is empty.',
        },
        {
          status: 400,
        },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* PARSE ORIGINAL DATASET                                                 */
    /* ---------------------------------------------------------------------- */

    const extension =
      getFileExtension(
        dataset.originalFileName,
      );

    console.log(
      '[6] File parsing information:',
    );

    console.log(
      '[6] Original filename:',
      dataset.originalFileName,
    );

    console.log(
      '[6] Extension:',
      extension,
    );

    console.log(
      '[6] Stored file type:',
      dataset.fileType,
    );

    console.log(
      '[6] Buffer size:',
      fileBuffer.length,
    );

    const file =
      new File(
        [fileBuffer],
        dataset.originalFileName,
        {
          type:
            dataset.fileType ||
            'application/octet-stream',
        },
      );

    console.log(
      '[6] File object created.',
    );

    console.log(
      '[6] File size:',
      file.size,
    );

    console.log(
      '[6] File type:',
      file.type,
    );

    console.log(
      '[6] Calling parseDataset()...',
    );

    const parsedDataset =
      await parseDataset(
        file,
        extension,
      );

    console.log(
      '[6] parseDataset() completed.',
    );

    console.log(
      '[6] Parsed row count:',
      parsedDataset.rows.length,
    );

    console.log(
      '[6] Parsed column count:',
      parsedDataset.columns.length,
    );

    console.log(
      '[6] Parsed columns:',
      parsedDataset.columns,
    );

    console.log(
      '[6] FIRST PARSED ROW:',
      parsedDataset.rows[0],
    );

    /* ---------------------------------------------------------------------- */
    /* VALIDATE PARSED DATA                                                   */
    /* ---------------------------------------------------------------------- */

    if (
      parsedDataset.rows.length ===
      0
    ) {
      console.log(
        '[7] ERROR: parseDataset() returned ZERO rows.',
      );

      return NextResponse.json(
        {
          error:
            'The stored dataset contains no rows.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      parsedDataset.columns.length ===
      0
    ) {
      console.log(
        '[7] ERROR: parseDataset() returned ZERO columns.',
      );

      return NextResponse.json(
        {
          error:
            'No columns could be detected in the stored dataset.',
        },
        {
          status: 400,
        },
      );
    }

    console.log(
      '[7] PARSED DATA VALIDATION PASSED.',
    );

    /* ---------------------------------------------------------------------- */
    /* BUILD COMPLETE DATASET PROFILE                                         */
    /* ---------------------------------------------------------------------- */

    console.log(
      '[8] Creating dataset profile...',
    );

    const datasetProfile =
      profileDataset(
        parsedDataset.rows,
        parsedDataset.columns,
      );

    console.log(
      '[8] profileDataset() completed.',
    );

    console.log(
      '[8] PROFILE ROW COUNT:',
      datasetProfile.rowCount,
    );

    console.log(
      '[8] PROFILE COLUMN COUNT:',
      datasetProfile.columnCount,
    );

    console.log(
      '[8] PROFILE:',
      datasetProfile,
    );

    console.log(
      '[8] PROFILE PREVIEW:',
      datasetProfile.preview,
    );

    console.log(
      '[8] PROFILE NUMERIC COLUMNS:',
      datasetProfile.numericColumns,
    );

    console.log(
      '[8] PROFILE CATEGORICAL COLUMNS:',
      datasetProfile.categoricalColumns,
    );

    console.log(
      '[8] PROFILE DATE COLUMNS:',
      datasetProfile.dateColumns,
    );

    /* ---------------------------------------------------------------------- */
    /* CREATE ANALYSIS RECORD                                                 */
    /* ---------------------------------------------------------------------- */

    console.log(
      '[9] Creating analysis database record...',
    );

    const analysis =
      await prisma.analysis.create({
        data: {
          datasetId:
            dataset.id,

          provider,

          model,

          status:
            'RUNNING',

          startedAt:
            new Date(),
        },
      });

    console.log(
      '[9] Analysis record created:',
      analysis.id,
    );

    try {
      /* -------------------------------------------------------------------- */
      /* RUN AI ANALYST                                                       */
      /* -------------------------------------------------------------------- */

      console.log('');
      console.log(
        '==================================================',
      );

      console.log(
        '[10] RUNNING AI ANALYST',
      );

      console.log(
        '==================================================',
      );

      console.log(
        '[10] Actual parsed dataset being sent to AI:',
        {
          rowCount:
            parsedDataset
              .rows.length,

          columnCount:
            parsedDataset
              .columns.length,

          columns:
            parsedDataset
              .columns,

          firstRow:
            parsedDataset
              .rows[0],
        },
      );

      console.log(
        '[10] Calling runAnalysis()...',
      );

      const result =
        await runAnalysis({
          dataset:
            datasetProfile,

          /*
           * CRITICAL:
           *
           * Pass the COMPLETE parsed dataset here.
           *
           * This is used both by the deterministic analyzer
           * and by the AI prompt.
           */
          rows:
            parsedDataset.rows,

          messages,

          userQuestion,

          model,
        });

      console.log(
        '[10] runAnalysis() completed.',
      );

      console.log(
        '[10] AI RESULT:',
        result,
      );

      /* -------------------------------------------------------------------- */
      /* SAVE RESULT                                                          */
      /* -------------------------------------------------------------------- */

      console.log(
        '[11] Saving analysis result...',
      );

      const completedAnalysis =
        await prisma.analysis.update({
          where: {
            id:
              analysis.id,
          },

          data: {
            result,

            status:
              'COMPLETED',

            completedAt:
              new Date(),
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

      console.log(
        '[11] Analysis saved successfully.',
      );

      console.log(
        '[11] Analysis ID:',
        completedAnalysis.id,
      );

      console.log('');
      console.log(
        '==================================================',
      );

      console.log(
        'ANALYZE DATASET REQUEST COMPLETED',
      );

      console.log(
        '==================================================',
      );

      /* -------------------------------------------------------------------- */
      /* RESPONSE                                                             */
      /* -------------------------------------------------------------------- */

      return NextResponse.json({
        analysis:
          completedAnalysis,
      });
    } catch (
      analysisError
    ) {
      /* -------------------------------------------------------------------- */
      /* MARK ANALYSIS FAILED                                                 */
      /* -------------------------------------------------------------------- */

      console.error(
        '[12] AI ANALYSIS FAILED:',
        analysisError,
      );

      await prisma.analysis.update({
        where: {
          id:
            analysis.id,
        },

        data: {
          status:
            'FAILED',

          errorMessage:
            analysisError instanceof
            Error
              ? analysisError.message
              : 'Analysis failed.',
        },
      });

      throw analysisError;
    }
  } catch (error) {
    console.error('');
    console.error(
      '==================================================',
    );

    console.error(
      'POST /api/datasets/[datasetId]/analyze FAILED',
    );

    console.error(
      '==================================================',
    );

    console.error(
      'Error:',
      error,
    );

    console.error(
      'Stack:',
      error instanceof Error
        ? error.stack
        : undefined,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to analyze dataset.',
      },
      {
        status: 500,
      },
    );
  }
}