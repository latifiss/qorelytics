export type DatasetColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "unknown";

export interface DatasetColumn {
  name: string;
  type: DatasetColumnType;
  nullable: boolean;
  uniqueCount: number;
  missingCount: number;
  missingPercentage: number;
  sampleValues: unknown[];

  statistics?: {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    sum?: number;
  };
}

export interface DatasetProfile {
  rowCount: number;
  columnCount: number;
  columns: DatasetColumn[];

  preview: Record<string, unknown>[];

  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];

  totalMissingValues: number;

  generatedAt: string;
}

export interface ParsedDataset {
  rows: Record<string, unknown>[];
  columns: string[];
}