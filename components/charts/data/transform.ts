import { ChartDataPoint, ChartConfig, DisplayMode } from '@/components/charts/types/chart.types';
import { filterData } from './filter';
import { groupData } from './group';
import { aggregateData } from './aggregate';

export function transformData(
  data: ChartDataPoint[],
  config: ChartConfig
): ChartDataPoint[] {
  const specialChartTypes = [
    'sankey',
    'gauge',
    'semiCircleGauge',
    'treemap',
    'sparkline',
    'radar',
    'scatter',
    'multiSeriesScatter',
    'bubble',
    'scatterWithTrendline',
    'scatterWithOutliers',
    'boxPlot',
    'violinPlot',
    'heatmap',
    'correlationHeatmap',
    'calendarHeatmap',
    'timeCategoryHeatmap',
    'wordCloud',
    'waffle',
    'chord',
    'parallelCoordinates',
    'sunburst',
    'marimekko',
    'pointMap',
    'bubbleMap',
    'choropleth',
    'geographicHeatmap',
    'regionComparison',
    'timeline',
    'gantt',
    'candlestick',
    'ohlc',
    'controlChart',
    'smallMultiples',
    'rankingWithBars',
    'comparisonCard',
    'chartWithInsight',
    'multiChartDashboard',
    'polarArea',
    'progressRing',
    'trendArrows',
    'highLowRange',
    'speedometer',
    'multiSegmentDial',
    'needleGauge',
    'fanChart',
    'kpiCard',
    'kpiWithTrend',
    'kpiWithSparkline',
    'radialProgress',
    'radialBar',
    'bullet',
    'progressBar',
    'actualVsTarget',
    'actualVsForecast',
    'variance'
  ];

  if (specialChartTypes.includes(config.type)) {
    return data;
  }

  let result = [...data];

  if (config.filters && config.filters.length > 0) {
    result = filterData(result, config.filters);
  }

  if (config.groupBy && config.measures.length > 0) {
    const grouped = groupData(
      result,
      config.groupBy,
      config.measures[0],
      config.aggregation
    );
    result = grouped;
  }

  if (config.sortBy) {
    result.sort((a, b) => {
      const aVal = Number(a[config.sortBy!]) || 0;
      const bVal = Number(b[config.sortBy!]) || 0;
      return config.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }

  if (config.topN && config.topN > 0 && config.topN < result.length) {
    result = result.slice(0, config.topN);
  }

  if (config.displayMode && config.displayMode !== 'absolute') {
    result = applyDisplayMode(result, config.displayMode, config.measures[0]);
  }

  return result;
}

function applyDisplayMode(
  data: ChartDataPoint[],
  mode: DisplayMode,
  measure: string
): ChartDataPoint[] {
  const total = data.reduce((sum, row) => sum + (Number(row[measure]) || 0), 0);

  switch (mode) {
    case 'percentage':
      return data.map((row) => ({
        ...row,
        [measure]: total > 0 ? ((Number(row[measure]) || 0) / total) * 100 : 0,
      }));
    case 'cumulative': {
      let cumSum = 0;
      return data.map((row) => {
        cumSum += Number(row[measure]) || 0;
        return { ...row, [measure]: cumSum };
      });
    }
    case 'normalized': {
      const max = Math.max(...data.map((row) => Number(row[measure]) || 0));
      return data.map((row) => ({
        ...row,
        [measure]: max > 0 ? ((Number(row[measure]) || 0) / max) * 100 : 0,
      }));
    }
    default:
      return data;
  }
}