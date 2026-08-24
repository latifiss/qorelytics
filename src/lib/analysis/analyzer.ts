import type { DatasetProfile } from '@/src/types/dataset';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type ColumnKind =
  | 'numeric'
  | 'date'
  | 'boolean'
  | 'categorical'
  | 'text'
  | 'unknown';

export type TrendPeriod =
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

export interface NumericStats {
  count: number;
  missing: number;
  invalid: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  median: number | null;
  sum: number | null;
  standardDeviation: number | null;
  uniqueCount: number;
}

export interface CategoricalStats {
  count: number;
  missing: number;
  uniqueCount: number;
  topValues: Array<{
    value: string;
    count: number;
    percentage: number;
  }>;
}

export interface DateStats {
  count: number;
  missing: number;
  invalid: number;
  min: string | null;
  max: string | null;
  spanDays: number | null;
  uniqueCount: number;
}

export interface ColumnAnalysis {
  name: string;
  kind: ColumnKind;
  nullable: boolean;
  uniqueCount: number;
  missingCount: number;
  invalidCount: number;
  missingPercentage: number;
  uniquePercentage: number;
  isLikelyIdentifier: boolean;
  sampleValues: string[];

  numeric?: NumericStats;
  categorical?: CategoricalStats;
  date?: DateStats;
}

export interface TrendAnalysis {
  column: string;

  period: TrendPeriod;

  direction:
    | 'increasing'
    | 'decreasing'
    | 'flat'
    | 'unknown';

  changePercentage: number | null;

  firstValue: number | null;
  lastValue: number | null;

  slope: number | null;

  periodCount: number;

  populatedPeriods: number;

  missingPeriods: number;

  coveragePercentage: number;

  aggregation:
    | 'average'
    | 'sum';

  confidence:
    | 'high'
    | 'medium'
    | 'low';
}

export interface CorrelationAnalysis {
  columnA: string;
  columnB: string;
  correlation: number;

  strength:
    | 'very-strong'
    | 'strong'
    | 'moderate'
    | 'weak';

  direction: 'positive' | 'negative';

  sampleSize: number;
}

export interface DataQualityIssue {
  type:
    | 'missing-values'
    | 'high-cardinality'
    | 'constant-column'
    | 'mostly-text'
    | 'invalid-values'
    | 'duplicate-rows';

  column?: string;

  severity:
    | 'high'
    | 'medium'
    | 'low';

  message: string;
}

export interface DatasetAnalysis {
  status:
    | 'analyzable'
    | 'partially-analyzable'
    | 'not-analyzable';

  reason?: string;

  rowCount: number;
  columnCount: number;

  columns: ColumnAnalysis[];

  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];
  textColumns: string[];

  measures: string[];
  dimensions: string[];
  dateDimensions: string[];

  trends: TrendAnalysis[];

  correlations: CorrelationAnalysis[];

  qualityIssues: DataQualityIssue[];

  duplicateRows: number;

  analysisCapabilities: {
    canAnalyzeTrends: boolean;
    canAnalyzeDistributions: boolean;
    canAnalyzeCorrelations: boolean;
    canGenerateCharts: boolean;
    canGenerateTimeSeries: boolean;
  };

  chartCandidates: ChartCandidate[];
}

export interface ChartCandidate {
  type:
    | 'line'
    | 'area'
    | 'bar'
    | 'horizontal-bar'
    | 'grouped-bar'
    | 'stacked-bar'
    | 'pie'
    | 'donut'
    | 'scatter'
    | 'histogram'
    | 'box-plot'
    | 'treemap';

  title: string;

  dimension?: string;

  measures: string[];

  reason: string;

  priority: number;
}

/* -------------------------------------------------------------------------- */
/* GENERIC DATA TYPES                                                         */
/* -------------------------------------------------------------------------- */

type DataRow = Record<string, unknown>;

interface ParsedDateValue {
  date: Date;
  timestamp: number;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MISSING_TOKENS = new Set([
  '',
  'null',
  'undefined',
  'n/a',
  'na',
  'nan',
  'missing',
  'none',
  '-',
  '--',
]);

const BOOLEAN_TOKENS = new Set([
  'true',
  'false',
  'yes',
  'no',
  'y',
  'n',
]);

const IDENTIFIER_NAME_PATTERN =
  /(^|[_\-\s])(id|uuid|key|code|identifier|index|number)$/i;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function toRows(
  rows: Record<string, unknown>[],
): DataRow[] {
  return rows.filter(isObject);
}

function getProfileColumns(
  profile: DatasetProfile,
  rows: DataRow[],
): string[] {
  const value =
    profile as unknown as Record<string, unknown>;

  const candidate = value.columns;

  if (Array.isArray(candidate)) {
    const names = candidate
      .map((column) => {
        if (typeof column === 'string') {
          return column;
        }

        if (isObject(column)) {
          const name = column.name;

          if (typeof name === 'string') {
            return name;
          }
        }

        return null;
      })
      .filter(
        (name): name is string =>
          typeof name === 'string',
      );

    if (names.length > 0) {
      return names;
    }
  }

  const names = new Set<string>();

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      names.add(key);
    }
  }

  return Array.from(names);
}

function normalizeString(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value).trim();
}

function isMissing(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  if (typeof value === 'string') {
    return MISSING_TOKENS.has(
      value.trim().toLowerCase(),
    );
  }

  return false;
}

function percentage(
  numerator: number,
  denominator: number,
): number {
  if (denominator === 0) {
    return 0;
  }

  return (
    (numerator / denominator) * 100
  );
}

function round(
  value: number,
  decimals = 4,
): number {
  const factor =
    10 ** decimals;

  return (
    Math.round(value * factor) /
    factor
  );
}

/* -------------------------------------------------------------------------- */
/* NUMBER PARSING                                                             */
/* -------------------------------------------------------------------------- */

function toNumber(
  value: unknown,
): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;

  const isNegativeAccounting =
    /^\(.*\)$/.test(normalized);

  if (isNegativeAccounting) {
    normalized = normalized.slice(
      1,
      -1,
    );
  }

  normalized = normalized
    .replace(
      /[$€£¥₹₵₦,%]/g,
      '',
    )
    .replace(/\s+/g, '')
    .replace(/,/g, '');

  if (!normalized) {
    return null;
  }

  /*
   * Never interpret ISO-like dates as numbers.
   */
  if (
    /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s].*)?$/.test(
      normalized,
    )
  ) {
    return null;
  }

  /*
   * Reject strings containing letters.
   */
  if (/[a-z]/i.test(normalized)) {
    return null;
  }

  /*
   * Complete numeric representation.
   */
  const numericPattern =
    /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i;

  if (
    !numericPattern.test(
      normalized,
    )
  ) {
    return null;
  }

  const number = Number(
    normalized,
  );

  if (!Number.isFinite(number)) {
    return null;
  }

  return isNegativeAccounting
    ? -number
    : number;
}

