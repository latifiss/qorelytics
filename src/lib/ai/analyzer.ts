import { generateObject } from 'ai';
import { z } from 'zod';

import { getModel } from '@/src/lib/ai/model';

import {
  analyzeDatasetStructure,
  createAnalysisContext,
} from '@/src/lib/analysis/analyzer';

import type { DatasetProfile } from '@/src/types/dataset';

/* -------------------------------------------------------------------------- */
/* CONVERSATION                                                               */
/* -------------------------------------------------------------------------- */

export interface AnalysisMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* -------------------------------------------------------------------------- */
/* CHART SCHEMA                                                               */
/* -------------------------------------------------------------------------- */

const chartSchema = z.object({
  type: z.enum([
    'bar',
    'horizontal-bar',
    'grouped-bar',
    'stacked-bar',
    'line',
    'area',
    'pie',
    'donut',
    'scatter',
    'histogram',
    'box-plot',
    'funnel',
    'waterfall',
    'radar',
    'treemap',
    'gauge',
    'sankey',
  ]),

  title: z.string(),

  description: z.string(),

  dimensions: z.array(
    z.string(),
  ),

  measures: z.array(
    z.string(),
  ),

  reason: z.string(),
});

/* -------------------------------------------------------------------------- */
/* ANALYSIS RESULT                                                            */
/* -------------------------------------------------------------------------- */

export const analysisResultSchema =
  z.object({
    status: z.enum([
      'success',
      'partial',
      'unsupported',
      'insufficient_data',
    ]),

    response: z.string(),

    summary: z.string(),

    datasetAssessment:
      z.object({
        isAnalyzable:
          z.boolean(),

        isStructured:
          z.boolean(),

        isQuantitative:
          z.boolean(),

        confidence:
          z
            .number()
            .min(0)
            .max(1),

        explanation:
          z.string(),
      }),

    sections: z.array(
      z.object({
        title: z.string(),

        content:
          z.string(),

        importance:
          z.enum([
            'high',
            'medium',
            'low',
          ]),
      }),
    ),

    charts: z.array(
      chartSchema,
    ),

    recommendations:
      z.array(
        z.object({
          title:
            z.string(),

          description:
            z.string(),

          priority:
            z.enum([
              'high',
              'medium',
              'low',
            ]),
        }),
      ),

    limitations:
      z.array(
        z.string(),
      ),

    suggestedFollowUps:
      z.array(
        z.string(),
      ),
  });

export type AnalysisResult =
  z.infer<
    typeof analysisResultSchema
  >;

