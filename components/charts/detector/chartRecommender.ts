import { ChartDataPoint, ChartRecommendation, DataSchema, ChartType, ChartConfig } from '@/components/charts/types/chart.types';

export class ChartRecommender {
  recommend(data: ChartDataPoint[], schema: DataSchema): ChartRecommendation[] {
    const recommendations: ChartRecommendation[] = [];
    const { dimensions, measures, timeFields, hasTimeSeries } = schema;
    const dimCount = dimensions.length;
    const measureCount = measures.length;

    // No data or insufficient data
    if (dimCount === 0 || measureCount === 0) {
      return [];
    }

    // Single dimension + single measure
    if (dimCount === 1 && measureCount === 1) {
      const dim = dimensions[0];
      const measure = measures[0];
      const uniqueValues = this.getUniqueCount(data, dim);

      // If time series → Line chart
      if (hasTimeSeries) {
        recommendations.push({
          primary: 'line',
          alternatives: ['area', 'bar', 'stepLine'],
          confidence: 90,
          reason: 'Time-series data is best visualized as a line chart to show trends over time.',
          config: { dimensions: [dim], measures: [measure] }
        });
      }
      // If few unique values → Pie chart
      else if (uniqueValues <= 10) {
        recommendations.push({
          primary: 'pie',
          alternatives: ['donut', 'bar', 'horizontalBar'],
          confidence: 80,
          reason: 'Limited categories make this data suitable for a pie chart showing composition.',
          config: { dimensions: [dim], measures: [measure] }
        });
      }
      // Default → Bar chart
      else {
        recommendations.push({
          primary: 'bar',
          alternatives: ['horizontalBar', 'pie', 'donut'],
          confidence: 85,
          reason: 'Bar charts are ideal for comparing values across different categories.',
          config: { dimensions: [dim], measures: [measure] }
        });
      }
    }

    // Single dimension + multiple measures
    else if (dimCount === 1 && measureCount > 1) {
      const dim = dimensions[0];
      const sortedMeasures = measures.slice(0, 5); // Limit to 5 measures

      // Time series → Multi-Line
      if (hasTimeSeries) {
        recommendations.push({
          primary: 'multiLine',
          alternatives: ['stackedArea', 'groupedBar', 'area'],
          confidence: 92,
          reason: 'Multiple measures over time are best shown with multi-line charts for comparison.',
          config: { dimensions: [dim], measures: sortedMeasures }
        });
      }
      // Default → Grouped Bar
      else {
        recommendations.push({
          primary: 'groupedBar',
          alternatives: ['stackedBar', 'multiLine', 'bar'],
          confidence: 88,
          reason: 'Grouped bar charts allow easy comparison of multiple measures across categories.',
          config: { dimensions: [dim], measures: sortedMeasures }
        });
      }
    }

    // Multiple dimensions + single measure
    else if (dimCount > 1 && measureCount === 1) {
      const primaryDim = dimensions[0];
      const secondaryDim = dimensions[1];
      const measure = measures[0];

      recommendations.push({
        primary: 'groupedBar',
        alternatives: ['stackedBar', 'bar', 'heatmap'],
        confidence: 85,
        reason: 'Multiple dimensions require grouped or stacked charts to show relationships.',
        config: { dimensions: [primaryDim, secondaryDim], measures: [measure] }
      });
    }

    // Multiple dimensions + multiple measures
    else if (dimCount > 1 && measureCount > 1) {
      const primaryDim = dimensions[0];
      const sortedMeasures = measures.slice(0, 3);

      recommendations.push({
        primary: 'groupedBar',
        alternatives: ['stackedBar', 'multiLine', 'bar'],
        confidence: 82,
        reason: 'Complex data with multiple dimensions and measures is best explored with grouped charts.',
        config: { dimensions: [primaryDim], measures: sortedMeasures }
      });
    }

    // Sort by confidence and return
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private getUniqueCount(data: ChartDataPoint[], field: string): number {
    const values = new Set(data.map((row) => String(row[field] || 'Unknown')));
    return values.size;
  }
}