/* -------------------------------------------------------------------------- */
/* BOOLEAN DETECTION                                                          */
/* -------------------------------------------------------------------------- */

function isBooleanLike(
  value: unknown,
): boolean {
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  return BOOLEAN_TOKENS.has(
    value.trim().toLowerCase(),
  );
}

/* -------------------------------------------------------------------------- */
/* DATE PARSING                                                               */
/* -------------------------------------------------------------------------- */

function parseDate(
  value: unknown,
): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(
      value.getTime(),
    )
      ? null
      : value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  /*
   * ISO:
   *
   * 2025-01-15
   * 2025-01-15T10:30:00Z
   * 2025-01-15 10:30:00
   */
  const isoDatePattern =
    /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s].*)?$/;

  /*
   * Slash:
   *
   * 2025/01/15
   * 01/15/2025
   * 15/01/2025
   */
  const slashDatePattern =
    /^(?:\d{4}\/\d{1,2}\/\d{1,2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\s.*)?$/;

  /*
   * Textual:
   *
   * Jan 15, 2025
   * January 15, 2025
   */
  const textualDatePattern =
    /^(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:,\s*|\s+)\d{4}$/i;

  if (
    !isoDatePattern.test(
      normalized,
    ) &&
    !slashDatePattern.test(
      normalized,
    ) &&
    !textualDatePattern.test(
      normalized,
    )
  ) {
    return null;
  }

  const date = new Date(
    normalized,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date;
}

function parseDateValue(
  value: unknown,
): ParsedDateValue | null {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  return {
    date,
    timestamp: date.getTime(),
  };
}

function looksLikeDateColumn(
  values: unknown[],
): boolean {
  const validValues = values.filter(
    (value) => !isMissing(value),
  );

  if (validValues.length < 3) {
    return false;
  }

  const parsedCount =
    validValues.filter(
      (value) =>
        parseDate(value) !== null,
    ).length;

  return (
    parsedCount /
      validValues.length >=
    0.8
  );
}

function looksLikeNumericColumn(
  values: unknown[],
): boolean {
  const validValues = values.filter(
    (value) => !isMissing(value),
  );

  if (validValues.length === 0) {
    return false;
  }

  const numericCount =
    validValues.filter(
      (value) =>
        toNumber(value) !== null,
    ).length;

  return (
    numericCount /
      validValues.length >=
    0.8
  );
}

/* -------------------------------------------------------------------------- */
/* COLUMN TYPE DETECTION                                                      */
/* -------------------------------------------------------------------------- */

function determineColumnKind(
  values: unknown[],
): ColumnKind {
  const validValues = values.filter(
    (value) => !isMissing(value),
  );

  if (validValues.length === 0) {
    return 'unknown';
  }

  /*
   * Boolean first.
   */
  if (
    validValues.every(
      isBooleanLike,
    )
  ) {
    return 'boolean';
  }

  /*
   * Numeric before date.
   *
   * This prevents values such as:
   *
   * 202401
   * 202402
   * 202403
   *
   * from becoming dates.
   */
  if (
    looksLikeNumericColumn(
      validValues,
    )
  ) {
    return 'numeric';
  }

  /*
   * Strict date detection.
   */
  if (
    looksLikeDateColumn(
      validValues,
    )
  ) {
    return 'date';
  }

  const uniqueValues =
    new Set(
      validValues.map(
        normalizeString,
      ),
    );

  const uniqueRatio =
    uniqueValues.size /
    validValues.length;

  /*
   * Categorical:
   *
   * - <= 100 unique values
   * - or <= 50% unique
   */
  if (
    uniqueValues.size <= 100 ||
    uniqueRatio <= 0.5
  ) {
    return 'categorical';
  }

  return 'text';
}

/* -------------------------------------------------------------------------- */
/* STATISTICS                                                                 */
/* -------------------------------------------------------------------------- */

function median(
  values: number[],
): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort(
    (a, b) => a - b,
  );

  const middle =
    Math.floor(
      sorted.length / 2,
    );

  if (
    sorted.length % 2 ===
    0
  ) {
    return (
      (sorted[middle - 1] +
        sorted[middle]) /
      2
    );
  }

  return sorted[middle];
}

/*
 * Population standard deviation.
 */
function standardDeviation(
  values: number[],
): number | null {
  if (values.length < 2) {
    return null;
  }

  const mean =
    values.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / values.length;

  const variance =
    values.reduce(
      (sum, value) =>
        sum +
        (value - mean) ** 2,
      0,
    ) / values.length;

  return Math.sqrt(
    variance,
  );
}

/* -------------------------------------------------------------------------- */
/* NUMERIC ANALYSIS                                                           */
/* -------------------------------------------------------------------------- */

function analyzeNumericColumn(
  values: unknown[],
): NumericStats {
  const numericValues: number[] = [];

  let missing = 0;
  let invalid = 0;

  for (const value of values) {
    if (isMissing(value)) {
      missing++;
      continue;
    }

    const numeric = toNumber(
      value,
    );

    if (numeric === null) {
      invalid++;
      continue;
    }

    numericValues.push(
      numeric,
    );
  }

  if (
    numericValues.length ===
    0
  ) {
    return {
      count: 0,
      missing,
      invalid,
      min: null,
      max: null,
      mean: null,
      median: null,
      sum: null,
      standardDeviation: null,
      uniqueCount: 0,
    };
  }

  let sum = 0;
  let min =
    numericValues[0];
  let max =
    numericValues[0];

  for (const value of numericValues) {
    sum += value;

    if (value < min) {
      min = value;
    }

    if (value > max) {
      max = value;
    }
  }

  return {
    count:
      numericValues.length,
    missing,
    invalid,
    min,
    max,
    mean:
      sum /
      numericValues.length,
    median:
      median(
        numericValues,
      ),
    sum,
    standardDeviation:
      standardDeviation(
        numericValues,
      ),
    uniqueCount:
      new Set(
        numericValues,
      ).size,
  };
}

/* -------------------------------------------------------------------------- */
/* CATEGORICAL ANALYSIS                                                       */
/* -------------------------------------------------------------------------- */

function analyzeCategoricalColumn(
  values: unknown[],
): CategoricalStats {
  const counts =
    new Map<
      string,
      number
    >();

  let missing = 0;

  for (const value of values) {
    if (isMissing(value)) {
      missing++;
      continue;
    }

    const normalized =
      normalizeString(value);

    counts.set(
      normalized,
      (counts.get(
        normalized,
      ) ?? 0) + 1,
    );
  }

  const validCount =
    values.length - missing;

  const topValues =
    Array.from(
      counts.entries(),
    )
      .sort(
        (a, b) =>
          b[1] - a[1],
      )
      .slice(0, 10)
      .map(
        ([value, count]) => ({
          value,
          count,
          percentage: round(
            percentage(
              count,
              validCount,
            ),
            2,
          ),
        }),
      );

  return {
    count: validCount,
    missing,
    uniqueCount:
      counts.size,
    topValues,
  };
}

