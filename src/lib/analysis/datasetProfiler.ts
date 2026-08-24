import type {
  DatasetProfile,
  DatasetColumn,
  DatasetColumnType,
} from '@/src/types/dataset';

/* -------------------------------------------------------------------------- */
/*                               TYPES                                        */
/* -------------------------------------------------------------------------- */

interface ParsedRow {
  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/*                         CONSTANTS                                          */
/* -------------------------------------------------------------------------- */

/**
 * We intentionally don't send the entire dataset into the AI context.
 *
 * The deterministic analyzer works from the complete dataset when available,
 * while the profile keeps only a representative sample.
 */
const MAX_SAMPLE_ROWS = 100;

/**
 * Maximum amount of text passed into the AI analysis pipeline.
 */
const MAX_TEXT_LENGTH = 50_000;

/* -------------------------------------------------------------------------- */
/*                         BASIC TYPE HELPERS                                 */
/* -------------------------------------------------------------------------- */

function isEmptyValue(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

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

function isNumber(
  value: unknown,
): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value !== 'string') {
    return false;
  }

  const trimmed =
    value.trim();

  if (!trimmed) {
    return false;
  }

  /*
   * Support common numeric formats:
   *
   * 100
   * 100.50
   * $100
   * €100
   * £100
   * 1,000
   * 25%
   */
  const normalized =
    trimmed
      .replace(
        /[$€£¥₹,%]/g,
        '',
      )
      .replace(
        /,/g,
        '',
      )
      .trim();

  if (!normalized) {
    return false;
  }

  return Number.isFinite(
    Number(normalized),
  );
}

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

  const normalized =
    value
      .replace(
        /[$€£¥₹,%]/g,
        '',
      )
      .replace(
        /,/g,
        '',
      )
      .trim();

  if (!normalized) {
    return null;
  }

  const number =
    Number(normalized);

  return Number.isFinite(number)
    ? number
    : null;
}

function isBoolean(
  value: unknown,
): boolean {
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  const normalized =
    value
      .trim()
      .toLowerCase();

  return (
    normalized === 'true' ||
    normalized === 'false' ||
    normalized === 'yes' ||
    normalized === 'no' ||
    normalized === 'y' ||
    normalized === 'n'
  );
}

function isDate(
  value: unknown,
): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(
      value.getTime(),
    );
  }

  if (
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    return false;
  }

  const stringValue =
    String(value).trim();

  if (!stringValue) {
    return false;
  }

  /*
   * Don't interpret ordinary numeric values
   * as dates.
   */
  if (
    typeof value === 'number' ||
    /^\d+$/.test(
      stringValue,
    )
  ) {
    return false;
  }

  const parsed =
    Date.parse(
      stringValue,
    );

  return !Number.isNaN(
    parsed,
  );
}

/* -------------------------------------------------------------------------- */
/*                         COLUMN TYPE DETECTION                              */
/* -------------------------------------------------------------------------- */

function detectColumnType(
  values: unknown[],
): DatasetColumnType {
  const nonEmpty =
    values.filter(
      (value) =>
        !isEmptyValue(value),
    );

  if (!nonEmpty.length) {
    return 'unknown';
  }

  const numericCount =
    nonEmpty.filter(
      isNumber,
    ).length;

  const booleanCount =
    nonEmpty.filter(
      isBoolean,
    ).length;

  const dateCount =
    nonEmpty.filter(
      isDate,
    ).length;

  const total =
    nonEmpty.length;

  /*
   * Boolean before numeric/date.
   */
  if (
    booleanCount / total >=
    0.9
  ) {
    return 'boolean';
  }

  /*
   * Date before string because dates are
   * commonly represented as strings.
   */
  if (
    dateCount / total >=
    0.9
  ) {
    return 'date';
  }

  if (
    numericCount / total >=
    0.9
  ) {
    return 'number';
  }

  return 'string';
}

/* -------------------------------------------------------------------------- */
/*                            STATISTICS                                      */
/* -------------------------------------------------------------------------- */

