/* -------------------------------------------------------------------------- */
/* DATASET TYPES                                                              */
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

/* -------------------------------------------------------------------------- */
/* DATASET PROFILE                                                            */
/* -------------------------------------------------------------------------- */

export interface DatasetProfile {
  /**
   * Original uploaded file name.
   */
  fileName: string;

  /**
   * MIME type or normalized file type.
   */
  fileType: string;

  /**
   * Number of actual parsed records.
   */
  rowCount: number;

  /**
   * Number of detected columns.
   */
  columnCount: number;

  /**
   * Detected dataset schema.
   */
  columns: DatasetColumn[];

  /**
   * Small sample of rows used for preview/profile purposes.
   *
   * This is NOT the complete dataset.
   */
  sampleRows: Record<
    string,
    unknown
  >[];

  /**
   * Optional preview representation.
   *
   * Kept flexible because the profiler may expose
   * a richer preview object.
   */
  preview?: unknown;

  /**
   * Statistical and profiling information.
   */
  statistics?: Record<
    string,
    unknown
  >;

  /**
   * Numeric columns detected by the profiler.
   */
  numericColumns?: string[];

  /**
   * Categorical columns detected by the profiler.
   */
  categoricalColumns?: string[];

  /**
   * Date columns detected by the profiler.
   */
  dateColumns?: string[];

  /**
   * Total missing values detected by the profiler.
   */
  totalMissingValues?: number;

  /**
   * Extracted text for documents / essays /
   * plain text files.
   */
  textContent?: string;

  /**
   * Whether the uploaded content contains
   * structured data.
   */
  isStructured: boolean;

  /**
   * Whether the structured data contains
   * useful numeric measures.
   */
  isQuantitative: boolean;

  /**
   * Warnings generated during ingestion/profiling.
   */
  warnings?: string[];
}