/* -------------------------------------------------------------------------- */
/* DATE ANALYSIS                                                              */
/* -------------------------------------------------------------------------- */

function analyzeDateColumn(
  values: unknown[],
): DateStats {
  let missing = 0;
  let invalid = 0;

  const dates: Date[] = [];

  for (const value of values) {
    if (isMissing(value)) {
      missing++;
      continue;
    }

    const date = parseDate(
      value,
    );

    if (!date) {
      invalid++;
      continue;
    }

    dates.push(date);
  }

  if (dates.length === 0) {
    return {
      count: 0,
      missing,
      invalid,
      min: null,
      max: null,
      spanDays: null,
      uniqueCount: 0,
    };
  }

  let minTime =
    dates[0].getTime();

  let maxTime =
    dates[0].getTime();

  const uniqueDates =
    new Set<string>();

  for (const date of dates) {
    const timestamp =
      date.getTime();

    minTime = Math.min(
      minTime,
      timestamp,
    );

    maxTime = Math.max(
      maxTime,
      timestamp,
    );

    uniqueDates.add(
      date.toISOString(),
    );
  }

  const spanDays =
    (maxTime - minTime) /
    (1000 * 60 * 60 * 24);

  return {
    count: dates.length,
    missing,
    invalid,
    min: new Date(
      minTime,
    ).toISOString(),
    max: new Date(
      maxTime,
    ).toISOString(),
    spanDays: round(
      spanDays,
      2,
    ),
    uniqueCount:
      uniqueDates.size,
  };
}

/* -------------------------------------------------------------------------- */
/* COLUMN ANALYSIS                                                            */
/* -------------------------------------------------------------------------- */

function isLikelyIdentifier(
  name: string,
  kind: ColumnKind,
  uniqueCount: number,
  validCount: number,
): boolean {
  if (
    validCount === 0 ||
    kind !== 'numeric' &&
      kind !== 'categorical' &&
      kind !== 'text'
  ) {
    return false;
  }

  const uniqueRatio =
    uniqueCount /
    validCount;

  if (
    IDENTIFIER_NAME_PATTERN.test(
      name,
    ) &&
    uniqueRatio >= 0.8
  ) {
    return true;
  }

  /*
   * A near-unique text/categorical column is often:
   *
   * customer_id
   * transaction_id
   * email
   * UUID
   *
   * and should not automatically become a dimension.
   */
  if (
    uniqueRatio >= 0.98 &&
    validCount >= 10
  ) {
    return true;
  }

  return false;
}