function calculateMedian(
  values: number[],
): number | undefined {
  if (!values.length) {
    return undefined;
  }

  const sorted =
    [...values].sort(
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

function calculateNumericStats(
  values: unknown[],
): {
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
} {
  const numbers =
    values
      .map(toNumber)
      .filter(
        (
          value,
        ): value is number =>
          value !== null,
      );

  if (!numbers.length) {
    return {};
  }

  const sum =
    numbers.reduce(
      (
        total,
        value,
      ) =>
        total + value,
      0,
    );

  return {
    min: Math.min(
      ...numbers,
    ),

    max: Math.max(
      ...numbers,
    ),

    mean:
      sum /
      numbers.length,

    median:
      calculateMedian(
        numbers,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/*                         COLUMN PROFILING                                    */
/* -------------------------------------------------------------------------- */

function profileColumn(
  name: string,
  rows: ParsedRow[],
): DatasetColumn {
  const values =
    rows.map(
      (row) =>
        row[name],
    );

  const type =
    detectColumnType(
      values,
    );

  const nonEmptyValues =
    values.filter(
      (value) =>
        !isEmptyValue(value),
    );

  const uniqueValues =
    new Set(
      nonEmptyValues.map(
        (value) =>
          String(value),
      ),
    );

  const missingCount =
    values.length -
    nonEmptyValues.length;

  const missingPercentage =
    values.length === 0
      ? 0
      : (missingCount /
          values.length) *
        100;

  const result: DatasetColumn = {
    name,

    type,

    nullable:
      missingCount > 0,

    uniqueCount:
      uniqueValues.size,

    missingCount,

    missingPercentage:

      Math.round(
        missingPercentage *
          100,
      ) / 100,

    sampleValues:
      Array.from(
        uniqueValues,
      ).slice(0, 10),
  };

  if (
    type === 'number'
  ) {
    Object.assign(
      result,
      calculateNumericStats(
        values,
      ),
    );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                         MISSING VALUES                                     */
/* -------------------------------------------------------------------------- */

function calculateMissingValues(
  rows: ParsedRow[],
  columns: string[],
): Record<string, number> {
  const result: Record<
    string,
    number
  > = {};

  for (const column of columns) {
    let missing = 0;

    for (const row of rows) {
      if (
        isEmptyValue(
          row[column],
        )
      ) {
        missing++;
      }
    }

    result[column] =
      missing;
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                         DATASET PROFILING                                  */
/* -------------------------------------------------------------------------- */

export function profileRows({
  fileName,
  fileType,
  rows,
  warnings = [],
}: {
  fileName: string;
  fileType: string;
  rows: ParsedRow[];
  warnings?: string[];
}): DatasetProfile {
  const limitedRows =
    rows.slice(
      0,
      MAX_SAMPLE_ROWS,
    );

  /*
   * Empty structured dataset.
   */
  if (!rows.length) {
    return {
      fileName,

      fileType,

      rowCount: 0,

      columnCount: 0,

      columns: [],

      sampleRows: [],

      statistics: {
        numericColumnCount: 0,

        categoricalColumnCount: 0,

        dateColumnCount: 0,

        missingValues: {},
      },

      isStructured: true,

      isQuantitative: false,

      warnings: [
        ...warnings,

        'The dataset contains no rows.',
      ],
    };
  }

  /*
   * Discover all columns from the complete dataset.
   *
   * We only profile the first MAX_SAMPLE_ROWS
   * in detail to keep the profile lightweight.
   */
  const columnNames =
    Array.from(
      new Set(
        rows.flatMap(
          (row) =>
            Object.keys(row),
        ),
      ),
    );

  const columns =
    columnNames.map(
      (name) =>
        profileColumn(
          name,
          limitedRows,
        ),
    );

  const numericColumns =
    columns.filter(
      (column) =>
        column.type ===
        'number',
    );

  const dateColumns =
    columns.filter(
      (column) =>
        column.type ===
        'date',
    );

  const categoricalColumns =
    columns.filter(
      (column) =>
        column.type ===
        'string',
    );

  const hasUsefulStructure =
    columnNames.length > 0;

  const isQuantitative =
    numericColumns.length >
    0;

  const derivedWarnings =
    [...warnings];

  if (!isQuantitative) {
    derivedWarnings.push(
      'No numeric columns were detected.',
    );
  }

  if (
    rows.length >
    MAX_SAMPLE_ROWS
  ) {
    derivedWarnings.push(
      `Only the first ${MAX_SAMPLE_ROWS} rows were profiled in detail.`,
    );
  }

  if (
    columnNames.length ===
      1 &&
    numericColumns.length ===
      0
  ) {
    derivedWarnings.push(
      'The file contains very limited structured information.',
    );
  }

  /*
   * Detect columns with substantial missing data.
   */
  for (const column of columns) {
    if (
      column.missingPercentage >=
      50
    ) {
      derivedWarnings.push(
        `${column.name} contains ${column.missingPercentage}% missing values.`,
      );
    }
  }

  return {
    fileName,

    fileType,

    rowCount:
      rows.length,

    columnCount:
      columnNames.length,

    columns,

    sampleRows:
      limitedRows,

    statistics: {
      numericColumnCount:
        numericColumns.length,

      categoricalColumnCount:
        categoricalColumns.length,

      dateColumnCount:
        dateColumns.length,

      missingValues:
        calculateMissingValues(
          rows,
          columnNames,
        ),
    },

    isStructured:
      hasUsefulStructure,

    isQuantitative:
      isQuantitative,

    warnings:
      derivedWarnings,
  };
}

/* -------------------------------------------------------------------------- */
/*                          TEXT PROFILING                                    */
/* -------------------------------------------------------------------------- */

export function profileText({
  fileName,
  fileType,
  text,
  warnings = [],
}: {
  fileName: string;
  fileType: string;
  text: string;
  warnings?: string[];
}): DatasetProfile {
  const trimmedText =
    text.trim();

  const limitedText =
    trimmedText.slice(
      0,
      MAX_TEXT_LENGTH,
    );

  const derivedWarnings =
    [...warnings];

  if (!trimmedText) {
    derivedWarnings.push(
      'The uploaded file contains no readable text.',
    );
  }

  if (
    trimmedText.length >
    MAX_TEXT_LENGTH
  ) {
    derivedWarnings.push(
      `The text was truncated to ${MAX_TEXT_LENGTH.toLocaleString()} characters for profiling.`,
    );
  }

  /*
   * Text documents are represented as:
   *
   * rowCount = 0
   * columnCount = 0
   *
   * rather than undefined.
   *
   * This keeps DatasetProfile strongly typed and avoids
   * optional-number problems throughout the analyzer.
   */
  return {
    fileName,

    fileType,

    rowCount: 0,

    columnCount: 0,

    columns: [],

    sampleRows: [],

    textContent:
      limitedText,

    isStructured: false,

    isQuantitative: false,

    statistics: {
      characterCount:
        trimmedText.length,

      wordCount:
        countWords(
          trimmedText,
        ),

      paragraphCount:
        countParagraphs(
          trimmedText,
        ),
    },

    warnings:
      derivedWarnings,
  };
}

/* -------------------------------------------------------------------------- */
/*                              TEXT HELPERS                                  */
/* -------------------------------------------------------------------------- */

function countWords(
  text: string,
): number {
  if (!text.trim()) {
    return 0;
  }

  return text
    .trim()
    .split(/\s+/)
    .length;
}

function countParagraphs(
  text: string,
): number {
  if (!text.trim()) {
    return 0;
  }

  return text
    .split(/\n\s*\n/)
    .filter(
      (paragraph) =>
        paragraph.trim()
          .length > 0,
    ).length;
}

/* -------------------------------------------------------------------------- */
/*                          GENERIC STRUCTURE CHECK                           */
/* -------------------------------------------------------------------------- */

export function looksLikeStructuredData(
  rows: unknown,
): rows is ParsedRow[] {
  if (!Array.isArray(rows)) {
    return false;
  }

  if (!rows.length) {
    return true;
  }

  return rows.every(
    (row) =>
      row !== null &&
      typeof row ===
        'object' &&
      !Array.isArray(row),
  );
}

/* -------------------------------------------------------------------------- */
/*                         PROFILE JSON DATA                                  */
/* -------------------------------------------------------------------------- */

export function profileJson({
  fileName,
  fileType,
  data,
}: {
  fileName: string;
  fileType: string;
  data: unknown;
}): DatasetProfile {
  /*
   * Normal tabular JSON:
   *
   * [
   *   { name: "John", age: 30 },
   *   { name: "Jane", age: 25 }
   * ]
   */
  if (
    looksLikeStructuredData(
      data,
    )
  ) {
    return profileRows({
      fileName,

      fileType,

      rows: data,
    });
  }

  /*
   * Non-tabular JSON:
   *
   * {
   *   title: "...",
   *   content: "..."
   * }
   *
   * Treat this as document/text content rather
   * than pretending it is an analytical dataset.
   */
  const text =
    typeof data ===
    'string'
      ? data
      : JSON.stringify(
          data,
          null,
          2,
        );

  return profileText({
    fileName,

    fileType,

    text,

    warnings: [
      'The JSON structure is not a tabular dataset.',
    ],
  });
}