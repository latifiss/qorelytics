import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                              OPENROUTER                                    */
/* -------------------------------------------------------------------------- */

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

/* -------------------------------------------------------------------------- */
/*                              INPUT TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface DatasetProfile {
  fileName: string;
  fileType: string;

  rowCount?: number;
  columnCount?: number;

  columns?: Array<{
    name: string;
    type: string;
    nullable?: boolean;
    uniqueCount?: number;
    sampleValues?: unknown[];
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
  }>;

  sampleRows?: Record<string, unknown>[];

  statistics?: Record<string, unknown>;

  textContent?: string;

  isStructured?: boolean;
  isQuantitative?: boolean;

  warnings?: string[];
}

/* -------------------------------------------------------------------------- */
/*                         CONVERSATION TYPES                                 */
/* -------------------------------------------------------------------------- */

export interface AnalysisMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* -------------------------------------------------------------------------- */
/*                              CHART SCHEMA                                  */
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

  description: z.string().optional(),

  dimensions: z.array(z.string()),

  measures: z.array(z.string()),

  reason: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                          ANALYSIS RESULT                                   */
/* -------------------------------------------------------------------------- */

export const analysisResultSchema = z.object({
  status: z.enum([
    'success',
    'partial',
    'unsupported',
    'insufficient_data',
  ]),

  response: z.string(),

  summary: z.string(),

  datasetAssessment: z.object({
    isAnalyzable: z.boolean(),

    isStructured: z.boolean(),

    isQuantitative: z.boolean(),

    confidence: z.number().min(0).max(1),

    explanation: z.string(),
  }),

  sections: z.array(
    z.object({
      title: z.string(),

      content: z.string(),

      importance: z.enum([
        'high',
        'medium',
        'low',
      ]),
    }),
  ),

  charts: z.array(chartSchema),

  recommendations: z.array(
    z.object({
      title: z.string(),

      description: z.string(),

      priority: z.enum([
        'high',
        'medium',
        'low',
      ]),
    }),
  ),

  limitations: z.array(z.string()),

  suggestedFollowUps: z.array(z.string()),
});

export type AnalysisResult = z.infer<
  typeof analysisResultSchema
>;

/* -------------------------------------------------------------------------- */
/*                            SYSTEM PROMPT                                   */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `
You are Qorelytics, an AI data analyst.

Your job is to analyze user-provided datasets and produce useful,
accurate and honest analytical responses.

You are NOT a generic chatbot pretending that every input is a dataset.

You must first determine what the user actually provided.

==================================================
DATASET CLASSIFICATION
==================================================

A dataset can be:

1. Structured and quantitative
2. Structured but mostly categorical
3. Structured but insufficient for meaningful analysis
4. Unstructured text
5. An essay/article/document
6. A malformed or unsupported file
7. Empty or nearly empty
8. Potentially sensitive or problematic content

Do not force quantitative analysis when the input does not support it.

For example:

If the user uploads:

"Climate change is one of the biggest challenges..."

That is not a sales dataset.

DO NOT invent:

- revenue
- rows
- growth
- percentages
- trends
- correlations
- charts

Instead, clearly explain that the content is primarily textual and explain
what Qorelytics can reasonably do with it.

==================================================
ANALYSIS PRINCIPLES
==================================================

Never fabricate facts.

Every factual analytical claim must be supported by the provided data,
dataset profile, statistics, sample rows, or conversation context.

If there is insufficient evidence, explicitly say so.

Prefer useful analysis over producing lots of output.

Do not create charts simply because charts are available.

Charts should only be recommended when the available data actually supports
the visualization.

There may be:

- zero charts
- one chart
- two charts
- many charts

The number of charts is determined by the data and analytical value.

==================================================
CHART SELECTION
==================================================

Only recommend a chart when it provides meaningful visual insight.

Examples:

Time + numeric measure
-> line or area

Category + numeric measure
-> bar or horizontal-bar

Two numeric measures
-> scatter

Distribution of numeric values
-> histogram or box-plot

Part-to-whole relationship
-> pie or donut

Multiple categorical/numeric comparisons
-> grouped-bar or stacked-bar

Hierarchical data
-> treemap

Sequential stages
-> funnel

Flow between categories
-> sankey

Do not recommend a chart when:

- there is insufficient data
- the dimension has excessive cardinality
- the chart would be misleading
- the data is primarily prose
- the result would not provide meaningful insight

==================================================
SECTIONS
==================================================

Sections must be dynamic.

Do NOT assume the report always contains:

Dataset Overview
Revenue Trend Analysis
Product Category Breakdown
Regional Performance
Recommendations

Those were only frontend demo data.

Create sections based on the actual analysis.

Possible sections could include:

Dataset Overview
Data Quality
Revenue Analysis
Customer Retention
Product Performance
Regional Performance
Correlation Analysis
Outliers
Trend Analysis
Recommendations

But use only sections relevant to the actual dataset.

==================================================
TEXT / ESSAY INPUT
==================================================

If the uploaded content is primarily prose:

Do not pretend it is quantitative data.

Instead, intelligently explain what can be done.

For example, depending on the content, you may provide:

- document summary
- key themes
- topic extraction
- sentiment observations
- keyword patterns
- structure analysis
- readability observations
- entities
- contradictions
- areas requiring clarification

Only make claims that can reasonably be derived from the provided text.

If the text is too large to analyze completely, state that clearly.

==================================================
FOLLOW-UP QUESTIONS
==================================================

The user may continue the conversation after the initial analysis.

Follow-up questions must be answered using:

1. The original dataset
2. The original analysis
3. Previous conversation messages
4. The user's latest question

Do not treat a follow-up as a completely new analysis.

For example:

User:
"Which region performed best?"

Assistant:
"North America..."

User:
"Why?"

The second response must use the existing analysis context.

==================================================
OUTPUT
==================================================

Return structured analytical information.

The response field should be the natural-language answer that the user sees
above the generated report.

Sections should contain the analytical report content.

Charts should describe charts that the frontend can later generate.

Do not embed fabricated chart data.

Do not use markdown code fences around the output.

Be concise where possible, but provide enough analytical reasoning to be useful.
`;

