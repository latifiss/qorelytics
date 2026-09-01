import {
  ChartConfig,
  ChartDataPoint,
  ChartType,
} from '@/components/charts/types/chart.types';

import { ReportSection } from '@/components/ui/types';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface AnalysisChartSpec {
  type: string;
  title: string;
  description?: string;
  dimensions: string[];
  measures: string[];
  reason: string;
}

export interface AnalysisRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisSection {
  title: string;
  content: string;
  importance?: 'high' | 'medium' | 'low';
}

export interface BuildReportInput {
  sections: AnalysisSection[];
  charts: AnalysisChartSpec[];
  recommendations?: AnalysisRecommendation[];
  limitations?: string[];
}

export interface ChartDataBundle {
  config: ChartConfig;
  data: ChartDataPoint[];
}

/* -------------------------------------------------------------------------- */
/* CHART TYPE MAP                                                             */
/* -------------------------------------------------------------------------- */

const ANALYSIS_CHART_TYPE_MAP: Record<
  string,
  ChartType
> = {
  bar: 'bar',
  'horizontal-bar': 'horizontalBar',
  'grouped-bar': 'groupedBar',
  'stacked-bar': 'stackedBar',
  line: 'line',
  area: 'area',
  pie: 'pie',
  donut: 'donut',
  scatter: 'scatter',
  histogram: 'histogram',
  'box-plot': 'boxPlot',
  funnel: 'funnel',
  waterfall: 'waterfall',
  radar: 'radar',
  treemap: 'treemap',
  gauge: 'gauge',
  sankey: 'sankey',
};

function mapAnalysisChartType(
  type: string,
): ChartType {
  return (
    ANALYSIS_CHART_TYPE_MAP[type] ??
    'bar'
  );
}

/* -------------------------------------------------------------------------- */
/* ROW HELPERS                                                                */
/* -------------------------------------------------------------------------- */

function normalizeColumnName(
  name: string,
): string {
  return name.trim().toLowerCase();
}

function resolveColumnName(
  rows: Record<string, unknown>[],
  requestedName: string,
): string | null {
  if (!requestedName) {
    return null;
  }

  const columns =
    rows.length > 0
      ? Object.keys(rows[0])
      : [];

  const exactMatch =
    columns.find(
      (column) =>
        column === requestedName,
    );

  if (exactMatch) {
    return exactMatch;
  }

  const normalizedRequested =
    normalizeColumnName(
      requestedName,
    );

  return (
    columns.find(
      (column) =>
        normalizeColumnName(
          column,
        ) ===
        normalizedRequested,
    ) ?? null
  );
}

function coerceNumericValue(
  value: unknown,
): number | string | boolean | null {
  if (
    typeof value === 'number' &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === 'string' &&
    value.trim() !== ''
  ) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  if (
    typeof value === 'boolean' ||
    value === null
  ) {
    return value;
  }

  if (value === undefined) {
    return null;
  }

  return String(value);
}

function buildChartRows(
  rows: Record<string, unknown>[],
  dimensions: string[],
  measures: string[],
): ChartDataPoint[] {
  const resolvedDimensions =
    dimensions
      .map((dimension) =>
        resolveColumnName(
          rows,
          dimension,
        ),
      )
      .filter(
        (
          dimension,
        ): dimension is string =>
          dimension !== null,
      );

  const resolvedMeasures =
    measures
      .map((measure) =>
        resolveColumnName(
          rows,
          measure,
        ),
      )
      .filter(
        (
          measure,
        ): measure is string =>
          measure !== null,
      );

  const fields = [
    ...new Set([
      ...resolvedDimensions,
      ...resolvedMeasures,
    ]),
  ];

  if (
    fields.length === 0 ||
    rows.length === 0
  ) {
    return [];
  }

  return rows.map((row) => {
    const point: ChartDataPoint =
      {};

    fields.forEach((field) => {
      point[field] =
        coerceNumericValue(
          row[field],
        );
    });

    return point;
  });
}

/* -------------------------------------------------------------------------- */
/* PUBLIC API                                                                 */
/* -------------------------------------------------------------------------- */

export function getDatasetRows(
  profile?:
    | {
        sampleRows?: Record<
          string,
          unknown
        >[];
        preview?: Record<
          string,
          unknown
        >[];
      }
    | null,
): Record<string, unknown>[] {
  if (!profile) {
    return [];
  }

  if (
    Array.isArray(
      profile.sampleRows,
    ) &&
    profile.sampleRows.length > 0
  ) {
    return profile.sampleRows;
  }

  if (
    Array.isArray(profile.preview) &&
    profile.preview.length > 0
  ) {
    return profile.preview;
  }

  return [];
}

export function buildChartDataFromAnalysis(
  charts: AnalysisChartSpec[],
  rows: Record<string, unknown>[],
): ChartDataBundle[] {
  if (
    !charts.length ||
    !rows.length
  ) {
    return [];
  }

  return charts
    .map((chart, index) => {
      const data =
        buildChartRows(
          rows,
          chart.dimensions,
          chart.measures,
        );

      if (data.length === 0) {
        return null;
      }

      const resolvedDimensions =
        chart.dimensions
          .map((dimension) =>
            resolveColumnName(
              rows,
              dimension,
            ),
          )
          .filter(
            (
              dimension,
            ): dimension is string =>
              dimension !== null,
          );

      const resolvedMeasures =
        chart.measures
          .map((measure) =>
            resolveColumnName(
              rows,
              measure,
            ),
          )
          .filter(
            (
              measure,
            ): measure is string =>
              measure !== null,
          );

      const config: ChartConfig =
        {
          id: `analysis-chart-${index}-${Date.now()}`,
          type: mapAnalysisChartType(
            chart.type,
          ),
          title: chart.title,
          description:
            chart.description ??
            chart.reason,
          dimensions:
            resolvedDimensions,
          measures:
            resolvedMeasures,
          aggregation: 'sum',
          sortOrder: 'asc',
          showLegend: true,
          animate: true,
        };

      return {
        config,
        data,
      };
    })
    .filter(
      (
        chart,
      ): chart is ChartDataBundle =>
        chart !== null,
    );
}

function formatRecommendationsSection(
  recommendations: AnalysisRecommendation[],
): string {
  return recommendations
    .map((item) => {
      const priority =
        item.priority.toUpperCase();

      return `- **${item.title}** (${priority}): ${item.description}`;
    })
    .join('\n');
}

function formatLimitationsSection(
  limitations: string[],
): string {
  return limitations
    .map(
      (limitation) =>
        `- ${limitation}`,
    )
    .join('\n');
}

export function buildReportSections(
  input: BuildReportInput,
): ReportSection[] {
  const sections: ReportSection[] =
    input.sections.map(
      (section) => ({
        title: section.title,
        content:
          section.content.trim(),
      }),
    );

  if (input.charts.length > 0) {
    const visualizationContent =
      input.charts
        .map((chart, index) => {
          const description =
            chart.description?.trim() ||
            chart.reason.trim();

          return `${description}\n\n[CHART:${index}]`;
        })
        .join('\n\n');

    sections.push({
      title: 'Key Visualizations',
      content:
        visualizationContent,
    });
  }

  if (
    input.recommendations &&
    input.recommendations.length >
      0
  ) {
    sections.push({
      title: 'Recommendations',
      content:
        formatRecommendationsSection(
          input.recommendations,
        ),
    });
  }

  if (
    input.limitations &&
    input.limitations.length > 0
  ) {
    sections.push({
      title: 'Limitations',
      content:
        formatLimitationsSection(
          input.limitations,
        ),
    });
  }

  return sections;
}
