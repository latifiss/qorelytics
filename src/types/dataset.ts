/* -------------------------------------------------------------------------- */
/*                              DATASET TYPES                                 */
/* -------------------------------------------------------------------------- */

export type DatasetColumnType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'unknown';

export interface DatasetColumn {
  name: string;

  type: DatasetColumnType;

  nullable: boolean;

  uniqueCount: number;

  missingCount: number;

  missingPercentage: number;

  sampleValues: unknown[];

  min?: number;

  max?: number;

  mean?: number;

  median?: number;
}

export interface DatasetProfile {
  /**
   * Original uploaded file name.
   */
  fileName: string;

  /**
   * MIME type or normalized file type.
   *
   * Examples:
   * text/csv
   * application/json
   * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   * text/plain
   */
  fileType: string;

  /**
   * Number of records.
   *
   * For text-only documents this is 0 because there
   * are no tabular records.
   */
  rowCount: number;

  /**
   * Number of detected columns.
   *
   * For text-only documents this is 0.
   */
  columnCount: number;

  /**
   * Detected dataset schema.
   */
  columns: DatasetColumn[];

  /**
   * Small sample of rows used for analysis.
   */
  sampleRows: Record<string, unknown>[];

  /**
   * Statistical and profiling information.
   */
  statistics?: Record<string, unknown>;

  /**
   * Extracted text for documents / essays / plain text files.
   */
  textContent?: string;

  /**
   * Whether the uploaded content contains structured data.
   */
  isStructured: boolean;

  /**
   * Whether the structured data contains useful numeric measures.
   */
  isQuantitative: boolean;

  /**
   * Warnings generated during ingestion/profiling.
   */
  warnings?: string[];
}