function analyzeColumn(
  name: string,
  rows: DataRow[],
): ColumnAnalysis {
  const values =
    rows.map(
      (row) => row[name],
    );

  const kind =
    determineColumnKind(
      values,
    );

  const validValues =
    values.filter(
      (value) =>
        !isMissing(value),
    );

  const uniqueCount =
    new Set(
      validValues.map(
        normalizeString,
      ),
    ).size;

  const missingCount =
    values.length -
    validValues.length;

  const invalidCount =
    kind === 'numeric'
      ? values.filter(
          (value) =>
            !isMissing(value) &&
            toNumber(value) ===
              null,
        ).length
      : kind === 'date'
        ? values.filter(
            (value) =>
              !isMissing(value) &&
              parseDate(value) ===
                null,
          ).length
        : 0;

  const sampleValues =
    Array.from(
      new Set(
        validValues.map(
          normalizeString,
        ),
      ),
    ).slice(0, 5);

  const uniquePercentage =
    round(
      percentage(
        uniqueCount,
        validValues.length,
      ),
      2,
    );

  const result: ColumnAnalysis = {
    name,
    kind,
    nullable:
      missingCount > 0,
    uniqueCount,
    missingCount,
    invalidCount,
    missingPercentage:
      round(
        percentage(
          missingCount,
          rows.length,
        ),
        2,
      ),
    uniquePercentage,
    isLikelyIdentifier:
      isLikelyIdentifier(
        name,
        kind,
        uniqueCount,
        validValues.length,
      ),
    sampleValues,
  };

  if (kind === 'numeric') {
    result.numeric =
      analyzeNumericColumn(
        values,
      );
  }

  if (
    kind ===
    'categorical'
  ) {
    result.categorical =
      analyzeCategoricalColumn(
        values,
      );
  }

  if (kind === 'date') {
    result.date =
      analyzeDateColumn(
        values,
      );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* DUPLICATES                                                                 */
/* -------------------------------------------------------------------------- */

function stableSerialize(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return String(value);
  }

  if (
    typeof value !==
      'object' ||
    value instanceof Date
  ) {
    return JSON.stringify(
      value,
    );
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(stableSerialize)
      .join(',')}]`;
  }

  const object =
    value as Record<
      string,
      unknown
    >;

  return `{${Object.keys(
    object,
  )
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(
          key,
        )}:${stableSerialize(
          object[key],
        )}`,
    )
    .join(',')}}`;
}

function countDuplicateRows(
  rows: DataRow[],
): number {
  const seen =
    new Set<string>();

  let duplicates = 0;

  for (const row of rows) {
    const serialized =
      stableSerialize(row);

    if (
      seen.has(
        serialized,
      )
    ) {
      duplicates++;
    } else {
      seen.add(
        serialized,
      );
    }
  }

  return duplicates;
}

/* -------------------------------------------------------------------------- */
/* CORRELATION                                                                */
/* -------------------------------------------------------------------------- */

function pearsonCorrelation(
  x: number[],
  y: number[],
): number | null {
  if (
    x.length !== y.length ||
    x.length < 3
  ) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;

  for (
    let index = 0;
    index < x.length;
    index++
  ) {
    sumX += x[index];
    sumY += y[index];
  }

  const meanX =
    sumX / x.length;

  const meanY =
    sumY / y.length;

  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (
    let index = 0;
    index < x.length;
    index++
  ) {
    const dx =
      x[index] - meanX;

    const dy =
      y[index] - meanY;

    numerator +=
      dx * dy;

    denominatorX +=
      dx * dx;

    denominatorY +=
      dy * dy;
  }

  const denominator =
    Math.sqrt(
      denominatorX *
        denominatorY,
    );

  if (
    denominator === 0
  ) {
    return null;
  }

  return (
    numerator /
    denominator
  );
}

function correlationStrength(
  value: number,
): CorrelationAnalysis['strength'] {
  const absolute =
    Math.abs(value);

  if (absolute >= 0.8) {
    return 'very-strong';
  }

  if (absolute >= 0.6) {
    return 'strong';
  }

  if (absolute >= 0.4) {
    return 'moderate';
  }

  return 'weak';
}

function calculateCorrelations(
  rows: DataRow[],
  numericColumns: string[],
): CorrelationAnalysis[] {
  const results: CorrelationAnalysis[] =
    [];

  for (
    let i = 0;
    i <
    numericColumns.length;
    i++
  ) {
    for (
      let j = i + 1;
      j <
      numericColumns.length;
      j++
    ) {
      const columnA =
        numericColumns[i];

      const columnB =
        numericColumns[j];

      const x: number[] = [];
      const y: number[] = [];

      for (const row of rows) {
        const valueA =
          toNumber(
            row[columnA],
          );

        const valueB =
          toNumber(
            row[columnB],
          );

        if (
          valueA === null ||
          valueB === null
        ) {
          continue;
        }

        x.push(valueA);
        y.push(valueB);
      }

      if (x.length < 3) {
        continue;
      }

      const correlation =
        pearsonCorrelation(
          x,
          y,
        );

      if (
        correlation === null
      ) {
        continue;
      }

      if (
        Math.abs(
          correlation,
        ) < 0.25
      ) {
        continue;
      }

      results.push({
        columnA,
        columnB,
        correlation:
          round(
            correlation,
            4,
          ),
        strength:
          correlationStrength(
            correlation,
          ),
        direction:
          correlation >= 0
            ? 'positive'
            : 'negative',
        sampleSize:
          x.length,
      });
    }
  }

  return results.sort(
    (a, b) =>
      Math.abs(
        b.correlation,
      ) -
      Math.abs(
        a.correlation,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/* TREND PERIOD DETECTION                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Determine the most appropriate temporal granularity.
 *
 * Examples:
 *
 * 2025-01-01
 * 2025-01-02
 * 2025-01-03
 * -> day
 *
 * weekly observations
 * -> week
 *
 * monthly observations
 * -> month
 *
 * quarterly observations
 * -> quarter
 *
 * yearly observations
 * -> year
 */
function inferTrendPeriod(
  dates: Date[],
): TrendPeriod {
  if (dates.length < 2) {
    return 'day';
  }

  const sorted =
    [...dates].sort(
      (a, b) =>
        a.getTime() -
        b.getTime(),
    );

  const deltas: number[] = [];

  for (
    let i = 1;
    i < sorted.length;
    i++
  ) {
    const delta =
      (sorted[i].getTime() -
        sorted[i - 1].getTime()) /
      (1000 * 60 * 60 * 24);

    if (delta > 0) {
      deltas.push(delta);
    }
  }

  if (deltas.length === 0) {
    return 'day';
  }

  const sortedDeltas =
    [...deltas].sort(
      (a, b) => a - b,
    );

  const middle =
    Math.floor(
      sortedDeltas.length / 2,
    );

  const medianDelta =
    sortedDeltas.length % 2 === 0
      ? (sortedDeltas[
          middle - 1
        ] +
          sortedDeltas[middle]) /
        2
      : sortedDeltas[middle];

  if (medianDelta <= 1.5) {
    return 'day';
  }

  if (medianDelta <= 10) {
    return 'week';
  }

  if (medianDelta <= 45) {
    return 'month';
  }

  if (medianDelta <= 120) {
    return 'quarter';
  }

  return 'year';
}

/* -------------------------------------------------------------------------- */
/* PERIOD BUCKETING                                                           */
/* -------------------------------------------------------------------------- */

function startOfWeek(
  date: Date,
): Date {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0,
  );

  /*
   * Monday-based week.
   */
  const day =
    result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() +
      difference,
  );

  return result;
}

function getPeriodKey(
  date: Date,
  period: TrendPeriod,
): string {
  const year =
    date.getUTCFullYear();

  const month =
    date.getUTCMonth();

  const day =
    date.getUTCDate();

  switch (period) {
    case 'day':
      return [
        year,
        String(month + 1).padStart(
          2,
          '0',
        ),
        String(day).padStart(
          2,
          '0',
        ),
      ].join('-');

    case 'week': {
      const weekStart =
        startOfWeek(
          new Date(
            Date.UTC(
              year,
              month,
              day,
            ),
          ),
        );

      return weekStart
        .toISOString()
        .slice(0, 10);
    }

    case 'month':
      return `${year}-${String(
        month + 1,
      ).padStart(2, '0')}`;

    case 'quarter': {
      const quarter =
        Math.floor(
          month / 3,
        ) + 1;

      return `${year}-Q${quarter}`;
    }

    case 'year':
      return String(year);
  }
}

function getPeriodTimestamp(
  periodKey: string,
  period: TrendPeriod,
): number {
  if (
    period === 'quarter'
  ) {
    const match =
      /^(\d{4})-Q([1-4])$/.exec(
        periodKey,
      );

    if (!match) {
      return NaN;
    }

    const year =
      Number(match[1]);

    const quarter =
      Number(match[2]);

    return Date.UTC(
      year,
      (quarter - 1) * 3,
      1,
    );
  }

  if (
    period === 'year'
  ) {
    return Date.UTC(
      Number(periodKey),
      0,
      1,
    );
  }

  if (
    period === 'month'
  ) {
    const match =
      /^(\d{4})-(\d{2})$/.exec(
        periodKey,
      );

    if (!match) {
      return NaN;
    }

    return Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      1,
    );
  }

  return new Date(
    `${periodKey}T00:00:00Z`,
  ).getTime();
}

/* -------------------------------------------------------------------------- */
/* LINEAR REGRESSION                                                          */
/* -------------------------------------------------------------------------- */

function calculateRegressionSlope(
  values: number[],
): number | null {
  if (values.length < 2) {
    return null;
  }

  const n =
    values.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (
    let i = 0;
    i < n;
    i++
  ) {
    const x = i;
    const y = values[i];

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator =
    n * sumXX -
    sumX * sumX;

  if (
    denominator === 0
  ) {
    return null;
  }

  return (
    (n * sumXY -
      sumX * sumY) /
    denominator
  );
}

/* -------------------------------------------------------------------------- */
/* TREND CONFIDENCE                                                           */
/* -------------------------------------------------------------------------- */

function determineTrendConfidence(
  periodCount: number,
  coveragePercentage: number,
  values: number[],
): TrendAnalysis['confidence'] {
  if (
    periodCount >= 12 &&
    coveragePercentage >= 80 &&
    values.length >= 12
  ) {
    return 'high';
  }

  if (
    periodCount >= 6 &&
    coveragePercentage >= 60 &&
    values.length >= 6
  ) {
    return 'medium';
  }

  return 'low';
}

/* -------------------------------------------------------------------------- */
/* PERIOD-AWARE TREND ANALYSIS                                                */
/* -------------------------------------------------------------------------- */

/**
 * Production-grade trend calculation.
 *
 * Important properties:
 *
 * 1. Never relies on original row order.
 * 2. Groups duplicate observations into temporal periods.
 * 3. Automatically chooses day/week/month/quarter/year.
 * 4. Uses one observation per period.
 * 5. Uses the average for ordinary measures.
 * 6. Uses endpoint windows for percentage change.
 * 7. Uses regression slope for direction.
 * 8. Reports sparse/missing periods.
 */
function calculateTrends(
  rows: DataRow[],
  dateColumn: string | undefined,
  numericColumns: string[],
): TrendAnalysis[] {
  if (
    !dateColumn ||
    numericColumns.length === 0
  ) {
    return [];
  }

  /*
   * Collect valid dates first.
   */
  const parsedRows: Array<{
    date: Date;
    values: Record<
      string,
      number
    >;
  }> = [];

  const dates: Date[] = [];

  for (const row of rows) {
    const parsed =
      parseDateValue(
        row[dateColumn],
      );

    if (!parsed) {
      continue;
    }

    const values: Record<
      string,
      number
    > = {};

    for (const column of numericColumns) {
      const value =
        toNumber(
          row[column],
        );

      if (
        value !== null
      ) {
        values[column] =
          value;
      }
    }

    if (
      Object.keys(
        values,
      ).length === 0
    ) {
      continue;
    }

    dates.push(
      parsed.date,
    );

    parsedRows.push({
      date: parsed.date,
      values,
    });
  }

  if (dates.length < 2) {
    return [];
  }

  const period =
    inferTrendPeriod(
      dates,
    );

  /*
   * Map:
   *
   * period -> measure -> values
   */
  const grouped =
    new Map<
      string,
      Map<string, number[]>
    >();

  for (const row of parsedRows) {
    const periodKey =
      getPeriodKey(
        row.date,
        period,
      );

    let periodValues =
      grouped.get(
        periodKey,
      );

    if (!periodValues) {
      periodValues =
        new Map<
          string,
          number[]
        >();

      grouped.set(
        periodKey,
        periodValues,
      );
    }

    for (const [
      column,
      value,
    ] of Object.entries(
      row.values,
    )) {
      const values =
        periodValues.get(
          column,
        ) ?? [];

      values.push(value);

      periodValues.set(
        column,
        values,
      );
    }
  }

  /*
   * Sort actual periods chronologically.
   */
  const periods =
    Array.from(
      grouped.keys(),
    )
      .map(
        (key) => ({
          key,
          timestamp:
            getPeriodTimestamp(
              key,
              period,
            ),
        }),
      )
      .filter(
        (item) =>
          Number.isFinite(
            item.timestamp,
          ),
      )
      .sort(
        (a, b) =>
          a.timestamp -
          b.timestamp,
      );

  if (periods.length < 2) {
    return [];
  }

  const trends: TrendAnalysis[] =
    [];

  for (const column of numericColumns) {
    /*
     * One aggregated value per period.
     */
    const observations: Array<{
      timestamp: number;
      value: number;
    }> = [];

    for (const item of periods) {
      const periodValues =
        grouped
          .get(item.key)
          ?.get(column);

      if (
        !periodValues ||
        periodValues.length === 0
      ) {
        continue;
      }

      /*
       * Average aggregation is intentionally used
       * here because a generic analyzer cannot know
       * whether a numeric field is additive revenue,
       * inventory, a rate, a score, etc.
       *
       * The actual chart engine / semantic layer can
       * later choose SUM when it knows the measure semantics.
       */
      const sum =
        periodValues.reduce(
          (total, value) =>
            total + value,
          0,
        );

      const average =
        sum /
        periodValues.length;

      observations.push({
        timestamp:
          item.timestamp,
        value: average,
      });
    }

    if (
      observations.length < 2
    ) {
      continue;
    }

    /*
     * The observations are already chronologically
     * ordered because periods are ordered above.
     */
    const values =
      observations.map(
        (item) =>
          item.value,
      );

    /*
     * Determine coverage.
     */
    const periodCount =
      periods.length;

    const populatedPeriods =
      observations.length;

    const missingPeriods =
      Math.max(
        0,
        periodCount -
          populatedPeriods,
      );

    const coveragePercentage =
      round(
        percentage(
          populatedPeriods,
          periodCount,
        ),
        2,
      );

    /*
     * Use a window rather than one individual
     * observation at either end.
     *
     * This protects against a noisy first/last period.
     */
    const windowSize =
      Math.max(
        1,
        Math.min(
          3,
          Math.floor(
            observations.length *
              0.1,
          ),
        ),
      );

    const firstWindow =
      values.slice(
        0,
        windowSize,
      );

    const lastWindow =
      values.slice(
        -windowSize,
      );

    const firstValue =
      firstWindow.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) /
      firstWindow.length;

    const lastValue =
      lastWindow.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) /
      lastWindow.length;

    let changePercentage:
      | number
      | null = null;

    if (
      firstValue !== 0
    ) {
      changePercentage =
        round(
          ((lastValue -
            firstValue) /
            Math.abs(
              firstValue,
            )) *
            100,
          2,
        );
    }

    /*
     * Regression slope is much more useful than
     * simply comparing the first and last values.
     */
    const slope =
      calculateRegressionSlope(
        values,
      );

    /*
     * Normalize the slope relative to the
     * average magnitude of the series.
     */
    const absoluteMean =
      values.reduce(
        (sum, value) =>
          sum +
          Math.abs(value),
        0,
      ) / values.length;

    const normalizedSlope =
      absoluteMean === 0 ||
      slope === null
        ? 0
        : slope /
          absoluteMean;

    let direction:
      TrendAnalysis['direction'] =
      'unknown';

    /*
     * A 1% normalized slope per period is a
     * meaningful default threshold.
     *
     * This prevents tiny floating-point movements
     * from being reported as trends.
     */
    if (
      normalizedSlope >
      0.01
    ) {
      direction =
        'increasing';
    } else if (
      normalizedSlope <
      -0.01
    ) {
      direction =
        'decreasing';
    } else {
      direction = 'flat';
    }

    /*
     * If the data is extremely sparse, don't
     * overstate certainty.
     */
    const confidence =
      determineTrendConfidence(
        periodCount,
        coveragePercentage,
        values,
      );

    trends.push({
      column,
      period,
      direction,
      changePercentage,
      firstValue: round(
        firstValue,
        4,
      ),
      lastValue: round(
        lastValue,
        4,
      ),
      slope:
        slope === null
          ? null
          : round(
              slope,
              6,
            ),
      periodCount,
      populatedPeriods,
      missingPeriods,
      coveragePercentage,
      aggregation:
        'average',
      confidence,
    });
  }

  return trends.sort(
    (a, b) => {
      const aChange =
        Math.abs(
          a.changePercentage ??
            0,
        );

      const bChange =
        Math.abs(
          b.changePercentage ??
            0,
        );

      return (
        bChange -
        aChange
      );
    },
  );
}

