import { z } from "zod";

export const supportedFileTypes = [
  "text/csv",
  "application/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/json",
] as const;

export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const datasetUploadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Dataset name is required")
    .max(100, "Dataset name is too long"),
});

export function validateDatasetFile(file: File): void {
  if (file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The maximum dataset size is 25MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  const supportedExtensions = ["csv", "xlsx", "xls", "json"];

  if (!extension || !supportedExtensions.includes(extension)) {
    throw new Error(
      "Unsupported file type. Upload CSV, XLSX, XLS, or JSON files.",
    );
  }
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}