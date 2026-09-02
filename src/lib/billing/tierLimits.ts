export type BillingTier = "free" | "pro" | "team";

export const TIER_LIMITS = {
  free: {
    maxFileSizeBytes: 10 * 1024 * 1024,
    maxUploadsPerMonth: 10,
    allowedExtensions: ["csv"] as const,
  },
  pro: {
    maxFileSizeBytes: 70 * 1024 * 1024,
    maxUploadsPerMonth: null,
    allowedExtensions: ["csv", "xlsx", "xls", "json"] as const,
  },
  team: {
    maxFileSizeBytes: 200 * 1024 * 1024,
    maxUploadsPerMonth: null,
    allowedExtensions: ["csv", "xlsx", "xls", "json"] as const,
  },
} satisfies Record<
  BillingTier,
  {
    maxFileSizeBytes: number;
    maxUploadsPerMonth: number | null;
    allowedExtensions: readonly string[];
  }
>;

export function normalizeBillingTier(value: string | null | undefined): BillingTier {
  if (value === "pro" || value === "team") {
    return value;
  }

  return "free";
}

export function getTierLimits(tier: string | null | undefined) {
  return TIER_LIMITS[normalizeBillingTier(tier)];
}

export function formatFileSize(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

export function validateFileForTier(
  file: File,
  tier: string | null | undefined,
): void {
  const normalizedTier = normalizeBillingTier(tier);
  const limits = TIER_LIMITS[normalizedTier];
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }

  if (file.size > limits.maxFileSizeBytes) {
    throw new Error(
      `Your ${normalizedTier} plan allows files up to ${formatFileSize(limits.maxFileSizeBytes)}.`,
    );
  }

  if (!limits.allowedExtensions.includes(extension)) {
    const allowed = limits.allowedExtensions.map((item) => item.toUpperCase()).join(", ");

    throw new Error(
      `Your ${normalizedTier} plan supports ${allowed} files. Upgrade your plan to upload this file type.`,
    );
  }
}
