import { ChartDataPoint } from '@/components/charts/types/chart.types';

export function groupData(
  data: ChartDataPoint[],
  groupBy: string,
  measure: string,
  aggregation: string
): ChartDataPoint[] {
  const groups: Record<string, { sum: number; count: number; values: number[]; min: number; max: number }> = {};

  data.forEach((row) => {
    const key = String(row[groupBy] ?? 'Unknown');
    const value = Number(row[measure]) || 0;

    if (!groups[key]) {
      groups[key] = { sum: 0, count: 0, values: [], min: Infinity, max: -Infinity };
    }

    groups[key].sum += value;
    groups[key].count += 1;
    groups[key].values.push(value);
    groups[key].min = Math.min(groups[key].min, value);
    groups[key].max = Math.max(groups[key].max, value);
  });

  return Object.entries(groups).map(([key, group]) => {
    let value = 0;
    switch (aggregation) {
      case 'sum':
        value = group.sum;
        break;
      case 'average':
        value = group.sum / group.count;
        break;
      case 'count':
        value = group.count;
        break;
      case 'min':
        value = group.min;
        break;
      case 'max':
        value = group.max;
        break;
      case 'median': {
        const sorted = [...group.values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        value = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
        break;
      }
      default:
        value = group.sum;
    }
    return { [groupBy]: key, value } as ChartDataPoint;
  });
}