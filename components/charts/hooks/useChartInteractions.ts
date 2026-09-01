import { useState, useCallback } from 'react';
import { ChartDataPoint } from '@/components/charts/types/chart.types';

export function useChartInteractions() {
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  const handleClick = useCallback((point: ChartDataPoint) => {
    setSelectedPoint(point);
  }, []);

  const handleHover = useCallback((point: ChartDataPoint | null) => {
    setHoveredPoint(point);
  }, []);

  const handleLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  return {
    selectedPoint,
    hoveredPoint,
    handleClick,
    handleHover,
    handleLeave,
  };
}