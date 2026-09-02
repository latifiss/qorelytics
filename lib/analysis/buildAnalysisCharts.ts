import {
  ChartConfig,
  ChartDataPoint,
  ChartType,
} from '@/components/charts/types/chart.types';

import { ReportSection } from '@/components/ui/types';

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
  rows?: Record<string, unknown>[];
  recommendations?: AnalysisRecommendation[];
  limitations?: string[];
}

export interface ChartDataBundle {
  config: ChartConfig;
  data: ChartDataPoint[];
}

const ANALYSIS_CHART_TYPE_MAP: Record<string, ChartType> = {
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

function mapAnalysisChartType(type: string): ChartType {
  return ANALYSIS_CHART_TYPE_MAP[type] ?? 'bar';
}

function normalizeColumnName(name: string): string {
  return name.trim().toLowerCase();
}

function resolveColumnName(
  rows: Record<string, unknown>[],
  requestedName: string,
): string | null {
  if (!requestedName) return null;

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const exactMatch = columns.find((column) => column === requestedName);
  if (exactMatch) return exactMatch;

  const normalizedRequested = normalizeColumnName(requestedName);
  return (
    columns.find(
      (column) => normalizeColumnName(column) === normalizedRequested,
    ) ?? null
  );
}

function coerceNumericValue(
  value: unknown,
): number | string | boolean | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  if (typeof value === 'boolean' || value === null) return value;
  if (value === undefined) return null;

  return String(value);
}

/* -------------------------------------------------------------------------- */
/* RAW TEXT EXTRACTION                                                        */
/* -------------------------------------------------------------------------- */

