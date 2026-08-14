import type {
  DatasetColumn,
  DatasetColumnType,
  DatasetProfile,
} from "@/src/types/dataset";

function isMissing(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

function isDateValue(value: unknown): boolean {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  const parsed = Date.parse(trimmed);

  return !Number.isNaN(parsed);
}

function detectColumnType(values: unknown[]): DatasetColumnType {
  const validValues = values.filter((value) => !isMissing(value));

  if (validValues.length === 0) {
    return "unknown";
  }

  if (validValues.every((value) => typeof value === "boolean")) {
    return "boolean";
  }

  if (
    validValues.every(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value),
    )
  ) {
    return "number";
  }

  if (validValues.every((value) => isDateValue(value))) {
    return "date";
  }

  if (
    validValues.every(
      (value) =>
        typeof value === "string" ||
        typeof value === "number",
    )
  ) {
    return "string";
  }

  return "unknown";
}

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function numericStatistics(values: unknown[]) {
  const numbers = values
    .filter((value): value is number => {
      return (
        typeof value === "number" &&
        Number.isFinite(value)
      );
    })
    .sort((a, b) => a - b);

  if (numbers.length === 0) {
    return undefined;
  }

  const sum = numbers.reduce((total, value) => total + value, 0);

  return {
    min: numbers[0],
    max: numbers[numbers.length - 1],
    mean: sum / numbers.length,
    median: median(numbers),
    sum,
  };
}

export function profileDataset(
  rows: Record<string, unknown>[],
  columns: string[],
): DatasetProfile {
  const datasetColumns: DatasetColumn[] = [];

  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];

  let totalMissingValues = 0;

  for (const columnName of columns) {
    const values = rows.map((row) => row[columnName]);

    const missingCount = values.filter(isMissing).length;

    totalMissingValues += missingCount;

    const type = detectColumnType(values);

    const uniqueValues = new Set(
      values
        .filter((value) => !isMissing(value))
        .map((value) => String(value)),
    );

    const column: DatasetColumn = {
      name: columnName,
      type,
      nullable: missingCount > 0,
      uniqueCount: uniqueValues.size,
      missingCount,
      missingPercentage:
        rows.length === 0
          ? 0
          : Number(((missingCount / rows.length) * 100).toFixed(2)),
      sampleValues: values
        .filter((value) => !isMissing(value))
        .slice(0, 5),
    };

    if (type === "number") {
      column.statistics = numericStatistics(values);
      numericColumns.push(columnName);
    }

    if (type === "string" || type === "boolean") {
      categoricalColumns.push(columnName);
    }

    if (type === "date") {
      dateColumns.push(columnName);
    }

    datasetColumns.push(column);
  }

  return {
    rowCount: rows.length,
    columnCount: columns.length,
    columns: datasetColumns,

    preview: rows.slice(0, 20),

    numericColumns,
    categoricalColumns,
    dateColumns,

    totalMissingValues,

    generatedAt: new Date().toISOString(),
  };
}