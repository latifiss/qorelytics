import { NextRequest, NextResponse } from 'next/server';

import {
  runAnalysis,
  type AnalysisMessage,
} from '@/src/lib/ai/analyzer';

import type { DatasetProfile } from '@/src/types/dataset';

/* -------------------------------------------------------------------------- */
/*                              REQUEST TYPES                                 */
/* -------------------------------------------------------------------------- */

interface AnalysisRequestBody {
  dataset: DatasetProfile;

  messages?: AnalysisMessage[];

  userQuestion?: string;
}

/* -------------------------------------------------------------------------- */
/*                              POST /api/analysis                            */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: NextRequest,
) {
  try {
    /* ---------------------------------------------------------------------- */
    /* PARSE REQUEST                                                          */
    /* ---------------------------------------------------------------------- */

    const body =
      (await request.json()) as AnalysisRequestBody;

    /* ---------------------------------------------------------------------- */
    /* VALIDATE DATASET                                                       */
    /* ---------------------------------------------------------------------- */

    if (
      !body ||
      !body.dataset
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Dataset is required.',
        },
        {
          status: 400,
        },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* VALIDATE CONVERSATION                                                  */
    /* ---------------------------------------------------------------------- */

    const messages =
      Array.isArray(
        body.messages,
      )
        ? body.messages
        : [];

    /* ---------------------------------------------------------------------- */
    /* VALIDATE MESSAGE ROLES                                                 */
    /* ---------------------------------------------------------------------- */

    const validMessages =
      messages.filter(
        (message) =>
          message &&
          (message.role ===
            'user' ||
            message.role ===
              'assistant') &&
          typeof message.content ===
            'string',
      );

    /* ---------------------------------------------------------------------- */
    /* USER QUESTION                                                          */
    /* ---------------------------------------------------------------------- */

    const userQuestion =
      typeof body.userQuestion ===
      'string'
        ? body.userQuestion.trim()
        : undefined;

    /* ---------------------------------------------------------------------- */
    /* RUN ANALYSIS                                                           */
    /* ---------------------------------------------------------------------- */

    const result =
      await runAnalysis({
        dataset:
          body.dataset,

        messages:
          validMessages,

        userQuestion,
      });

    /* ---------------------------------------------------------------------- */
    /* RETURN STRUCTURED RESULT                                               */
    /* ---------------------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /* ---------------------------------------------------------------------- */
    /* SERVER ERROR                                                            */
    /* ---------------------------------------------------------------------- */

    console.error(
      '[POST /api/analysis]',
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while analyzing the dataset.',
      },
      {
        status: 500,
      },
    );
  }
}