/* -------------------------------------------------------------------------- */
/* DATE COLUMN SELECTION                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Don't blindly use dateColumns[0].
 *
 * Prefer the date column that:
 *
 * - has the most valid dates
 * - has multiple unique periods
 * - has the largest temporal span
 */
function choosePrimaryDateColumn(
  columns: ColumnAnalysis[],
): string | undefined {
  const candidates =
    columns.filter(
      (column) =>
        column.kind ===
          'date' &&
        column.date &&
        column.date.count >=
          2 &&
        column.date.uniqueCount >=
          2,
    );

  if (
    candidates.length === 0
  ) {
    return undefined;
  }

  return [
    ...candidates,
  ].sort(
    (a, b) => {
      const spanA =
        a.date?.spanDays ??
        0;

      const spanB =
        b.date?.spanDays ??
        0;

      if (
        spanA !== spanB
      ) {
        return (
          spanB -
          spanA
        );
      }

      return (
        (b.date?.count ??
          0) -
        (a.date?.count ??
          0)
      );
    },
  )[0].name;
}

/* -------------------------------------------------------------------------- */
/* MEASURE / DIMENSION SELECTION                                              */
/* -------------------------------------------------------------------------- */

function chooseMeasures(
  columns: ColumnAnalysis[],
): string[] {
  return columns
    .filter(
      (column) =>
        column.kind ===
          'numeric' &&
        column.uniqueCount > 1 &&
        !column.isLikelyIdentifier,
    )
    .sort(
      (a, b) => {
        /*
         * Prefer columns with fewer invalid/missing values.
         */
        const qualityA =
          100 -
          a.missingPercentage -
          percentage(
            a.invalidCount,
            Math.max(
              1,
              a.numeric?.count ??
                0,
            ),
          );

        const qualityB =
          100 -
          b.missingPercentage -
          percentage(
            b.invalidCount,
            Math.max(
              1,
              b.numeric?.count ??
                0,
            ),
          );

        return (
          qualityB -
          qualityA
        );
      },
    )
    .map(
      (column) =>
        column.name,
    );
}

