import { useState, useMemo } from 'react';
import { ChartDataPoint, ChartConfig } from '@/components/charts/types/chart.types';
import { transformData } from '@/components/charts/data/transform';

export function useChartData(data: ChartDataPoint[], config: ChartConfig) {
  const [filteredData, setFilteredData] = useState<ChartDataPoint[]>(data);

  const transformedData = useMemo(() => {
    return transformData(filteredData, config);
  }, [filteredData, config]);

  return {
    data: transformedData,
    setFilteredData,
  };
}