function extractStructuredRowsFromRawText(
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  if (rows.length !== 1) return rows;

  const content = rows[0]?.content;
  if (typeof content !== 'string' || content.trim() === '') return rows;

  const recordPattern =
    /([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})\s+(.+?)\s+([\d,]+(?:\.\d+)?)\s+(?:dollars?|USD|\$)\s+([\d,]+(?:\.\d+)?)\s+orders?\b/gi;

  const matches = Array.from(content.matchAll(recordPattern));
  if (matches.length < 2) return rows;

  const extracted: Record<string, unknown>[] = [];

  for (const match of matches) {
    const month = match[1];
    const day = Number(match[2]);
    const year = Number(match[3]);
    const categoryText = match[4].trim();
    const revenue = Number(match[5].replace(/,/g, ''));
    const orders = Number(match[6].replace(/,/g, ''));

    if (!Number.isFinite(day) || !Number.isFinite(year)) continue;
    if (!Number.isFinite(revenue) || !Number.isFinite(orders)) continue;

    const categoryParts = categoryText.split(/\s+/).filter(Boolean);
    if (categoryParts.length < 2) continue;

    const region = categoryParts[0];
    const product = categoryParts.slice(1).join(' ');
    const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;

    if (!Number.isFinite(monthNumber)) continue;

    extracted.push({
      date: `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      month,
      year,
      region,
      product,
      revenue,
      orders,
    });
  }

  return extracted.length >= 2 ? extracted : rows;
}

function getChartableRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return extractStructuredRowsFromRawText(rows);
}

function getAutomaticChartSpecs(
  rows: Record<string, unknown>[],
): AnalysisChartSpec[] {
  const chartRows = getChartableRows(rows);
  if (chartRows.length < 2) return [];

  const columns = Object.keys(chartRows[0] ?? {});
  const hasMonth = columns.includes('month');
  const hasRevenue = columns.includes('revenue');
  const hasRegion = columns.includes('region');

  if (!hasMonth || !hasRevenue) return [];

  const specs: AnalysisChartSpec[] = [
    {
      type: 'line',
      title: 'Monthly Revenue Trend',
      description: 'Revenue movement across the available months.',
      dimensions: ['month'],
      measures: ['revenue'],
      reason: 'A time-series view makes the monthly revenue trend easier to understand.',
    },
  ];

  if (hasRegion) {
    specs.push({
      type: 'bar',
      title: 'Revenue by Region',
      description: 'Total revenue comparison between regions.',
      dimensions: ['region'],
      measures: ['revenue'],
      reason: 'A regional comparison highlights differences in revenue performance.',
    });
  }

  return specs;
}

function chartSpecIsUsable(
  chart: AnalysisChartSpec,
  rows: Record<string, unknown>[],
): boolean {
  if (!chart.dimensions.length || !chart.measures.length) return false;

  const dimensions = chart.dimensions
    .map((dimension) => resolveColumnName(rows, dimension))
    .filter((dimension): dimension is string => dimension !== null);

  const measures = chart.measures
    .map((measure) => resolveColumnName(rows, measure))
    .filter((measure): measure is string => measure !== null);

  return dimensions.length > 0 && measures.length > 0;
}

function getEffectiveCharts(
  charts: AnalysisChartSpec[],
  rows: Record<string, unknown>[],
): AnalysisChartSpec[] {
  const chartRows = getChartableRows(rows);

  const usableModelCharts = charts.filter((chart) =>
    chartSpecIsUsable(chart, chartRows),
  );

  if (usableModelCharts.length > 0) {
    if (charts.length !== usableModelCharts.length) {
      charts.splice(0, charts.length, ...usableModelCharts);
    }
    return usableModelCharts;
  }

  const automaticCharts = getAutomaticChartSpecs(rows);

  if (automaticCharts.length > 0) {
    charts.splice(0, charts.length, ...automaticCharts);
  }

  return automaticCharts;
}

function buildChartRows(
  rows: Record<string, unknown>[],
  dimensions: string[],
  measures: string[],
): ChartDataPoint[] {
  const resolvedDimensions = dimensions
    .map((dimension) => resolveColumnName(rows, dimension))
    .filter((dimension): dimension is string => dimension !== null);

  const resolvedMeasures = measures
    .map((measure) => resolveColumnName(rows, measure))
    .filter((measure): measure is string => measure !== null);

  const fields = [...new Set([...resolvedDimensions, ...resolvedMeasures])];
  if (fields.length === 0 || rows.length === 0) return [];

  return rows.map((row) => {
    const point: ChartDataPoint = {};
    fields.forEach((field) => {
      point[field] = coerceNumericValue(row[field]);
    });
    return point;
  });
}

export function getDatasetRows(
  profile?:
    | {
        sampleRows?: Record<string, unknown>[];
        preview?: Record<string, unknown>[];
      }
    | null,
): Record<string, unknown>[] {
  if (!profile) return [];

  if (Array.isArray(profile.sampleRows) && profile.sampleRows.length > 0) {
    return profile.sampleRows;
  }

  if (Array.isArray(profile.preview) && profile.preview.length > 0) {
    return profile.preview;
  }

  return [];
}

export function buildChartDataFromAnalysis(
  charts: AnalysisChartSpec[],
  rows: Record<string, unknown>[],
): ChartDataBundle[] {
  if (!rows.length) return [];

  const effectiveCharts = getEffectiveCharts(charts, rows);
  const chartRows = getChartableRows(rows);
  if (!effectiveCharts.length || !chartRows.length) return [];

  return effectiveCharts
    .map((chart, index) => {
      const data = buildChartRows(chartRows, chart.dimensions, chart.measures);
      if (data.length === 0) return null;

      const resolvedDimensions = chart.dimensions
        .map((dimension) => resolveColumnName(chartRows, dimension))
        .filter((dimension): dimension is string => dimension !== null);

      const resolvedMeasures = chart.measures
        .map((measure) => resolveColumnName(chartRows, measure))
        .filter((measure): measure is string => measure !== null);

      if (resolvedDimensions.length === 0 || resolvedMeasures.length === 0) {
        return null;
      }

      const config: ChartConfig = {
        id: `analysis-chart-${index}-${Date.now()}`,
        type: mapAnalysisChartType(chart.type),
        title: chart.title,
        description: chart.description ?? chart.reason,
        dimensions: resolvedDimensions,
        measures: resolvedMeasures,
        aggregation: 'sum',
        sortOrder: 'asc',
        showLegend: true,
        animate: true,
      };

      return { config, data };
    })
    .filter((chart): chart is ChartDataBundle => chart !== null);
}

function formatRecommendationsSection(
  recommendations: AnalysisRecommendation[],
): string {
  return recommendations
    .map((item) => {
      const priority = item.priority.toUpperCase();
      return `- **${item.title}** (${priority}): ${item.description}`;
    })
    .join('\n');
}

function formatLimitationsSection(limitations: string[]): string {
  return limitations.map((limitation) => `- ${limitation}`).join('\n');
}

export function buildReportSections(input: BuildReportInput): ReportSection[] {
  // buildChartDataFromAnalysis resolves/mutates the chart list first in the
  // home client. When rows are not supplied here, preserve that effective
  // list instead of validating it against an empty dataset and clearing it.
  const effectiveCharts = input.rows
    ? getEffectiveCharts(input.charts, input.rows)
    : input.charts;

  const sections: ReportSection[] = input.sections.map((section) => ({
    title: section.title,
    content: section.content.trim(),
  }));

  if (effectiveCharts.length > 0) {
    const visualizationContent = effectiveCharts
      .map((chart, index) => {
        const description = chart.description?.trim() || chart.reason.trim();
        return `${description}\n\n[CHART:${index}]`;
      })
      .join('\n\n');

    sections.push({
      title: 'Key Visualizations',
      content: visualizationContent,
    });
  }

  if (input.recommendations && input.recommendations.length > 0) {
    sections.push({
      title: 'Recommendations',
      content: formatRecommendationsSection(input.recommendations),
    });
  }

  if (input.limitations && input.limitations.length > 0) {
    sections.push({
      title: 'Limitations',
      content: formatLimitationsSection(input.limitations),
    });
  }

  return sections;
}