/* -------------------------------------------------------------------------- */
/*                          CONTEXT BUILDER                                   */
/* -------------------------------------------------------------------------- */

function buildDatasetContext(
  profile: DatasetProfile,
): string {
  const parts: string[] = [];

  parts.push(
    `File name: ${profile.fileName}`,
  );

  parts.push(
    `File type: ${profile.fileType}`,
  );

  if (
    typeof profile.rowCount === 'number'
  ) {
    parts.push(
      `Rows: ${profile.rowCount}`,
    );
  }

  if (
    typeof profile.columnCount === 'number'
  ) {
    parts.push(
      `Columns: ${profile.columnCount}`,
    );
  }

  if (
    typeof profile.isStructured ===
    'boolean'
  ) {
    parts.push(
      `Structured data: ${profile.isStructured}`,
    );
  }

  if (
    typeof profile.isQuantitative ===
    'boolean'
  ) {
    parts.push(
      `Quantitative data: ${profile.isQuantitative}`,
    );
  }

  if (profile.warnings?.length) {
    parts.push(
      `Warnings:\n${profile.warnings.join('\n')}`,
    );
  }

  if (profile.columns?.length) {
    parts.push(
      `Columns:\n${JSON.stringify(
        profile.columns,
        null,
        2,
      )}`,
    );
  }

  if (profile.statistics) {
    parts.push(
      `Statistics:\n${JSON.stringify(
        profile.statistics,
        null,
        2,
      )}`,
    );
  }

  if (profile.sampleRows?.length) {
    parts.push(
      `Sample rows:\n${JSON.stringify(
        profile.sampleRows,
        null,
        2,
      )}`,
    );
  }

  if (profile.textContent) {
    parts.push(
      `Text content:\n${profile.textContent}`,
    );
  }

  return parts.join('\n\n');
}

/* -------------------------------------------------------------------------- */
/*                       CONVERSATION BUILDER                                 */
/* -------------------------------------------------------------------------- */

function buildConversationContext(
  messages: AnalysisMessage[],
): string {
  if (!messages.length) {
    return 'No previous conversation.';
  }

  return messages
    .map(
      (message) =>
        `${message.role.toUpperCase()}: ${message.content}`,
    )
    .join('\n\n');
}

/* -------------------------------------------------------------------------- */
/*                           MAIN ANALYZER                                    */
/* -------------------------------------------------------------------------- */

export async function runAnalysis({
  dataset,
  messages = [],
  userQuestion,
}: {
  dataset: DatasetProfile;
  messages?: AnalysisMessage[];
  userQuestion?: string;
}): Promise<AnalysisResult> {
  const datasetContext =
    buildDatasetContext(dataset);

  const conversationContext =
    buildConversationContext(messages);

  const latestQuestion =
    userQuestion?.trim() ||
    'Analyze this dataset and provide the most useful insights you can derive from it.';

  const prompt = `
DATASET
==================================================

${datasetContext}

==================================================
PREVIOUS CONVERSATION
==================================================

${conversationContext}

==================================================
LATEST USER REQUEST
==================================================

${latestQuestion}

==================================================
TASK
==================================================

Analyze the provided information.

Remember:

- Do not invent data.
- Do not force charts.
- Do not force quantitative analysis.
- Handle unsuitable inputs intelligently.
- Use previous conversation context for follow-ups.
- Produce only insights supported by the available information.
`;

  const result = await generateObject({
    model: openrouter(
      'openai/gpt-4o-mini',
    ),

    schema: analysisResultSchema,

    system: SYSTEM_PROMPT,

    prompt,

    temperature: 0.2,
  });

  return result.object;
}