function chooseDimensions(
  columns: ColumnAnalysis[],
): string[] {
  return columns
    .filter(
      (column) =>
        (
          column.kind ===
            'categorical' ||
          column.kind ===
            'date'
        ) &&
        !column.isLikelyIdentifier,
    )
    .sort(
      (a, b) => {
        /*
         * Prefer dimensions with useful,
         * but not excessive, cardinality.
         */
        const score = (
          column: ColumnAnalysis,
        ) => {
          const unique =
            column.uniqueCount;

          if (
            unique >= 2 &&
            unique <= 12
          ) {
            return 100;
          }

          if (
            unique <= 30
          ) {
            return 80;
          }

          if (
            unique <= 100
          ) {
            return 50;
          }

          return 10;
        };

        return (
          score(b) -
          score(a)
        );
      },
    )
    .map(
      (column) =>
        column.name,
    );
}

/* -------------------------------------------------------------------------- */
/* DATA QUALITY                                                               */
/* -------------------------------------------------------------------------- */

function calculateQualityIssues(
  rows: DataRow[],
  columns: ColumnAnalysis[],
  duplicateRows: number,
): DataQualityIssue[] {
  const issues: DataQualityIssue[] =
    [];

  for (const column of columns) {
    /*
     * Missing values.
     */
    if (
      column.missingPercentage >=
      50
    ) {
      issues.push({
        type:
          'missing-values',
        column:
          column.name,
        severity:
          'high',
        message:
          `${column.name} is missing ${column.missingPercentage}% of its values.`,
      });
    } else if (
      column.missingPercentage >=
      10
    ) {
      issues.push({
        type:
          'missing-values',
        column:
          column.name,
        severity:
          'medium',
        message:
          `${column.name} has ${column.missingPercentage}% missing values.`,
      });
    } else if (
      column.missingPercentage > 0
    ) {
      issues.push({
        type:
          'missing-values',
        column:
          column.name,
        severity:
          'low',
        message:
          `${column.name} contains ${column.missingPercentage}% missing values.`,
      });
    }

    /*
     * Invalid numeric/date values.
     */
    if (
      column.invalidCount > 0
    ) {
      const invalidPercentage =
        round(
          percentage(
            column.invalidCount,
            rows.length,
          ),
          2,
        );

      issues.push({
        type:
          'invalid-values',
        column:
          column.name,
        severity:
          invalidPercentage >=
          10
            ? 'high'
            : invalidPercentage >=
                3
              ? 'medium'
              : 'low',
        message:
          `${column.name} contains ${column.invalidCount} invalid values (${invalidPercentage}% of the column).`,
      });
    }

    /*
     * Constant columns.
     */
    if (
      column.uniqueCount ===
        1 &&
      column.missingCount ===
        0
    ) {
      issues.push({
        type:
          'constant-column',
        column:
          column.name,
        severity:
          'low',
        message:
          `${column.name} contains only one unique value and provides little analytical variation.`,
      });
    }

    /*
     * High-cardinality dimensions.
     */
    if (
      column.kind ===
        'categorical' &&
      column.uniqueCount >
        100
    ) {
      issues.push({
        type:
          'high-cardinality',
        column:
          column.name,
        severity:
          'medium',
        message:
          `${column.name} has high cardinality with ${column.uniqueCount} unique values.`,
      });
    }

    /*
     * Free-form text.
     */
    if (
      column.kind ===
      'text'
    ) {
      issues.push({
        type:
          'mostly-text',
        column:
          column.name,
        severity:
          'low',
        message:
          `${column.name} appears to contain free-form text rather than structured analytical values.`,
      });
    }
  }

  /*
   * Duplicate rows.
   */
  if (
    duplicateRows > 0
  ) {
    const duplicatePercentage =
      percentage(
        duplicateRows,
        rows.length,
      );

    issues.push({
      type:
        'duplicate-rows',
      severity:
        duplicatePercentage >=
        10
          ? 'high'
          : duplicatePercentage >=
              3
            ? 'medium'
            : 'low',
      message:
        `${duplicateRows} duplicate rows were detected (${round(
          duplicatePercentage,
          2,
        )}% of the dataset).`,
    });
  }

  return issues;
}

