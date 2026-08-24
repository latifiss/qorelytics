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

export interface NumericStats {
  count: number;
  missing: number;
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
  missingPercentage: number;
  numeric?: NumericStats;
  categorical?: CategoricalStats;
  date?: DateStats;
  sampleValues: string[];
}

export interface TrendAnalysis {
  column: string;
  direction:
    | 'increasing'
    | 'decreasing'
    | 'flat'
    | 'unknown';
  changePercentage: number | null;
  firstValue: number | null;
  lastValue: number | null;
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
        (
          name,
        ): name is string =>
          typeof name === 'string',
      );

    if (names.length > 0) {
      return names;
    }
  }

  const names = new Set<string>();

  for (const row of rows) {
    Object.keys(row).forEach((key) => {
      names.add(key);
    });
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
    const normalized =
      value.trim().toLowerCase();

    return (
      normalized === '' ||
      normalized === 'null' ||
      normalized === 'undefined' ||
      normalized === 'n/a' ||
      normalized === 'na' ||
      normalized === 'nan' ||
      normalized === 'missing'
    );
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* NUMBER PARSING                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Convert a value to a number without treating arbitrary values as numbers.
 *
 * Supports:
 *   "$1,200"
 *   "€1,200.50"
 *   "25%"
 *   "1,000"
 *   1200
 *
 * Does not treat date-like strings as numeric values.
 */
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

  const normalized = trimmed
    .replace(/[$€£¥₹,%]/g, '')
    .replace(/,/g, '')
    .trim();

  if (!normalized) {
    return null;
  }

  /*
   * Prevent date-like values such as:
   *
   * 2025-01-01
   * 2025-01-01T10:30:00Z
   *
   * from being interpreted as numbers.
   */
  if (
    /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s].*)?$/.test(
      normalized,
    )
  ) {
    return null;
  }

  /*
   * Reject strings containing alphabetic characters.
   *
   * This prevents values such as:
   *
   * "12 customers"
   * "USD 120"
   * "Jan 2025"
   *
   * from becoming numeric.
   */
  if (/[a-z]/i.test(normalized)) {
    return null;
  }

  /*
   * Only allow a complete numeric representation.
   *
   * Examples:
   *   120
   *   -120
   *   120.50
   *   .50
   *   1.2e5
   */
  const numericPattern =
    /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i;

  if (!numericPattern.test(normalized)) {
    return null;
  }

  const number = Number(normalized);

  return Number.isFinite(number)
    ? number
    : null;
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

  const normalized =
    value.trim().toLowerCase();

  return [
    'true',
    'false',
    'yes',
    'no',
    'y',
    'n',
  ].includes(normalized);
}

/* -------------------------------------------------------------------------- */
/* DATE PARSING                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Parse only values that reasonably look like dates.
 *
 * JavaScript's Date parser is intentionally NOT used blindly because
 * it accepts many ambiguous values that are not actually dates.
 */
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
   * ISO-like dates:
   *
   * 2025-01-15
   * 2025-01-15T10:30:00Z
   * 2025-01-15 10:30:00
   */
  const isoDatePattern =
    /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s].*)?$/;

  /*
   * Slash dates:
   *
   * 2025/01/15
   * 01/15/2025
   * 15/01/2025
   */
  const slashDatePattern =
    /^(?:\d{4}\/\d{1,2}\/\d{1,2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\s.*)?$/;

  /*
   * Common textual dates:
   *
   * Jan 15, 2025
   * January 15, 2025
   */
  const textualDatePattern =
    /^(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:,\s*|\s+)\d{4}$/i;

  if (
    !isoDatePattern.test(normalized) &&
    !slashDatePattern.test(normalized) &&
    !textualDatePattern.test(normalized)
  ) {
    return null;
  }

  const date =
    new Date(normalized);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date;
}