/* -------------------------------------------------------------------------- */
/* SYSTEM PROMPT                                                              */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `
You are Qorelytics, an intelligent AI data analyst.

Your job is to analyze the ACTUAL DATA provided to you and produce useful,
honest, evidence-based insights.

You are part of a real data-analysis product.

You are NOT a generic chatbot.

==================================================
SOURCE OF TRUTH
==================================================

There are several context sections in the user prompt.

Use them in this priority order:

1. ACTUAL DATA ROWS
2. DETERMINISTIC DATASET ANALYSIS
3. DATASET PROFILE
4. PREVIOUS CONVERSATION
5. CURRENT USER REQUEST

The ACTUAL DATA ROWS are the source of truth for actual records.

The deterministic analysis contains calculated statistics derived from
those records.

The Dataset Profile contains ingestion metadata and profiling information.

==================================================
ACTUAL DATA
==================================================

The ACTUAL DATA ROWS section contains the actual records parsed from the
uploaded file.

If the prompt says there are N actual records and N > 0, the dataset is NOT
empty.

Never say the dataset is empty merely because the Dataset Profile contains
only metadata or a sample.

==================================================
NO FABRICATION
==================================================

Never fabricate information.

Every analytical claim must be supported by:

- actual dataset rows
- deterministic analysis
- dataset profile
- conversation context
- current user request

Never invent:

- numbers
- percentages
- revenue
- dates
- correlations
- trends
- categories
- customer counts
- chart values
- statistical findings
- column names

If the available data cannot support a claim, say so.

==================================================
STRUCTURED DATA
==================================================

If actual structured records are present:

isStructured should normally be true.

If useful numeric columns are present:

isQuantitative should normally be true.

Only describe structured data as empty when there are genuinely zero actual
records.

A small dataset is still a dataset.

Do not equate "small" with "empty".

==================================================
SMALL DATASETS
==================================================

A dataset with only a few rows is NOT automatically insufficient.

Analyze the available records.

However, do not make strong statistical claims when the sample is too small.

For example:

- do not claim statistical significance from a tiny dataset
- do not claim a reliable long-term trend from two observations
- do not claim a robust correlation from insufficient observations

Explain the limitation instead.

Use status = "insufficient_data" only when there genuinely is not enough
useful information for the requested analysis.

==================================================
DETERMINISTIC ANALYSIS
==================================================

Use the deterministic analysis whenever available.

It may contain:

- column types
- missing values
- unique counts
- numeric statistics
- categorical distributions
- date ranges
- trends
- correlations
- duplicate counts
- data quality issues
- chart candidates

Do not contradict deterministic statistics unless the actual rows clearly
show that the deterministic interpretation is incorrect.

==================================================
DATASET INTERPRETATION
==================================================

The dataset may contain:

- dates
- categorical dimensions
- numeric measures
- boolean values
- text
- combinations of these

Use the actual rows to understand relationships between columns.

If deterministic statistics are available, use them.

==================================================
DYNAMIC REPORTS
==================================================

Do not use a fixed report template.

Generate sections based on the actual dataset.

Possible sections include:

- Dataset Overview
- Data Quality
- Revenue Performance
- Customer Analysis
- Revenue Trend
- Regional Performance
- Distribution Analysis
- Correlation Analysis
- Outlier Analysis
- Recommendations

Only create sections that are actually relevant.

==================================================
DYNAMIC CHARTS
==================================================

Charts are optional.

Use charts only when they communicate useful information.

The chart object describes WHAT should be visualized.

The frontend obtains actual values from the dataset.

Every chart dimension and measure MUST correspond to an actual dataset
column.

For example, if the actual dataset contains:

date
region
revenue

then a valid chart can contain:

dimensions: ["date"]
measures: ["revenue"]

Do NOT invent:

dimensions: ["month"]
measures: ["sales"]

==================================================
CHART TYPES
==================================================

Use:

line / area
for time-series data.

bar / horizontal-bar
for category comparisons.

grouped-bar
for multiple measures across categories.

stacked-bar
for meaningful composition.

pie / donut
only for meaningful small category proportions.

scatter
for relationships between numeric measures.

histogram
for numeric distributions.

box-plot
for comparing distributions.

treemap
for meaningful hierarchical/proportional data.

funnel
only when sequential stages actually exist.

sankey
only when source -> target -> value relationships actually exist.

radar
only when multiple comparable dimensions justify it.

gauge
only when a target or benchmark exists.

waterfall
only when sequential positive and negative contributions are represented.

Do not use advanced charts merely to make the result look impressive.

==================================================
FOLLOW-UP QUESTIONS
==================================================

Use:

1. Actual dataset
2. Deterministic analysis
3. Previous conversation
4. Current question

Do not restart conceptually for every follow-up.

Resolve references such as:

"Which region performed best?"

then:

"Why?"

using the same dataset and conversation.

==================================================
UNSTRUCTURED TEXT
==================================================

For essays, articles, notes, reports, documentation and plain text:

Do not pretend the content is quantitative.

Useful observations may include:

- summary
- themes
- structure
- repeated ideas
- important concepts
- readability
- sentiment
- entities
- contradictions

Do not generate quantitative charts for ordinary prose.

==================================================
RESPONSE STYLE
==================================================

Be:

- clear
- concise
- analytical
- confident when evidence is strong
- transparent when evidence is weak

Avoid unnecessary filler.

==================================================
OUTPUT
==================================================

Return ONLY the structured object matching the supplied schema.

The response field is the conversational answer.

The sections field is the generated report.

The charts field describes useful visualizations.

The recommendations field contains actionable recommendations.

The limitations field explains important limitations.

The suggestedFollowUps field contains useful questions the user could ask next.

Do not create fake data to make the output look complete.
`;

/* -------------------------------------------------------------------------- */
/* CONVERSATION BUILDER                                                       */
/* -------------------------------------------------------------------------- */

function buildConversationContext(
  messages: AnalysisMessage[],
): string {
  if (!messages.length) {
    return 'No previous conversation exists.';
  }

  return messages
    .map(
      (message, index) =>
        `MESSAGE ${index + 1}
ROLE: ${message.role.toUpperCase()}
CONTENT:
${message.content}`,
    )
    .join('\n\n');
}

/* -------------------------------------------------------------------------- */
/* DATASET PROFILE CONTEXT                                                    */
/* -------------------------------------------------------------------------- */