/* -------------------------------------------------------------------------- */
/* CHART CANDIDATES                                                           */
/* -------------------------------------------------------------------------- */

function generateChartCandidates(
  columns: ColumnAnalysis[],
  numericColumns: string[],
  categoricalColumns: string[],
  dateColumns: string[],
): ChartCandidate[] {
  const candidates: ChartCandidate[] =
    [];

  const usableCategoricalColumns =
    categoricalColumns.filter(
      (columnName) => {
        const column =
          columns.find(
            (item) =>
              item.name ===
              columnName,
          );

        return (
          column !==
            undefined &&
          !column.isLikelyIdentifier &&
          column.uniqueCount >=
            2
        );
      },
    );

  const usableMeasures =
    numericColumns.filter(
      (columnName) => {
        const column =
          columns.find(
            (item) =>
              item.name ===
              columnName,
          );

        return (
          column !==
            undefined &&
          !column.isLikelyIdentifier &&
          column.uniqueCount >
            1
        );
      },
    );

  /*
   * Time series.
   */
  if (
    dateColumns.length > 0 &&
    usableMeasures.length > 0
  ) {
    const dateColumn =
      choosePrimaryDateColumn(
        columns,
      ) ??
      dateColumns[0];

    candidates.push({
      type: 'line',
      title:
        'Trend over time',
      dimension:
        dateColumn,
      measures:
        usableMeasures.slice(
          0,
          3,
        ),
      reason:
        'A valid temporal dimension and numeric measures are available. The trend is grouped into appropriate time periods before visualization.',
      priority: 100,
    });

    if (
      usableMeasures.length >=
      2
    ) {
      candidates.push({
        type: 'area',
        title:
          'Measure comparison over time',
        dimension:
          dateColumn,
        measures:
          usableMeasures.slice(
            0,
            3,
          ),
        reason:
          'Multiple numeric measures can be compared across the temporal dimension.',
        priority: 85,
      });
    }
  }

  /*
   * Category comparison.
   */
  if (
    usableCategoricalColumns.length >
      0 &&
    usableMeasures.length > 0
  ) {
    const dimension =
      [...usableCategoricalColumns]
        .sort(
          (a, b) => {
            const columnA =
              columns.find(
                (column) =>
                  column.name ===
                  a,
              );

            const columnB =
              columns.find(
                (column) =>
                  column.name ===
                  b,
              );

            return (
              (columnA?.uniqueCount ??
                Infinity) -
              (columnB?.uniqueCount ??
                Infinity)
            );
          },
        )[0];

    const measure =
      usableMeasures[0];

    if (dimension) {
      candidates.push({
        type: 'bar',
        title:
          `${measure} by ${dimension}`,
        dimension,
        measures: [
          measure,
        ],
        reason:
          'A structured categorical dimension and numeric measure support direct category comparison.',
        priority: 90,
      });

      candidates.push({
        type:
          'horizontal-bar',
        title:
          `${measure} ranking by ${dimension}`,
        dimension,
        measures: [
          measure,
        ],
        reason:
          'A horizontal ranking is useful for comparing category magnitudes, especially when labels are long.',
        priority: 75,
      });

      if (
        usableMeasures.length >=
        2
      ) {
        candidates.push({
          type:
            'grouped-bar',
          title:
            `Measure comparison by ${dimension}`,
          dimension,
          measures:
            usableMeasures.slice(
              0,
              3,
            ),
          reason:
            'Multiple numeric measures can be compared across the same categorical dimension.',
          priority: 80,
        });
      }
    }
  }

  /*
   * Numeric distributions.
   */
  if (
    usableMeasures.length > 0
  ) {
    const measure =
      usableMeasures[0];

    candidates.push({
      type:
        'histogram',
      title:
        `${measure} distribution`,
      measures: [
        measure,
      ],
      reason:
        'A numeric measure can be examined for distribution, concentration, and spread.',
      priority: 65,
    });

    const boxDimension =
      usableCategoricalColumns.find(
        (columnName) => {
          const column =
            columns.find(
              (item) =>
                item.name ===
                columnName,
            );

          return (
            column !==
              undefined &&
            column.uniqueCount <=
              30
          );
        },
      );

    if (boxDimension) {
      candidates.push({
        type:
          'box-plot',
        title:
          `${measure} distribution by ${boxDimension}`,
        dimension:
          boxDimension,
        measures: [
          measure,
        ],
        reason:
          'A numeric measure can be compared across categories using distribution statistics rather than only averages.',
        priority: 60,
      });
    }
  }

  /*
   * Numeric relationships.
   */
  if (
    usableMeasures.length >=
    2
  ) {
    candidates.push({
      type:
        'scatter',
      title:
        `${usableMeasures[0]} vs ${usableMeasures[1]}`,
      measures:
        usableMeasures.slice(
          0,
          2,
        ),
      reason:
        'Two numeric measures can be compared to reveal relationships and potential correlation.',
      priority: 70,
    });
  }

  /*
   * Proportional breakdown.
   */
  if (
    usableCategoricalColumns.length >
      0 &&
    usableMeasures.length > 0
  ) {
    const dimension =
      usableCategoricalColumns.find(
        (columnName) => {
          const column =
            columns.find(
              (item) =>
                item.name ===
                columnName,
            );

          return (
            column !==
              undefined &&
            column.uniqueCount >=
              2 &&
            column.uniqueCount <=
              8
          );
        },
      );

    const measure =
      usableMeasures[0];

    if (dimension) {
      candidates.push({
        type: 'donut',
        title:
          `${measure} breakdown`,
        dimension,
        measures: [
          measure,
        ],
        reason:
          'A low-cardinality categorical dimension can meaningfully communicate proportional contribution to a whole.',
        priority: 45,
      });

      candidates.push({
        type:
          'treemap',
        title:
          `${measure} by ${dimension}`,
        dimension,
        measures: [
          measure,
        ],
        reason:
          'A treemap can communicate relative magnitude across several categories.',
        priority: 40,
      });
    }
  }

  return candidates.sort(
    (a, b) =>
      b.priority -
      a.priority,
  );
}

/* -------------------------------------------------------------------------- */
/* ANALYZABILITY                                                              */
/* -------------------------------------------------------------------------- */