function looksLikeDateColumn(
  values: unknown[],
): boolean {
  const validValues =
    values.filter(
      (value) =>
        !isMissing(value),
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
  const validValues =
    values.filter(
      (value) =>
        !isMissing(value),
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

/**
 * Determine the semantic type of a column.
 *
 * IMPORTANT:
 *
 * Detection order is:
 *
 *   boolean
 *   numeric
 *   date
 *   categorical
 *   text
 *
 * Numeric detection intentionally happens BEFORE date detection.
 *
 * This prevents values such as:
 *
 *   120
 *   12000
 *   202401
 *   202402
 *   202403
 *
 * from being incorrectly interpreted as dates.
 */
function determineColumnKind(
  values: unknown[],
): ColumnKind {
  const validValues =
    values.filter(
      (value) =>
        !isMissing(value),
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
   * Numeric BEFORE date.
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

  /*
   * Determine whether the remaining values are categorical
   * or free-form text.
   */
  const uniqueValues =
    new Set(
      validValues.map(
        normalizeString,
      ),
    );

  if (
    uniqueValues.size <=
    Math.min(
      100,
      Math.max(
        1,
        validValues.length * 0.5,
      ),
    )
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

  const sorted = [
    ...values,
  ].sort(
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
        Math.pow(
          value - mean,
          2,
        ),
      0,
    ) / values.length;

  return Math.sqrt(
    variance,
  );
}

function percentage(
  numerator: number,
  denominator: number,
): number {
  if (denominator === 0) {
    return 0;
  }

  return (
    (numerator /
      denominator) *
    100
  );
}

function round(
  value: number,
  decimals = 4,
): number {
  const factor =
    Math.pow(
      10,
      decimals,
    );

  return (
    Math.round(
      value * factor,
    ) / factor
  );
}

/* -------------------------------------------------------------------------- */
/* NUMERIC ANALYSIS                                                           */
/* -------------------------------------------------------------------------- */

function analyzeNumericColumn(
  values: unknown[],
): NumericStats {
  const numericValues =
    values
      .filter(
        (value) =>
          !isMissing(value),
      )
      .map(toNumber)
      .filter(
        (
          value,
        ): value is number =>
          value !== null,
      );

  const missing =
    values.filter(
      (value) =>
        isMissing(value),
    ).length;

  if (
    numericValues.length ===
    0
  ) {
    return {
      count: 0,
      missing,
      min: null,
      max: null,
      mean: null,
      median: null,
      sum: null,
      standardDeviation: null,
      uniqueCount: 0,
    };
  }

  const sum =
    numericValues.reduce(
      (total, value) =>
        total + value,
      0,
    );

  return {
    count:
      numericValues.length,

    missing,

    min: Math.min(
      ...numericValues,
    ),

    max: Math.max(
      ...numericValues,
    ),

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
/* INVALID NUMERIC VALUES                                                     */
/* -------------------------------------------------------------------------- */

function countInvalidNumericValues(
  values: unknown[],
): number {
  let invalid = 0;

  for (const value of values) {
    if (isMissing(value)) {
      continue;
    }

    if (
      toNumber(value) ===
      null
    ) {
      invalid++;
    }
  }

  return invalid;
}

/* -------------------------------------------------------------------------- */
/* CATEGORICAL ANALYSIS                                                       */
/* -------------------------------------------------------------------------- */

function analyzeCategoricalColumn(
  values: unknown[],
): CategoricalStats {
  const validValues =
    values.filter(
      (value) =>
        !isMissing(value),
    );

  const counts =
    new Map<string, number>();

  for (const value of validValues) {
    const normalized =
      normalizeString(value);

    counts.set(
      normalized,
      (counts.get(
        normalized,
      ) ?? 0) + 1,
    );
  }

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
              validValues.length,
            ),
            2,
          ),
        }),
      );

  return {
    count:
      validValues.length,

    missing:
      values.length -
      validValues.length,

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
  const nonMissing =
    values.filter(
      (value) =>
        !isMissing(value),
    );

  const dates =
    nonMissing
      .map(parseDate)
      .filter(
        (
          date,
        ): date is Date =>
          date !== null,
      );

  const missing =
    values.filter(
      (value) =>
        isMissing(value),
    ).length;

  if (dates.length === 0) {
    return {
      count: 0,
      missing: values.length,
      min: null,
      max: null,
      spanDays: null,
      uniqueCount: 0,
    };
  }

  const timestamps =
    dates.map(
      (date) =>
        date.getTime(),
    );

  const minTime =
    Math.min(
      ...timestamps,
    );

  const maxTime =
    Math.max(
      ...timestamps,
    );

  const spanDays =
    (maxTime - minTime) /
    (1000 *
      60 *
      60 *
      24);

  const uniqueDates =
    new Set(
      dates.map(
        (date) =>
          date
            .toISOString()
            .split('T')[0],
      ),
    );

  return {
    count:
      dates.length,

    missing:
      missing +
      (nonMissing.length -
        dates.length),

    min: new Date(
      minTime,
    ).toISOString(),

    max: new Date(
      maxTime,
    ).toISOString(),

    spanDays:
      round(
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

function analyzeColumn(
  name: string,
  rows: DataRow[],
): ColumnAnalysis {
  const values =
    rows.map(
      (row) =>
        row[name],
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

  const sampleValues =
    Array.from(
      new Set(
        validValues.map(
          normalizeString,
        ),
      ),
    ).slice(0, 5);

  const result: ColumnAnalysis =
    {
      name,
      kind,

      nullable:
        missingCount > 0,

      uniqueCount,

      missingCount,

      missingPercentage:
        round(
          percentage(
            missingCount,
            rows.length,
          ),
          2,
        ),

      sampleValues,
    };

  if (
    kind === 'numeric'
  ) {
    result.numeric =
      analyzeNumericColumn(
        values,
      );
  }

  if (
    kind === 'categorical'
  ) {
    result.categorical =
      analyzeCategoricalColumn(
        values,
      );
  }

  if (
    kind === 'date'
  ) {
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
      seen.has(serialized)
    ) {
      duplicates++;
    } else {
      seen.add(serialized);
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

  const meanX =
    x.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / x.length;

  const meanY =
    y.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / y.length;

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
    i < numericColumns.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < numericColumns.length;
      j++
    ) {
      const columnA =
        numericColumns[i];

      const columnB =
        numericColumns[j];

      const pairs: Array<{
        x: number;
        y: number;
      }> = [];

      for (const row of rows) {
        const x =
          toNumber(
            row[columnA],
          );

        const y =
          toNumber(
            row[columnB],
          );

        if (
          x !== null &&
          y !== null
        ) {
          pairs.push({
            x,
            y,
          });
        }
      }

      if (
        pairs.length < 3
      ) {
        continue;
      }

      const correlation =
        pearsonCorrelation(
          pairs.map(
            (pair) =>
              pair.x,
          ),
          pairs.map(
            (pair) =>
              pair.y,
          ),
        );

      if (
        correlation === null
      ) {
        continue;
      }

      /*
       * Ignore extremely weak relationships.
       */
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
/* TREND ANALYSIS                                                             */
/* -------------------------------------------------------------------------- */

function calculateTrends(
  rows: DataRow[],
  dateColumn: string | undefined,
  numericColumns: string[],
): TrendAnalysis[] {
  if (!dateColumn || numericColumns.length === 0) {
    return [];
  }

  /**
   * Group rows by calendar date.
   *
   * This is important because a dataset can contain many rows
   * for the same date:
   *
   * 2025-01-01 -> 500 rows
   * 2025-01-02 -> 500 rows
   * 2025-01-03 -> 500 rows
   *
   * We want each date to contribute one observation to the
   * time-series trend rather than letting row frequency
   * influence the result.
   */
  const groupedByDate = new Map<
    string,
    Map<string, number[]>
  >();

  for (const row of rows) {
    const date = parseDate(row[dateColumn]);

    if (!date) {
      continue;
    }

    /**
     * Normalize to calendar date.
     *
     * This means:
     *
     * 2025-01-01T08:00:00
     * 2025-01-01T14:00:00
     *
     * are treated as the same time period.
     */
    const dateKey = date
      .toISOString()
      .split('T')[0];

    let dateValues =
      groupedByDate.get(dateKey);

    if (!dateValues) {
      dateValues = new Map<
        string,
        number[]
      >();

      groupedByDate.set(
        dateKey,
        dateValues,
      );
    }

    for (const column of numericColumns) {
      const value = toNumber(
        row[column],
      );

      if (value === null) {
        continue;
      }

      const values =
        dateValues.get(column) ?? [];

      values.push(value);

      dateValues.set(
        column,
        values,
      );
    }
  }

  /**
   * Convert grouped observations into one value per
   * date and numeric measure.
   *
   * Example:
   *
   * Date       Revenue rows       Daily average
   * ------------------------------------------------
   * Jan 1      100, 120, 110       110
   * Jan 2      130, 140, 150       140
   * Jan 3      160, 170, 180       170
   */
  const timePeriods = Array.from(
    groupedByDate.entries(),
  )
    .map(
      ([dateKey, columnValues]) => {
        const values: Record<
          string,
          number
        > = {};

        for (const column of numericColumns) {
          const columnValuesForDate =
            columnValues.get(column);

          if (
            !columnValuesForDate ||
            columnValuesForDate.length === 0
          ) {
            continue;
          }

          const sum =
            columnValuesForDate.reduce(
              (total, value) =>
                total + value,
              0,
            );

          values[column] =
            sum /
            columnValuesForDate.length;
        }

        return {
          date: new Date(
            `${dateKey}T00:00:00Z`,
          ),
          values,
        };
      },
    )
    .filter(
      (period) =>
        Object.keys(
          period.values,
        ).length > 0,
    )
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime(),
    );

  if (timePeriods.length < 2) {
    return [];
  }

  const trends: TrendAnalysis[] = [];

  for (const column of numericColumns) {
    /**
     * Only keep time periods where this particular
     * measure actually has a value.
     */
    const values = timePeriods
      .map(
        (period) =>
          period.values[column],
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== undefined &&
          Number.isFinite(value),
      );

    if (values.length < 2) {
      continue;
    }

    /**
     * Compare the beginning and end of the time series.
     *
     * We use at least one observation and up to 10%
     * of the available time periods.
     */
    const windowSize = Math.max(
      1,
      Math.floor(values.length * 0.1),
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

    /**
     * If the starting value is zero, percentage change
     * is undefined.
     */
    if (firstValue !== 0) {
      changePercentage = round(
        (
          (lastValue -
            firstValue) /
          Math.abs(firstValue)
        ) * 100,
        2,
      );
    }

    let direction:
      TrendAnalysis['direction'] =
      'unknown';

    if (
      changePercentage !== null
    ) {
      if (
        changePercentage > 3
      ) {
        direction =
          'increasing';
      } else if (
        changePercentage < -3
      ) {
        direction =
          'decreasing';
      } else {
        direction = 'flat';
      }
    }

    trends.push({
      column,
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
    });
  }

  return trends.sort(
    (a, b) => {
      const aChange =
        Math.abs(
          a.changePercentage ?? 0,
        );

      const bChange =
        Math.abs(
          b.changePercentage ?? 0,
        );

      return bChange - aChange;
    },
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
     * Invalid values in numeric columns.
     */
    if (
      column.kind ===
      'numeric'
    ) {
      const values =
        rows.map(
          (row) =>
            row[column.name],
        );

      const invalidCount =
        countInvalidNumericValues(
          values,
        );

      if (
        invalidCount > 0
      ) {
        const invalidPercentage =
          round(
            percentage(
              invalidCount,
              values.length,
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
            `${column.name} contains ${invalidCount} invalid numeric values (${invalidPercentage}% of the column).`,
        });
      }
    }

    /*
     * Constant column.
     */
    if (
      column.uniqueCount ===
        1 &&
      column.missingCount === 0
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
     * High-cardinality categorical column.
     */
    if (
      column.uniqueCount >
        100 &&
      column.kind ===
        'categorical'
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

  /*
   * Time series.
   */
  if (
    dateColumns.length > 0 &&
    numericColumns.length > 0
  ) {
    const dateColumn =
      dateColumns[0];

    candidates.push({
      type: 'line',

      title:
        'Trend over time',

      dimension:
        dateColumn,

      measures:
        numericColumns.slice(
          0,
          3,
        ),

      reason:
        'A date dimension and numeric measures are available, making a time-series visualization appropriate.',

      priority: 100,
    });

    if (
      numericColumns.length >=
      2
    ) {
      candidates.push({
        type: 'area',

        title:
          'Measure comparison over time',

        dimension:
          dateColumn,

        measures:
          numericColumns.slice(
            0,
            3,
          ),

        reason:
          'Multiple numeric measures can be compared across the available time dimension.',

        priority: 85,
      });
    }
  }

  /*
   * Category comparison.
   */
  if (
    categoricalColumns.length >
      0 &&
    numericColumns.length > 0
  ) {
    /*
     * Prefer a low/moderate-cardinality
     * categorical dimension.
     */
    const dimension =
      [...categoricalColumns]
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
      numericColumns[0];

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
          'A categorical dimension and numeric measure support category comparison.',

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
          'A horizontal ranking is useful when category labels may be long.',

        priority: 75,
      });

      if (
        numericColumns.length >=
        2
      ) {
        candidates.push({
          type:
            'grouped-bar',

          title:
            `Measure comparison by ${dimension}`,

          dimension,

          measures:
            numericColumns.slice(
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
    numericColumns.length > 0
  ) {
    const measure =
      numericColumns[0];

    candidates.push({
      type:
        'histogram',

      title:
        `${measure} distribution`,

      measures: [
        measure,
      ],

      reason:
        'A numeric measure can be examined for its distribution and concentration.',

      priority: 65,
    });

    /*
     * Distribution by category.
     */
    if (
      categoricalColumns.length >
      0
    ) {
      const dimension =
        categoricalColumns.find(
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
                50
            );
          },
        );

      if (dimension) {
        candidates.push({
          type:
            'box-plot',

          title:
            `${measure} distribution by ${dimension}`,

          dimension,

          measures: [
            measure,
          ],

          reason:
            'A numeric measure can be compared across categories using distributions.',

          priority: 60,
        });
      }
    }
  }

  /*
   * Numeric relationships.
   */
  if (
    numericColumns.length >=
    2
  ) {
    candidates.push({
      type:
        'scatter',

      title:
        `${numericColumns[0]} vs ${numericColumns[1]}`,

      measures:
        numericColumns.slice(
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
    categoricalColumns.length >
      0 &&
    numericColumns.length > 0
  ) {
    const dimension =
      categoricalColumns.find(
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
              8
          );
        },
      );

    const measure =
      numericColumns[0];

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
          'A low-cardinality categorical dimension can meaningfully show proportional contribution to the numeric measure.',

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
          'A treemap can communicate relative magnitude across multiple categories.',

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

  const measures =
    columns
      .filter(
        (column) =>
          column.kind ===
            'numeric' &&
          column.uniqueCount >
            1,
      )
      .map(
        (column) =>
          column.name,
      );

  const dimensions = [
    ...categoricalColumns,
    ...dateColumns,
  ];

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

  const trends =
    calculateTrends(
      actualRows,
      dateColumns[0],
      numericColumns,
    );

  const correlations =
    calculateCorrelations(
      actualRows,
      numericColumns,
    );

  const chartCandidates =
    generateChartCandidates(
      columns,
      numericColumns,
      categoricalColumns,
      dateColumns,
    );

  const status =
    determineStatus(
      actualRows,
      columns,
      numericColumns,
      categoricalColumns,
      dateColumns,
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
      canAnalyzeTrends:
        dateColumns.length >
          0 &&
        numericColumns.length >
          0,

      canAnalyzeDistributions:
        numericColumns.length >
        0,

      canAnalyzeCorrelations:
        numericColumns.length >=
        2,

      canGenerateCharts:
        chartCandidates.length >
        0,

      canGenerateTimeSeries:
        dateColumns.length >
          0 &&
        numericColumns.length >
          0,
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

            missingCount:
              column.missingCount,

            missingPercentage:
              column.missingPercentage,

            sampleValues:
              column.sampleValues,

            numeric:
              column.numeric
                ? {
                    count:
                      column
                        .numeric
                        .count,

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
              column
                .categorical
                ? {
                    count:
                      column
                        .categorical
                        .count,

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