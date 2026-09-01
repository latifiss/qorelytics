export type ChartType =
  | 'bar'
  | 'horizontalBar'
  | 'groupedBar'
  | 'stackedBar'
  | 'hundredStackedBar'
  | 'divergingBar'
  | 'lollipop'
  | 'dotPlot'
  | 'pareto'
  | 'line'
  | 'multiLine'
  | 'stepLine'
  | 'cumulativeLine'
  | 'forecastLine'
  | 'area'
  | 'multiArea'
  | 'stackedArea'
  | 'hundredStackedArea'
  | 'stepArea'
  | 'splineArea'
  | 'pie'
  | 'donut'
  | 'donutWithKpi'
  | 'nestedDonut'
  | 'treemap'
  | 'sunburst'
  | 'marimekko'
  | 'scatter'
  | 'multiSeriesScatter'
  | 'bubble'
  | 'scatterWithTrendline'
  | 'scatterWithOutliers'
  | 'heatmap'
  | 'correlationHeatmap'
  | 'parallelCoordinates'
  | 'histogram'
  | 'boxPlot'
  | 'violinPlot'
  | 'stripPlot'
  | 'beeswarm'
  | 'density'
  | 'ecdf'
  | 'range'
  | 'errorBar'
  | 'confidenceBand'
  | 'kpiCard'
  | 'kpiWithTrend'
  | 'kpiWithSparkline'
  | 'radialProgress'
  | 'radialBar'
  | 'gauge'
  | 'semiCircleGauge'
  | 'bullet'
  | 'progressBar'
  | 'actualVsTarget'
  | 'actualVsForecast'
  | 'variance'
  | 'funnel'
  | 'funnelWithConversion'
  | 'pyramid'
  | 'waterfall'
  | 'sankey'
  | 'chord'
  | 'pointMap'
  | 'bubbleMap'
  | 'choropleth'
  | 'geographicHeatmap'
  | 'regionComparison'
  | 'calendarHeatmap'
  | 'timeCategoryHeatmap'
  | 'timeline'
  | 'gantt'
  | 'candlestick'
  | 'ohlc'
  | 'controlChart'
  | 'smallMultiples'
  | 'sparkline'
  | 'rankingWithBars'
  | 'comparisonCard'
  | 'chartWithInsight'
  | 'multiChartDashboard'
  | 'radar'
  | 'polarArea'
  | 'waffle'
  | 'wordCloud'
  | 'progressRing'
  | 'trendArrows'
  | 'highLowRange'
  | 'speedometer'
  | 'multiSegmentDial'
  | 'needleGauge'
  | 'fanChart';

export type PropertyType =
  | 'string'
  | 'number'
  | 'integer'
  | 'decimal'
  | 'percentage'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'category'
  | 'enum'
  | 'id'
  | 'url'
  | 'email'
  | 'geographic'
  | 'latitude'
  | 'longitude'
  | 'duration'
  | 'rating'
  | 'null'
  | 'array'
  | 'json';

export type AggregationType =
  | 'sum'
  | 'average'
  | 'median'
  | 'min'
  | 'max'
  | 'count'
  | 'distinctCount'
  | 'countNull'
  | 'percentage'
  | 'percentageChange'
  | 'difference'
  | 'variance'
  | 'standardDeviation'
  | 'runningTotal'
  | 'movingAverage'
  | 'weightedAverage'
  | 'percentile'
  | 'quartile';

export type DisplayMode = 'absolute' | 'percentage' | 'normalized' | 'cumulative' | 'change' | 'variance';

export type SortOrder = 'asc' | 'desc';

export interface ChartFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'contains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty';
  value: string | number | boolean | null;
  value2?: string | number;
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title?: string;
  description?: string;
  dimensions: string[];
  measures: string[];
  aggregation: AggregationType;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  topN?: number;
  displayMode?: DisplayMode;
  filters?: ChartFilter[];
  visibleSeries?: string[];
  visibleCategories?: string[];
  colors?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export interface ChartDataPoint {
  [key: string]: string | number | boolean | null;
}

export interface ChartProps {
  config: ChartConfig;
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  className?: string;
  onDataPointClick?: (point: ChartDataPoint) => void;
  onSeriesToggle?: (series: string, visible: boolean) => void;
  onFilterChange?: (filters: ChartFilter[]) => void;
  onConfigChange?: (config: ChartConfig) => void;
}

export interface ChartState {
  config: ChartConfig;
  data: ChartDataPoint[];
  filteredData: ChartDataPoint[];
  transformedData: ChartDataPoint[];
  selectedPoint: ChartDataPoint | null;
  hoveredPoint: ChartDataPoint | null;
  visibleSeries: string[];
  visibleCategories: string[];
  isZoomed: boolean;
  zoomRange?: { start: number; end: number };
}

export interface ChartLegendItem {
  key: string;
  label: string;
  color: string;
  visible: boolean;
}

export interface ChartSeries {
  name: string;
  data: Array<{ name: string; value: number }>;
  color?: string;
}

export interface ChartRecommendation {
  primary: ChartType;
  alternatives: ChartType[];
  confidence: number;
  reason: string;
  config: Partial<ChartConfig>;
}

export interface DataSchema {
  fields: Field[];
  dimensions: string[];
  measures: string[];
  timeFields: string[];
  geographicFields: string[];
  rowCount: number;
  columnCount: number;
  hasTimeSeries: boolean;
  hasNumericData: boolean;
  hasCategoricalData: boolean;
}

export interface Field {
  name: string;
  type: PropertyType;
  sample: any;
  uniqueCount: number;
  nullCount: number;
  min?: number;
  max?: number;
  mean?: number;
}

export interface DetectionResult {
  schema: DataSchema;
  recommendations: ChartRecommendation[];
  primaryConfig: ChartConfig;
  alternativeConfigs: ChartConfig[];
}

export interface ChartEngineProps {
  data: ChartDataPoint[];
  config?: Partial<ChartConfig>;
  height?: number;
  className?: string;
  autoDetect?: boolean;
  onDataPointClick?: (point: ChartDataPoint) => void;
  onConfigChange?: (config: ChartConfig) => void;
  onRecommendation?: (recommendation: ChartRecommendation) => void;
}