import Papa from "papaparse";
import * as XLSX from "xlsx";

import type { ParsedDataset } from "@/src/types/dataset";

function normalizeRows(rows: unknown[]): Record<string, unknown>[] {
  return rows.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null && !Array.isArray(row),
  );
}

function parseCsv(text: string): ParsedDataset {
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    const firstError = result.errors[0];

    throw new Error(
      `CSV parsing failed: ${firstError?.message ?? "Unknown error"}`,
    );
  }

  const rows = normalizeRows(result.data);

  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row))),
  );

  return {
    rows,
    columns,
  };
}

function parseSpreadsheet(buffer: Buffer): ParsedDataset {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellDates: true,
  });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("The spreadsheet does not contain a worksheet.");
  }

  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error("Unable to read the first worksheet.");
  }

  const rawRows = XLSX.utils.sheet_to_json<unknown>(worksheet, {
    defval: null,
    raw: true,
  });

  const rows = normalizeRows(rawRows);

  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row))),
  );

  return {
    rows,
    columns,
  };
}

function parseJson(text: string): ParsedDataset {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("The JSON file contains invalid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON datasets must contain an array of objects.");
  }

  const rows = normalizeRows(parsed);

  if (rows.length === 0) {
    throw new Error("The JSON dataset does not contain any rows.");
  }

  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row))),
  );

  return {
    rows,
    columns,
  };
}

export async function parseDataset(
  file: File,
  extension: string,
): Promise<ParsedDataset> {
  if (extension === "csv") {
    const text = await file.text();

    return parseCsv(text);
  }

  if (extension === "json") {
    const text = await file.text();

    return parseJson(text);
  }

  if (extension === "xlsx" || extension === "xls") {
    const arrayBuffer = await file.arrayBuffer();

    return parseSpreadsheet(Buffer.from(arrayBuffer));
  }

  throw new Error(`Unsupported file extension: ${extension}`);
}