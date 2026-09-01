import { ChartFilter, ChartDataPoint } from '@/components/charts/types/chart.types';

export function filterData(data: ChartDataPoint[], filters: ChartFilter[]): ChartDataPoint[] {
  if (!filters || filters.length === 0) return data;

  return data.filter((row) => {
    return filters.every((filter) => {
      const value = row[filter.field];
      if (value === undefined || value === null) {
        return filter.operator === 'isEmpty';
      }

      switch (filter.operator) {
        case 'eq':
          return value === filter.value;
        case 'neq':
          return value !== filter.value;
        case 'gt':
          return Number(value) > Number(filter.value);
        case 'gte':
          return Number(value) >= Number(filter.value);
        case 'lt':
          return Number(value) < Number(filter.value);
        case 'lte':
          return Number(value) <= Number(filter.value);
        case 'between':
          return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2);
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
        case 'isEmpty':
          return value === null || value === undefined || value === '';
        case 'isNotEmpty':
          return value !== null && value !== undefined && value !== '';
        default:
          return true;
      }
    });
  });
}