function buildDatasetProfileContext(
  profile: DatasetProfile,
): string {
  return JSON.stringify(
    {
      fileName:
        profile.fileName,

      fileType:
        profile.fileType,

      rowCount:
        profile.rowCount,

      columnCount:
        profile.columnCount,

      isStructured:
        profile.isStructured,

      isQuantitative:
        profile.isQuantitative,

      columns:
        profile.columns,

      statistics:
        profile.statistics,

      sampleRows:
        profile.sampleRows,

      preview:
        profile.preview,

      numericColumns:
        profile.numericColumns,

      categoricalColumns:
        profile.categoricalColumns,

      dateColumns:
        profile.dateColumns,

      totalMissingValues:
        profile.totalMissingValues,

      textContent:
        profile.textContent,

      warnings:
        profile.warnings,
    },
    null,
    2,
  );
}

/* -------------------------------------------------------------------------- */
/* MODEL                                                                      */
/* -------------------------------------------------------------------------- */

function getAIModel(
  model?: string,
) {
  return getModel(
    model ||
      'deepseek/deepseek-chat',
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN AI ANALYZER                                                           */
/* -------------------------------------------------------------------------- */

export async function runAnalysis({
  dataset,
  rows,
  messages = [],
  userQuestion,
  model,
}: {
  dataset: DatasetProfile;

  /**
   * The complete parsed dataset.
   *
   * This is the source of truth for deterministic analysis and
   * the actual data sent to the model.
   */
  rows: Record<
    string,
    unknown
  >[];

  messages?: AnalysisMessage[];

  userQuestion?: string;

  model?: string;
}): Promise<AnalysisResult> {
  console.log('');
  console.log(
    '==================================================',
  );
  console.log(
    'AI ANALYZER STARTED',
  );
  console.log(
    '==================================================',
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 1: INPUT VALIDATION                                               */
  /* ---------------------------------------------------------------------- */

  console.log(
    '[AI-1] Dataset profile received.',
  );

  console.log(
    '[AI-1] Profile rowCount:',
    dataset.rowCount,
  );

  console.log(
    '[AI-1] Profile columnCount:',
    dataset.columnCount,
  );

  console.log(
    '[AI-1] Profile isStructured:',
    dataset.isStructured,
  );

  console.log(
    '[AI-1] Profile isQuantitative:',
    dataset.isQuantitative,
  );

  console.log(
    '[AI-1] Actual rows received:',
    rows.length,
  );

  console.log(
    '[AI-1] Actual columns:',
    rows.length > 0
      ? Object.keys(rows[0])
      : [],
  );

  if (rows.length > 0) {
    console.log(
      '[AI-1] FIRST ACTUAL ROW:',
    );

    console.dir(rows[0], {
      depth: null,
    });
  }

  if (rows.length === 0) {
    console.error(
      '[AI-1] ERROR: Analyzer received ZERO actual rows.',
    );

    throw new Error(
      'Analyzer received an empty dataset.',
    );
  }

  /* ---------------------------------------------------------------------- */
  /* STEP 2: DETERMINISTIC ANALYSIS                                         */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '[AI-2] Running deterministic dataset analysis...',
  );

  const deterministicAnalysis =
    analyzeDatasetStructure(
      dataset,
      rows,
    );

  console.log(
    '[AI-2] Deterministic analysis completed.',
  );

  console.log(
    '[AI-2] Deterministic row count:',
    deterministicAnalysis.rowCount,
  );

  console.log(
    '[AI-2] Deterministic column count:',
    deterministicAnalysis.columnCount,
  );

  console.log(
    '[AI-2] Deterministic status:',
    deterministicAnalysis.status,
  );

  console.dir(
    deterministicAnalysis,
    {
      depth: null,
    },
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 3: COMPACT ANALYSIS CONTEXT                                       */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '[AI-3] Creating deterministic analysis context...',
  );

  const analysisContext =
    createAnalysisContext(
      deterministicAnalysis,
    );

  console.log(
    '[AI-3] Analysis context created.',
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 4: PROFILE CONTEXT                                                */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '[AI-4] Creating dataset profile context...',
  );

  const profileContext =
    buildDatasetProfileContext(
      dataset,
    );

  console.log(
    '[AI-4] Dataset profile context created.',
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 5: ACTUAL DATA CONTEXT                                            */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '[AI-5] Creating ACTUAL DATA context...',
  );

  const actualDataContext =
    JSON.stringify(
      rows,
      null,
      2,
    );

  console.log(
    '[AI-5] Actual data JSON length:',
    actualDataContext.length,
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 6: CONVERSATION CONTEXT                                           */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '[AI-6] Building conversation context...',
  );

  const conversationContext =
    buildConversationContext(
      messages,
    );

  console.log(
    '[AI-6] Message count:',
    messages.length,
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 7: LATEST QUESTION                                                */
  /* ---------------------------------------------------------------------- */

  const latestQuestion =
    userQuestion?.trim() ||
    'Analyze this uploaded dataset and provide the most useful insights supported by the available information.';

  console.log('');
  console.log(
    '[AI-7] Latest user question:',
  );

  console.log(
    latestQuestion,
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 8: FINAL PROMPT                                                    */
  /* ---------------------------------------------------------------------- */

  const prompt = `
==================================================
DATASET PROFILE
==================================================

${profileContext}

==================================================
ACTUAL DATA ROWS
==================================================

IMPORTANT:

The following are the ACTUAL RECORDS parsed from the uploaded dataset.

Actual record count:

${rows.length}

If this number is greater than zero, the dataset is NOT empty.

Do not describe this dataset as empty.

ACTUAL DATA:

${actualDataContext}

==================================================
DETERMINISTIC DATASET ANALYSIS
==================================================

${analysisContext}

==================================================
PREVIOUS CONVERSATION
==================================================

${conversationContext}

==================================================
LATEST USER REQUEST
==================================================

${latestQuestion}

==================================================
ANALYSIS TASK
==================================================

Analyze the actual dataset.

The ACTUAL DATA ROWS section contains the real records.

Use those records together with the deterministic analysis.

Before deciding that the dataset is empty, inspect the ACTUAL DATA ROWS.

If rows are present, the dataset is NOT empty.

Every chart dimension and measure must correspond to an actual dataset
column.

Do not fabricate values.

Follow all system instructions.

Return the complete structured analysis.
`;

  console.log('');
  console.log(
    '==================================================',
  );

  console.log(
    '[AI-8] FINAL PROMPT CREATED',
  );

  console.log(
    '==================================================',
  );

  console.log(
    '[AI-8] Prompt length:',
    prompt.length,
  );

  console.log(
    '[AI-8] Prompt contains actual data:',
    prompt.includes(
      'ACTUAL DATA ROWS',
    ),
  );

  console.log(
    '[AI-8] Actual record count:',
    rows.length,
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 9: MODEL                                                          */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '[AI-9] Resolving AI model...',
  );

  const aiModel =
    getAIModel(model);

  console.log(
    '[AI-9] AI model resolved.',
  );

  console.log(
    '[AI-9] Requested model:',
    model ||
      'deepseek/deepseek-chat',
  );

  /* ---------------------------------------------------------------------- */
  /* STEP 10: GENERATE STRUCTURED RESULT                                    */
  /* ---------------------------------------------------------------------- */

  console.log('');
  console.log(
    '==================================================',
  );

  console.log(
    '[AI-10] CALLING generateObject()',
  );

  console.log(
    '==================================================',
  );

  const startTime =
    Date.now();

  try {
    const result =
      await generateObject({
        model: aiModel,

        schema:
          analysisResultSchema,

        system:
          SYSTEM_PROMPT,

        prompt,

        temperature: 0.2,
      });

    const duration =
      Date.now() -
      startTime;

    console.log('');
    console.log(
      '[AI-10] generateObject() completed.',
    );

    console.log(
      '[AI-10] Duration:',
      `${duration}ms`,
    );

    console.log(
      '[AI-10] Result status:',
      result.object.status,
    );

    console.log(
      '[AI-10] Result summary:',
      result.object.summary,
    );

    console.log(
      '[AI-10] Is analyzable:',
      result.object
        .datasetAssessment
        .isAnalyzable,
    );

    console.log(
      '[AI-10] Is structured:',
      result.object
        .datasetAssessment
        .isStructured,
    );

    console.log(
      '[AI-10] Is quantitative:',
      result.object
        .datasetAssessment
        .isQuantitative,
    );

    console.log(
      '[AI-10] Chart count:',
      result.object
        .charts.length,
    );

    console.log(
      '[AI-10] Section count:',
      result.object
        .sections.length,
    );

    console.log(
      '[AI-10] Recommendation count:',
      result.object
        .recommendations
        .length,
    );

    console.log('');
    console.log(
      '==================================================',
    );

    console.log(
      'AI ANALYZER COMPLETED',
    );

    console.log(
      '==================================================',
    );

    return result.object;
  } catch (error) {
    console.error('');
    console.error(
      '==================================================',
    );

    console.error(
      '[AI-10] generateObject() FAILED',
    );

    console.error(
      '==================================================',
    );

    console.error(
      '[AI-10] Error:',
      error,
    );

    throw error;
  }
}