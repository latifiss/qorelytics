import { generateText } from "ai";

import { getModel } from "@/src/lib/ai/model";
import { createAnalysisPrompt } from "@/src/lib/ai/prompts";
import type { DatasetProfile } from "@/src/types/dataset";

export interface AnalystResult {
  summary: string;

  keyInsights: Array<{
    title: string;
    description: string;
    importance: "high" | "medium" | "low";
  }>;

  trends: Array<{
    title: string;
    description: string;
  }>;

  dataQuality: Array<{
    title: string;
    description: string;
  }>;

  recommendedCharts: Array<{
    title: string;
    type: string;
    xAxis?: string;
    yAxis?: string;
    reason: string;
  }>;

  questionsToExplore: string[];
}

function parseAnalystResult(text: string): AnalystResult {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return {
      summary: text,
      keyInsights: [],
      trends: [],
      dataQuality: [],
      recommendedCharts: [],
      questionsToExplore: [],
    };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null
  ) {
    throw new Error("AI returned an invalid analysis.");
  }

  const value = parsed as Record<string, unknown>;

  return {
    summary:
      typeof value.summary === "string"
        ? value.summary
        : "",

    keyInsights: Array.isArray(value.keyInsights)
      ? value.keyInsights.filter(
          (
            item,
          ): item is AnalystResult["keyInsights"][number] =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as Record<string, unknown>).title ===
              "string" &&
            typeof (item as Record<string, unknown>)
              .description === "string",
        )
      : [],

    trends: Array.isArray(value.trends)
      ? value.trends.filter(
          (
            item,
          ): item is AnalystResult["trends"][number] =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as Record<string, unknown>).title ===
              "string" &&
            typeof (item as Record<string, unknown>)
              .description === "string",
        )
      : [],

    dataQuality: Array.isArray(value.dataQuality)
      ? value.dataQuality.filter(
          (
            item,
          ): item is AnalystResult["dataQuality"][number] =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as Record<string, unknown>).title ===
              "string" &&
            typeof (item as Record<string, unknown>)
              .description === "string",
        )
      : [],

    recommendedCharts: Array.isArray(
      value.recommendedCharts,
    )
      ? value.recommendedCharts.filter(
          (
            item,
          ): item is AnalystResult["recommendedCharts"][number] =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as Record<string, unknown>).title ===
              "string" &&
            typeof (item as Record<string, unknown>).reason ===
              "string",
        )
      : [],

    questionsToExplore: Array.isArray(
      value.questionsToExplore,
    )
      ? value.questionsToExplore.filter(
          (item): item is string =>
            typeof item === "string",
        )
      : [],
  };
}

export async function analyzeDataset(
  profile: DatasetProfile,
  modelName = "deepseek/deepseek-chat",
): Promise<AnalystResult> {
  const result = await generateText({
    model: getModel(modelName),
    prompt: createAnalysisPrompt(profile),
    temperature: 0.2,
  });

  return parseAnalystResult(result.text);
}