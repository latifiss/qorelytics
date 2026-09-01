import { ChartDataPoint, ChartConfig, ChartRecommendation, DataSchema } from '@/components/charts/types/chart.types';

export class ConfigGenerator {
  generate(data: ChartDataPoint[], schema: DataSchema, recommendation: ChartRecommendation): ChartConfig {
    const config: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: recommendation.primary,
      title: this.generateTitle(schema, recommendation),
      description: recommendation.reason,
      dimensions: recommendation.config.dimensions || [],
      measures: recommendation.config.measures || [],
      aggregation: 'sum',
      sortOrder: 'asc',
      showLegend: true,
      animate: true,
    };

    // Auto-select dimension if not provided
    if (config.dimensions.length === 0 && schema.dimensions.length > 0) {
      config.dimensions = [schema.dimensions[0]];
    }

    // Auto-select measure if not provided
    if (config.measures.length === 0 && schema.measures.length > 0) {
      config.measures = [schema.measures[0]];
    }

    // Auto-select group by for time-series
    if (schema.hasTimeSeries && config.dimensions.length > 0) {
      const timeField = schema.timeFields[0];
      if (timeField && config.dimensions.includes(timeField)) {
        config.groupBy = 'month'; // or auto-detect best grouping
      }
    }

    return config;
  }

  private generateTitle(schema: DataSchema, recommendation: ChartRecommendation): string {
    const dim = schema.dimensions[0] || 'Data';
    const measures = schema.measures.slice(0, 2);
    const measureStr = measures.length === 1 
      ? measures[0] 
      : `${measures[0]} & ${measures[1]}`;
    
    return `${measureStr} by ${dim}`;
  }
}