function determineStatus(
  rows: DataRow[],
  columns: ColumnAnalysis[],
  numericColumns: string[],
  categoricalColumns: string[],
  dateColumns: string[],
): {
  status: DatasetAnalysis['status'];
  reason?: string;
} {
  if (
    rows.length === 0
  ) {
    return {
      status:
        'not-analyzable',
      reason:
        'No structured records were found in the uploaded content.',
    };
  }

  if (
    columns.length === 0
  ) {
    return {
      status:
        'not-analyzable',
      reason:
        'No structured columns could be detected.',
    };
  }

  const usableStructuredColumns =
    numericColumns.length +
    categoricalColumns.length +
    dateColumns.length;

  if (
    usableStructuredColumns ===
    0
  ) {
    return {
      status:
        'not-analyzable',
      reason:
        'The uploaded content appears to consist primarily of free-form text rather than structured analytical data.',
    };
  }

  if (
    numericColumns.length ===
      0 &&
    categoricalColumns.length ===
      0 &&
    dateColumns.length > 0
  ) {
    return {
      status:
        'partially-analyzable',
      reason:
        'The dataset contains dates but does not contain a numeric measure suitable for quantitative analysis.',
    };
  }

  if (
    numericColumns.length ===
      0 &&
    categoricalColumns.length >
      0
  ) {
    return {
      status:
        'partially-analyzable',
      reason:
        'The dataset contains categorical information but no clear numeric measures for quantitative analysis.',
    };
  }

  return {
    status:
      'analyzable',
  };
}

/* -------------------------------------------------------------------------- */
/* MAIN ANALYZER                                                              */
/* -------------------------------------------------------------------------- */

export function analyzeDatasetStructure(
  profile: DatasetProfile,
  rows: Record<
    string,
    unknown
  >[],
): DatasetAnalysis {
  const actualRows =
    toRows(rows);

  const columnNames =
    getProfileColumns(
      profile,
      actualRows,
    );

  const columns =
    columnNames.map(
      (name) =>
        analyzeColumn(
          name,
          actualRows,
        ),
    );

  const numericColumns =
    columns
      .filter(
        (column) =>
          column.kind ===
          'numeric',
      )
      .map(
        (column) =>
          column.name,
      );

  const categoricalColumns =
    columns
      .filter(
        (column) =>
          column.kind ===
          'categorical',
      )
      .map(
        (column) =>
          column.name,
      );

  const dateColumns =
    columns
      .filter(
        (column) =>
          column.kind ===
          'date',
      )
      .map(
        (column) =>
          column.name,
      );

  const textColumns =
    columns
      .filter(
        (column) =>
          column.kind ===
          'text',
      )
      .map(
        (column) =>
          column.name,
      );

  /*
   * Only expose useful numeric fields
   * as measures.
   */
  const measures =
    chooseMeasures(
      columns,
    );

  /*
   * Only expose useful categorical/date
   * fields as dimensions.
   */
  const dimensions =
    chooseDimensions(
      columns,
    );

  const duplicateRows =
    countDuplicateRows(
      actualRows,
    );

  const qualityIssues =
    calculateQualityIssues(
      actualRows,
      columns,
      duplicateRows,
    );

  const primaryDateColumn =
    choosePrimaryDateColumn(
      columns,
    );

  const trends =
    calculateTrends(
      actualRows,
      primaryDateColumn,
      measures,
    );

  const correlations =
    calculateCorrelations(
      actualRows,
      measures,
    );

  const chartCandidates =
    generateChartCandidates(
      columns,
      measures,
      categoricalColumns,
      dateColumns,
    );

  const status =
    determineStatus(
      actualRows,
      columns,
      measures,
      categoricalColumns,
      dateColumns,
    );

  const canAnalyzeTrends =
    Boolean(
      primaryDateColumn &&
        measures.length > 0,
    );

  return {
    status:
      status.status,

    reason:
      status.reason,

    rowCount:
      actualRows.length,

    columnCount:
      columnNames.length,

    columns,

    numericColumns,

    categoricalColumns,

    dateColumns,

    textColumns,

    measures,

    dimensions,

    dateDimensions:
      dateColumns,

    trends,

    correlations,

    qualityIssues,

    duplicateRows,

    analysisCapabilities: {
      canAnalyzeTrends,

      canAnalyzeDistributions:
        measures.length > 0,

      canAnalyzeCorrelations:
        measures.length >= 2,

      canGenerateCharts:
        chartCandidates.length >
        0,

      canGenerateTimeSeries:
        canAnalyzeTrends,
    },

    chartCandidates,
  };
}

/* -------------------------------------------------------------------------- */
/* SAFE SUMMARY FOR THE AI                                                    */
/* -------------------------------------------------------------------------- */

export function createAnalysisContext(
  analysis: DatasetAnalysis,
): string {
  return JSON.stringify(
    {
      status:
        analysis.status,

      reason:
        analysis.reason,

      dataset: {
        rows:
          analysis.rowCount,

        columns:
          analysis.columnCount,
      },

      schema:
        analysis.columns.map(
          (column) => ({
            name:
              column.name,

            kind:
              column.kind,

            uniqueCount:
              column.uniqueCount,

            uniquePercentage:
              column.uniquePercentage,

            missingCount:
              column.missingCount,

            missingPercentage:
              column.missingPercentage,

            invalidCount:
              column.invalidCount,

            isLikelyIdentifier:
              column.isLikelyIdentifier,

            sampleValues:
              column.sampleValues,

            numeric:
              column.numeric
                ? {
                    count:
                      column
                        .numeric
                        .count,

                    missing:
                      column
                        .numeric
                        .missing,

                    invalid:
                      column
                        .numeric
                        .invalid,

                    min:
                      column
                        .numeric
                        .min,

                    max:
                      column
                        .numeric
                        .max,

                    mean:
                      column
                        .numeric
                        .mean,

                    median:
                      column
                        .numeric
                        .median,

                    sum:
                      column
                        .numeric
                        .sum,

                    standardDeviation:
                      column
                        .numeric
                        .standardDeviation,

                    uniqueCount:
                      column
                        .numeric
                        .uniqueCount,
                  }
                : undefined,

            categorical:
              column.categorical
                ? {
                    count:
                      column
                        .categorical
                        .count,

                    missing:
                      column
                        .categorical
                        .missing,

                    uniqueCount:
                      column
                        .categorical
                        .uniqueCount,

                    topValues:
                      column
                        .categorical
                        .topValues,
                  }
                : undefined,

            date:
              column.date
                ? {
                    count:
                      column
                        .date
                        .count,

                    missing:
                      column
                        .date
                        .missing,

                    invalid:
                      column
                        .date
                        .invalid,

                    min:
                      column
                        .date
                        .min,

                    max:
                      column
                        .date
                        .max,

                    spanDays:
                      column
                        .date
                        .spanDays,

                    uniqueCount:
                      column
                        .date
                        .uniqueCount,
                  }
                : undefined,
          }),
        ),

      measures:
        analysis.measures,

      dimensions:
        analysis.dimensions,

      trends:
        analysis.trends,

      correlations:
        analysis.correlations,

      qualityIssues:
        analysis.qualityIssues,

      capabilities:
        analysis.analysisCapabilities,

      chartCandidates:
        analysis.chartCandidates,
    },
    null,
    2,
  );
}