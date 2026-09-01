import { useState } from 'react';
import { ChartConfig, ChartFilter, ChartDataPoint } from '@/components/charts/types/chart.types';

export function useChartControls(initialConfig: ChartConfig) {
  const [config, setConfig] = useState<ChartConfig>(initialConfig);
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  const updateConfig = (updates: Partial<ChartConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const toggleSeries = (series: string) => {
    const current = config.visibleSeries || [];
    const index = current.indexOf(series);
    const updated = index >= 0 ? current.filter((s) => s !== series) : [...current, series];
    updateConfig({ visibleSeries: updated });
  };

  const toggleCategory = (category: string) => {
    const current = config.visibleCategories || [];
    const index = current.indexOf(category);
    const updated = index >= 0 ? current.filter((c) => c !== category) : [...current, category];
    updateConfig({ visibleCategories: updated });
  };

  const addFilter = (filter: ChartFilter) => {
    const filters = [...(config.filters || []), filter];
    updateConfig({ filters });
  };

  const removeFilter = (index: number) => {
    const filters = (config.filters || []).filter((_, i) => i !== index);
    updateConfig({ filters });
  };

  const clearFilters = () => {
    updateConfig({ filters: [] });
  };

  return {
    config,
    setConfig: updateConfig,
    selectedPoint,
    setSelectedPoint,
    hoveredPoint,
    setHoveredPoint,
    toggleSeries,
    toggleCategory,
    addFilter,
    removeFilter,
    clearFilters,
  };
}