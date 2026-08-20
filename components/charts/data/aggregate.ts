import { ChartDataPoint, AggregationType } from '@/components/charts/types/chart.types';

export function aggregateData(
  data: ChartDataPoint[],
  measure: string,
  aggregation: AggregationType
): number {
  const values = data.map((row) => Number(row[measure]) || 0).filter((v) => !isNaN(v));

  if (values.length === 0) return 0;

  switch (aggregation) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'average':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'median': {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'count':
      return values.length;
    case 'distinctCount':
      return new Set(values).size;
    case 'sum':
    default:
      return values.reduce((a, b) => a + b, 0);
  }
}