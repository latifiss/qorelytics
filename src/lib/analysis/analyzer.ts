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
  direction: 'increasing' | 'decreasing' | 'flat' | 'unknown';
  changePercentage: number | null;
  firstValue: number | null;
  lastValue: number | null;
}

export interface CorrelationAnalysis {
  columnA: string;
  columnB: string;
  correlation: number;
  strength: 'very-strong' | 'strong' | 'moderate' | 'weak';
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
  severity: 'high' | 'medium' | 'low';
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

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function toRows(profile: DatasetProfile): DataRow[] {
  const value = profile as unknown as Record<string, unknown>;

  /*
   * Your existing DatasetProfile may expose rows under different names
   * depending on which ingestion path created it.
   *
   * We deliberately support the common shapes without changing the
   * existing DatasetProfile type.
   */

  const possibleRows = [
    value.rows,
    value.data,
    value.records,
  ];

  for (const candidate of possibleRows) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    return candidate.filter(isObject) as DataRow[];
  }

  return [];
}

function getProfileColumns(
  profile: DatasetProfile,
  rows: DataRow[],
): string[] {
  const value = profile as unknown as Record<string, unknown>;

  const possibleColumns = [
    value.columns,
  ];

  for (const candidate of possibleColumns) {
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
  }

  const names = new Set<string>();

  for (const row of rows) {
    Object.keys(row).forEach((key) => {
      names.add(key);
    });
  }

  return Array.from(names);
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function isMissing(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

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

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value
    .replace(/[$€£¥₹,%]/g, '')
    .replace(/,/g, '')
    .trim();

  if (!normalized) {
    return null;
  }

  const number = Number(normalized);

  return Number.isFinite(number)
    ? number
    : null;
}

function isBooleanLike(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value
    .trim()
    .toLowerCase();

  return [
    'true',
    'false',
    'yes',
    'no',
    'y',
    'n',
  ].includes(normalized);
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
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

  const parsedCount = validValues.filter(
    (value) => parseDate(value) !== null,
  ).length;

  return (
    parsedCount / validValues.length >= 0.8
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

  const numericCount = validValues.filter(
    (value) => toNumber(value) !== null,
  ).length;

  return (
    numericCount / validValues.length >= 0.8
  );
}

function determineColumnKind(
  values: unknown[],
): ColumnKind {
  const validValues = values.filter(
    (value) => !isMissing(value),
  );

  if (validValues.length === 0) {
    return 'unknown';
  }

  if (
    validValues.every(isBooleanLike)
  ) {
    return 'boolean';
  }

  /*
   * Check dates before text because ISO dates are strings.
   */
  if (looksLikeDateColumn(validValues)) {
    return 'date';
  }

  if (looksLikeNumericColumn(validValues)) {
    return 'numeric';
  }

  const uniqueValues = new Set(
    validValues.map(normalizeString),
  );

  /*
   * A small number of repeating values generally represents
   * a categorical dimension.
   */
  if (
    uniqueValues.size <=
    Math.min(100, validValues.length * 0.5)
  ) {
    return 'categorical';
  }

  /*
   * Long strings / mostly unique strings are treated as text.
   */
  return 'text';
}

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort(
    (a, b) => a - b,
  );

  const middle = Math.floor(
    sorted.length / 2,
  );

  if (sorted.length % 2 === 0) {
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
      (sum, value) => sum + value,
      0,
    ) / values.length;

  const variance =
    values.reduce(
      (sum, value) =>
        sum +
        Math.pow(value - mean, 2),
      0,
    ) / values.length;

  return Math.sqrt(variance);
}

function percentage(
  numerator: number,
  denominator: number,
): number {
  if (denominator === 0) {
    return 0;
  }

  return (
    (numerator / denominator) *
    100
  );
}

function round(
  value: number,
  decimals = 4,
): number {
  const factor =
    Math.pow(10, decimals);

  return (
    Math.round(value * factor) /
    factor
  );
}

/* -------------------------------------------------------------------------- */
/* NUMERIC ANALYSIS                                                           */
/* -------------------------------------------------------------------------- */

function analyzeNumericColumn(
  values: unknown[],
): NumericStats {
  const numericValues = values
    .map(toNumber)
    .filter(
      (value): value is number =>
        value !== null,
    );

  const missing =
    values.length -
    numericValues.length;

  if (numericValues.length === 0) {
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
    count: numericValues.length,
    missing,
    min: Math.min(
      ...numericValues,
    ),
    max: Math.max(
      ...numericValues,
    ),
    mean:
      sum / numericValues.length,
    median: median(numericValues),
    sum,
    standardDeviation:
      standardDeviation(
        numericValues,
      ),
    uniqueCount: new Set(
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
  const validValues = values.filter(
    (value) => !isMissing(value),
  );

  const counts =
    new Map<string, number>();

  for (const value of validValues) {
    const normalized =
      normalizeString(value);

    counts.set(
      normalized,
      (counts.get(normalized) ?? 0) +
        1,
    );
  }

  const topValues = Array.from(
    counts.entries(),
  )
    .sort(
      (a, b) => b[1] - a[1],
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
    count: validValues.length,
    missing:
      values.length -
      validValues.length,
    uniqueCount: counts.size,
    topValues,
  };
}

/* -------------------------------------------------------------------------- */
/* DATE ANALYSIS                                                              */
/* -------------------------------------------------------------------------- */

function analyzeDateColumn(
  values: unknown[],
): DateStats {
  const dates = values
    .filter(
      (value) => !isMissing(value),
    )
    .map(parseDate)
    .filter(
      (date): date is Date =>
        date !== null,
    );

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

  const timestamps = dates.map(
    (date) => date.getTime(),
  );

  const minTime = Math.min(
    ...timestamps,
  );

  const maxTime = Math.max(
    ...timestamps,
  );

  const spanDays =
    (maxTime - minTime) /
    (1000 * 60 * 60 * 24);

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
    count: dates.length,
    missing:
      values.length - dates.length,
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

function analyzeColumn(
  name: string,
  rows: DataRow[],
): ColumnAnalysis {
  const values = rows.map(
    (row) => row[name],
  );

  const kind =
    determineColumnKind(values);

  const validValues = values.filter(
    (value) => !isMissing(value),
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

  const result: ColumnAnalysis = {
    name,
    kind,
    nullable:
      missingCount > 0,
    uniqueCount,
    missingCount,
    missingPercentage: round(
      percentage(
        missingCount,
        rows.length,
      ),
      2,
    ),
    sampleValues,
  };

  if (kind === 'numeric') {
    result.numeric =
      analyzeNumericColumn(
        values,
      );
  }

  if (kind === 'categorical') {
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

function countDuplicateRows(
  rows: DataRow[],
): number {
  const seen = new Set<string>();
  let duplicates = 0;

  for (const row of rows) {
    let serialized: string;

    try {
      serialized =
        JSON.stringify(row);
    } catch {
      serialized =
        Object.entries(row)
          .sort(([a], [b]) =>
            a.localeCompare(b),
          )
          .map(
            ([key, value]) =>
              `${key}:${String(
                value,
              )}`,
          )
          .join('|');
    }

    if (seen.has(serialized)) {
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

    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  const denominator =
    Math.sqrt(
      denominatorX *
        denominatorY,
    );

  if (denominator === 0) {
    return null;
  }

  return (
    numerator / denominator
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
          toNumber(row[columnA]);

        const y =
          toNumber(row[columnB]);

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

      if (pairs.length < 3) {
        continue;
      }

      const correlation =
        pearsonCorrelation(
          pairs.map(
            (pair) => pair.x,
          ),
          pairs.map(
            (pair) => pair.y,
          ),
        );

      if (
        correlation === null
      ) {
        continue;
      }

      /*
       * Weak correlations are still useful to the AI,
       * but we avoid flooding the result with noise.
       */
      if (
        Math.abs(correlation) <
        0.25
      ) {
        continue;
      }

      results.push({
        columnA,
        columnB,
        correlation: round(
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
  if (!dateColumn) {
    return [];
  }

  const records: Array<{
    date: Date;
    values: Record<
      string,
      number
    >;
  }> = [];

  for (const row of rows) {
    const date =
      parseDate(
        row[dateColumn],
      );

    if (!date) {
      continue;
    }

    const values: Record<
      string,
      number
    > = {};

    for (const column of numericColumns) {
      const value =
        toNumber(row[column]);

      if (value !== null) {
        values[column] =
          value;
      }
    }

    if (
      Object.keys(values)
        .length > 0
    ) {
      records.push({
        date,
        values,
      });
    }
  }

  records.sort(
    (a, b) =>
      a.date.getTime() -
      b.date.getTime(),
  );

  if (records.length < 2) {
    return [];
  }

  const trends: TrendAnalysis[] =
    [];

  for (const column of numericColumns) {
    const values =
      records
        .map(
          (record) =>
            record.values[
              column
            ],
        )
        .filter(
          (
            value,
          ): value is number =>
            value !==
            undefined,
        );

    if (values.length < 2) {
      continue;
    }

    /*
     * Use averages of the first and last 10%
     * instead of simply comparing the first and
     * last row. This makes trends more robust
     * against noisy datasets.
     */
    const windowSize =
      Math.max(
        1,
        Math.floor(
          values.length *
            0.1,
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

    if (firstValue !== 0) {
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

    let direction:
      | TrendAnalysis['direction'] =
      'unknown';

    if (
      changePercentage !== null
    ) {
      if (
        changePercentage >
        3
      ) {
        direction =
          'increasing';
      } else if (
        changePercentage <
        -3
      ) {
        direction =
          'decreasing';
      } else {
        direction =
          'flat';
      }
    }

    trends.push({
      column,
      direction,
      changePercentage,
      firstValue:
        round(
          firstValue,
          4,
        ),
      lastValue:
        round(
          lastValue,
          4,
        ),
    });
  }

  return trends;
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
    if (
      column.missingPercentage >=
      50
    ) {
      issues.push({
        type:
          'missing-values',
        column:
          column.name,
        severity: 'high',
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
        severity: 'medium',
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
        severity: 'low',
        message:
          `${column.name} contains ${column.missingPercentage}% missing values.`,
      });
    }

    if (
      column.uniqueCount === 1 &&
      column.missingCount === 0
    ) {
      issues.push({
        type:
          'constant-column',
        column:
          column.name,
        severity: 'low',
        message:
          `${column.name} contains only one unique value and provides little analytical variation.`,
      });
    }

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
        severity: 'medium',
        message:
          `${column.name} has high cardinality with ${column.uniqueCount} unique values.`,
      });
    }

    if (
      column.kind === 'text'
    ) {
      issues.push({
        type:
          'mostly-text',
        column:
          column.name,
        severity: 'low',
        message:
          `${column.name} appears to contain free-form text rather than structured analytical values.`,
      });
    }
  }

  if (duplicateRows > 0) {
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

    const measures =
      numericColumns.slice(
        0,
        3,
      );

    candidates.push({
      type: 'line',
      title:
        'Trend over time',
      dimension:
        dateColumn,
      measures,
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
   * Category → measure.
   */
  if (
    categoricalColumns.length >
      0 &&
    numericColumns.length > 0
  ) {
    const dimension =
      categoricalColumns[0];

    const measure =
      numericColumns[0];

    candidates.push({
      type: 'bar',
      title:
        `${measure} by ${dimension}`,
      dimension,
      measures: [measure],
      reason:
        'A categorical dimension and numeric measure support category comparison.',
      priority: 90,
    });

    candidates.push({
      type: 'horizontal-bar',
      title:
        `${measure} ranking by ${dimension}`,
      dimension,
      measures: [measure],
      reason:
        'A horizontal ranking is useful when category labels may be long.',
      priority: 75,
    });

    if (
      numericColumns.length >=
      2
    ) {
      candidates.push({
        type: 'grouped-bar',
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

  /*
   * Distribution.
   */
  if (
    numericColumns.length > 0
  ) {
    const measure =
      numericColumns[0];

    candidates.push({
      type: 'histogram',
      title:
        `${measure} distribution`,
      measures: [measure],
      reason:
        'A numeric measure can be examined for its distribution and concentration.',
      priority: 65,
    });

    if (
      categoricalColumns.length >
      0
    ) {
      candidates.push({
        type: 'box-plot',
        title:
          `${measure} distribution by ${categoricalColumns[0]}`,
        dimension:
          categoricalColumns[0],
        measures: [measure],
        reason:
          'A numeric measure can be compared across categories using distributions.',
        priority: 60,
      });
    }
  }

  /*
   * Correlation / relationship.
   */
  if (
    numericColumns.length >=
    2
  ) {
    candidates.push({
      type: 'scatter',
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
   * Proportion charts should only be recommended when
   * there is a sensible categorical dimension.
   */
  if (
    categoricalColumns.length >
      0 &&
    numericColumns.length > 0
  ) {
    const dimension =
      categoricalColumns[0];

    const measure =
      numericColumns[0];

    candidates.push({
      type: 'donut',
      title:
        `${measure} breakdown`,
      dimension,
      measures: [measure],
      reason:
        'The categorical dimension can be used to show proportional contribution to the numeric measure.',
      priority: 45,
    });

    candidates.push({
      type: 'treemap',
      title:
        `${measure} by ${dimension}`,
      dimension,
      measures: [measure],
      reason:
        'A treemap can communicate relative magnitude across multiple categories.',
      priority: 40,
    });
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
  if (rows.length === 0) {
    return {
      status:
        'not-analyzable',
      reason:
        'No structured records were found in the uploaded content.',
    };
  }

  if (columns.length === 0) {
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
    status: 'analyzable',
  };
}

/* -------------------------------------------------------------------------- */
/* MAIN ANALYZER                                                              */
/* -------------------------------------------------------------------------- */

export function analyzeDatasetStructure(
  profile: DatasetProfile,
): DatasetAnalysis {
  const rows =
    toRows(profile);

  const columnNames =
    getProfileColumns(
      profile,
      rows,
    );

  const columns =
    columnNames.map(
      (name) =>
        analyzeColumn(
          name,
          rows,
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
   * Measures are numeric columns with actual variation.
   */
  const measures =
    columns
      .filter(
        (column) =>
          column.kind ===
            'numeric' &&
          column.uniqueCount > 1,
      )
      .map(
        (column) =>
          column.name,
      );

  /*
   * Dimensions are categorical columns plus dates.
   */
  const dimensions = [
    ...categoricalColumns,
    ...dateColumns,
  ];

  const duplicateRows =
    countDuplicateRows(
      rows,
    );

  const qualityIssues =
    calculateQualityIssues(
      rows,
      columns,
      duplicateRows,
    );

  const trends =
    calculateTrends(
      rows,
      dateColumns[0],
      numericColumns,
    );

  const correlations =
    calculateCorrelations(
      rows,
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
      rows,
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

    rowCount: rows.length,

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

/**
 * Creates a compact representation that can safely be passed to an LLM.
 *
 * We do NOT send every raw row to the model.
 *
 * The deterministic analyzer calculates the important facts first.
 */
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
                  }
                : undefined,
            categorical:
              column
                .categorical
                ? {
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