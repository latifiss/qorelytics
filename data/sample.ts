// data/samples.ts

import { ChartDataPoint } from '@/components/charts/types/chart.types';

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  data: ChartDataPoint[];
  config: {
    dimensions: string[];
    measures: string[];
    recommendedChart: string;
    availableCharts: string[];
  };
}

// ============================================
// 1. TIME SERIES - Monthly Sales Data
// ============================================
export const timeSeriesData: ChartDataPoint[] = [
  { month: 'Jan 2024', revenue: 125000, orders: 4200, profit: 25000, customers: 3400 },
  { month: 'Feb 2024', revenue: 132000, orders: 4450, profit: 26400, customers: 3550 },
  { month: 'Mar 2024', revenue: 148000, orders: 4800, profit: 29600, customers: 3800 },
  { month: 'Apr 2024', revenue: 162000, orders: 5100, profit: 32400, customers: 4100 },
  { month: 'May 2024', revenue: 185000, orders: 5600, profit: 37000, customers: 4500 },
  { month: 'Jun 2024', revenue: 210000, orders: 6200, profit: 42000, customers: 5000 },
  { month: 'Jul 2024', revenue: 198000, orders: 5900, profit: 39600, customers: 4800 },
  { month: 'Aug 2024', revenue: 225000, orders: 6500, profit: 45000, customers: 5300 },
  { month: 'Sep 2024', revenue: 240000, orders: 6800, profit: 48000, customers: 5600 },
  { month: 'Oct 2024', revenue: 255000, orders: 7200, profit: 51000, customers: 5900 },
  { month: 'Nov 2024', revenue: 280000, orders: 7800, profit: 56000, customers: 6400 },
  { month: 'Dec 2024', revenue: 320000, orders: 8500, profit: 64000, customers: 7200 },
];

// ============================================
// 2. CATEGORICAL - Product Sales by Category
// ============================================
export const categoricalData: ChartDataPoint[] = [
  { category: 'Electronics', revenue: 450000, units: 3400, profit: 90000 },
  { category: 'Clothing', revenue: 320000, units: 7800, profit: 64000 },
  { category: 'Books', revenue: 180000, units: 9200, profit: 36000 },
  { category: 'Home & Garden', revenue: 280000, units: 4200, profit: 56000 },
  { category: 'Sports', revenue: 210000, units: 5600, profit: 42000 },
  { category: 'Toys', revenue: 160000, units: 8900, profit: 32000 },
  { category: 'Automotive', revenue: 190000, units: 3100, profit: 38000 },
  { category: 'Health', revenue: 150000, units: 6700, profit: 30000 },
];

// ============================================
// 3. GEOGRAPHIC - Sales by Region
// ============================================
export const geographicData: ChartDataPoint[] = [
  { region: 'North America', revenue: 850000, customers: 45000, growth: 12.5 },
  { region: 'Europe', revenue: 620000, customers: 32000, growth: 8.3 },
  { region: 'Asia Pacific', revenue: 480000, customers: 28000, growth: 18.7 },
  { region: 'Latin America', revenue: 210000, customers: 15000, growth: 22.1 },
  { region: 'Middle East', revenue: 180000, customers: 12000, growth: 15.4 },
  { region: 'Africa', revenue: 95000, customers: 8000, growth: 25.6 },
];

// ============================================
// 4. HIERARCHICAL - Department Performance
// ============================================
export const hierarchicalData: ChartDataPoint[] = [
  { department: 'Sales', revenue: 520000, employees: 45, expenses: 210000 },
  { department: 'Marketing', revenue: 320000, employees: 28, expenses: 180000 },
  { department: 'Engineering', revenue: 180000, employees: 52, expenses: 420000 },
  { department: 'Support', revenue: 120000, employees: 35, expenses: 140000 },
  { department: 'HR', revenue: 45000, employees: 18, expenses: 95000 },
  { department: 'Finance', revenue: 38000, employees: 12, expenses: 85000 },
];

// ============================================
// 5. COMPARISON - Product Performance
// ============================================
export const comparisonData: ChartDataPoint[] = [
  { product: 'Product A', q1: 120, q2: 145, q3: 168, q4: 192 },
  { product: 'Product B', q1: 98, q2: 112, q3: 134, q4: 156 },
  { product: 'Product C', q1: 76, q2: 88, q3: 95, q4: 110 },
  { product: 'Product D', q1: 45, q2: 52, q3: 61, q4: 78 },
  { product: 'Product E', q1: 32, q2: 38, q3: 44, q4: 51 },
];

// ============================================
// 6. DISTRIBUTION - Employee Salary Ranges
// ============================================
export const distributionData: ChartDataPoint[] = [
  { range: '0-30k', count: 45, average: 22000 },
  { range: '30-50k', count: 68, average: 42000 },
  { range: '50-70k', count: 52, average: 61000 },
  { range: '70-90k', count: 38, average: 82000 },
  { range: '90-110k', count: 22, average: 102000 },
  { range: '110-130k', count: 12, average: 121000 },
  { range: '130-150k', count: 5, average: 142000 },
];

// ============================================
// 7. PART TO WHOLE - Budget Allocation
// ============================================
export const partToWholeData: ChartDataPoint[] = [
  { category: 'Operations', amount: 450000 },
  { category: 'Marketing', amount: 280000 },
  { category: 'R&D', amount: 320000 },
  { category: 'Sales', amount: 180000 },
  { category: 'Support', amount: 120000 },
  { category: 'Administration', amount: 95000 },
  { category: 'IT', amount: 150000 },
];

// ============================================
// 8. CORRELATION - Marketing vs Sales
// ============================================
export const correlationData: ChartDataPoint[] = [
  { adSpend: 10000, sales: 125000, leads: 450 },
  { adSpend: 15000, sales: 168000, leads: 580 },
  { adSpend: 20000, sales: 195000, leads: 720 },
  { adSpend: 25000, sales: 220000, leads: 850 },
  { adSpend: 30000, sales: 258000, leads: 980 },
  { adSpend: 35000, sales: 290000, leads: 1100 },
  { adSpend: 40000, sales: 315000, leads: 1250 },
  { adSpend: 45000, sales: 340000, leads: 1380 },
  { adSpend: 50000, sales: 365000, leads: 1500 },
];

// ============================================
// 9. YEAR OVER YEAR - Multi-Year Data
// ============================================
export const yearOverYearData: ChartDataPoint[] = [
  { year: '2020', q1: 85000, q2: 92000, q3: 98000, q4: 105000 },
  { year: '2021', q1: 112000, q2: 125000, q3: 138000, q4: 152000 },
  { year: '2022', q1: 165000, q2: 178000, q3: 192000, q4: 210000 },
  { year: '2023', q1: 225000, q2: 240000, q3: 258000, q4: 275000 },
  { year: '2024', q1: 290000, q2: 310000, q3: 335000, q4: 360000 },
];

// ============================================
// 10. CUSTOMER SEGMENTS
// ============================================
export const customerSegmentsData: ChartDataPoint[] = [
  { segment: 'Enterprise', revenue: 620000, customers: 120, avgSpend: 5166 },
  { segment: 'Mid-Market', revenue: 380000, customers: 380, avgSpend: 1000 },
  { segment: 'SMB', revenue: 210000, customers: 1200, avgSpend: 175 },
  { segment: 'Startups', revenue: 145000, customers: 850, avgSpend: 170 },
  { segment: 'Individual', revenue: 85000, customers: 2500, avgSpend: 34 },
];

// ============================================
// 11. BOX PLOT - Test Score Distribution
// ============================================
export const boxPlotData: ChartDataPoint[] = [
  { subject: 'Math', min: 55, q1: 72, median: 82, q3: 90, max: 98 },
  { subject: 'Science', min: 48, q1: 65, median: 76, q3: 85, max: 95 },
  { subject: 'English', min: 50, q1: 68, median: 78, q3: 88, max: 97 },
  { subject: 'History', min: 42, q1: 60, median: 72, q3: 82, max: 92 },
  { subject: 'Art', min: 60, q1: 75, median: 85, q3: 92, max: 99 },
  { subject: 'Music', min: 45, q1: 62, median: 74, q3: 84, max: 94 },
];

// ============================================
// 12. FUNNEL - Sales Pipeline
// ============================================
export const funnelData: ChartDataPoint[] = [
  { stage: 'Awareness', count: 10000, conversionRate: 100 },
  { stage: 'Interest', count: 6500, conversionRate: 65 },
  { stage: 'Consideration', count: 3800, conversionRate: 38 },
  { stage: 'Intent', count: 2100, conversionRate: 21 },
  { stage: 'Evaluation', count: 1200, conversionRate: 12 },
  { stage: 'Purchase', count: 680, conversionRate: 6.8 },
];

// ============================================
// 13. WATERFALL - Financial Bridge
// ============================================
export const waterfallData: ChartDataPoint[] = [
  { category: 'Starting Revenue', value: 1000000 },
  { category: 'New Customers', value: 250000 },
  { category: 'Upsells', value: 150000 },
  { category: 'Cross-sells', value: 80000 },
  { category: 'Churn', value: -120000 },
  { category: 'Downgrades', value: -60000 },
  { category: 'Refunds', value: -30000 },
  { category: 'Ending Revenue', value: 1270000 },
];

// ============================================
// 14. RADAR - Product Comparison
// ============================================
export const radarData: ChartDataPoint[] = [
  { feature: 'Performance', productA: 90, productB: 75, productC: 85 },
  { feature: 'Price', productA: 70, productB: 90, productC: 60 },
  { feature: 'Features', productA: 85, productB: 70, productC: 95 },
  { feature: 'Support', productA: 80, productB: 85, productC: 75 },
  { feature: 'Ease of Use', productA: 95, productB: 65, productC: 80 },
  { feature: 'Security', productA: 88, productB: 92, productC: 78 },
];

// ============================================
// 15. TREEMAP - File Storage Usage
// ============================================
export const treemapData: ChartDataPoint[] = [
  { name: 'Documents', value: 450 },
  { name: 'Images', value: 320 },
  { name: 'Videos', value: 280 },
  { name: 'Audio', value: 150 },
  { name: 'Archives', value: 120 },
  { name: 'Code', value: 95 },
  { name: 'Designs', value: 75 },
  { name: 'Reports', value: 65 },
  { name: 'Presentations', value: 55 },
  { name: 'Other', value: 40 },
];

// ============================================
// 16. GAUGE - Performance Metrics
// ============================================
export const gaugeData: ChartDataPoint[] = [
  { name: 'Revenue', value: 85 },
  { name: 'Profit', value: 92 },
  { name: 'Growth', value: 78 },
  { name: 'Satisfaction', value: 95 },
  { name: 'Retention', value: 88 },
];

// ============================================
// 17. SANKEY - Customer Journey
// ============================================
export const sankeyData: ChartDataPoint[] = [
  { source: 'Homepage', target: 'Product Page', value: 10000 },
  { source: 'Homepage', target: 'Blog', value: 5000 },
  { source: 'Product Page', target: 'Cart', value: 3000 },
  { source: 'Product Page', target: 'Checkout', value: 1500 },
  { source: 'Blog', target: 'Product Page', value: 2000 },
  { source: 'Cart', target: 'Checkout', value: 2500 },
  { source: 'Checkout', target: 'Purchase', value: 3200 },
  { source: 'Checkout', target: 'Abandoned', value: 800 },
];

// ============================================
// 18. SPARKLINE - Mini Trends
// ============================================
export const sparklineData: ChartDataPoint[] = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 38 },
  { day: 'Thu', value: 61 },
  { day: 'Fri', value: 55 },
  { day: 'Sat', value: 72 },
  { day: 'Sun', value: 68 },
];

// ============================================
// 19. SCATTER - Ad Spend vs Revenue
// ============================================
export const scatterData: ChartDataPoint[] = [
  { x: 1000, y: 25000, size: 50 },
  { x: 2000, y: 42000, size: 60 },
  { x: 3000, y: 58000, size: 70 },
  { x: 4000, y: 61000, size: 80 },
  { x: 5000, y: 78000, size: 90 },
  { x: 6000, y: 85000, size: 100 },
  { x: 7000, y: 92000, size: 110 },
  { x: 8000, y: 105000, size: 120 },
  { x: 9000, y: 115000, size: 130 },
  { x: 10000, y: 128000, size: 140 },
];

// ============================================
// 20. HISTOGRAM - Age Distribution
// ============================================
export const histogramData: ChartDataPoint[] = [
  { range: '18-24', count: 45 },
  { range: '25-34', count: 78 },
  { range: '35-44', count: 62 },
  { range: '45-54', count: 48 },
  { range: '55-64', count: 32 },
  { range: '65+', count: 18 },
];

// ============================================
// 21. HORIZONTAL BAR - Best Sellers
// ============================================
export const horizontalBarData: ChartDataPoint[] = [
  { product: 'Laptop Pro', sales: 4500 },
  { product: 'Smartphone X', sales: 3800 },
  { product: 'Tablet Air', sales: 3200 },
  { product: 'Smartwatch', sales: 2800 },
  { product: 'Headphones', sales: 2500 },
  { product: 'Speaker', sales: 2100 },
  { product: 'Monitor', sales: 1800 },
  { product: 'Keyboard', sales: 1500 },
];

// ============================================
// 22. STACKED BAR - Revenue by Product and Region
// ============================================
export const stackedBarData: ChartDataPoint[] = [
  { region: 'North America', electronics: 250000, clothing: 180000, books: 120000 },
  { region: 'Europe', electronics: 200000, clothing: 150000, books: 100000 },
  { region: 'Asia Pacific', electronics: 180000, clothing: 120000, books: 80000 },
  { region: 'Latin America', electronics: 100000, clothing: 80000, books: 60000 },
  { region: 'Middle East', electronics: 80000, clothing: 60000, books: 40000 },
  { region: 'Africa', electronics: 50000, clothing: 40000, books: 25000 },
];

// ============================================
// 23. GROUPED BAR - Monthly Comparison
// ============================================
export const groupedBarData: ChartDataPoint[] = [
  { month: 'Jan', revenue: 120000, expenses: 80000, profit: 40000 },
  { month: 'Feb', revenue: 135000, expenses: 85000, profit: 50000 },
  { month: 'Mar', revenue: 148000, expenses: 92000, profit: 56000 },
  { month: 'Apr', revenue: 162000, expenses: 98000, profit: 64000 },
  { month: 'May', revenue: 185000, expenses: 105000, profit: 80000 },
  { month: 'Jun', revenue: 210000, expenses: 115000, profit: 95000 },
];

// ============================================
// 24. DONUT - Market Share
// ============================================
export const donutData: ChartDataPoint[] = [
  { name: 'Company A', value: 35 },
  { name: 'Company B', value: 28 },
  { name: 'Company C', value: 20 },
  { name: 'Company D', value: 12 },
  { name: 'Others', value: 5 },
];

// ============================================
// 25. MULTI-LINE - Multiple Metrics
// ============================================
export const multiLineData: ChartDataPoint[] = [
  { month: 'Jan', revenue: 120000, expenses: 80000, profit: 40000 },
  { month: 'Feb', revenue: 135000, expenses: 85000, profit: 50000 },
  { month: 'Mar', revenue: 148000, expenses: 92000, profit: 56000 },
  { month: 'Apr', revenue: 162000, expenses: 98000, profit: 64000 },
  { month: 'May', revenue: 185000, expenses: 105000, profit: 80000 },
  { month: 'Jun', revenue: 210000, expenses: 115000, profit: 95000 },
];

// ============================================
// SAMPLE DATASETS EXPORT
// ============================================
export const sampleDatasets: SampleDataset[] = [
  {
    id: 'time-series',
    name: 'Monthly Sales Data',
    description: 'Time series data showing revenue, orders, profit, and customers over 12 months',
    data: timeSeriesData,
    config: {
      dimensions: ['month'],
      measures: ['revenue', 'orders', 'profit'],
      recommendedChart: 'multiLine',
      availableCharts: ['multiLine', 'area', 'stackedArea', 'bar', 'groupedBar'],
    },
  },
  {
    id: 'categorical',
    name: 'Product Categories',
    description: 'Sales performance across different product categories',
    data: categoricalData,
    config: {
      dimensions: ['category'],
      measures: ['revenue', 'units'],
      recommendedChart: 'bar',
      availableCharts: ['bar', 'horizontalBar', 'pie', 'donut', 'groupedBar'],
    },
  },
  {
    id: 'geographic',
    name: 'Regional Performance',
    description: 'Sales and customer distribution across global regions',
    data: geographicData,
    config: {
      dimensions: ['region'],
      measures: ['revenue', 'customers'],
      recommendedChart: 'bar',
      availableCharts: ['bar', 'horizontalBar', 'pie', 'donut', 'groupedBar'],
    },
  },
  {
    id: 'hierarchical',
    name: 'Department Performance',
    description: 'Revenue, employees, and expenses by department',
    data: hierarchicalData,
    config: {
      dimensions: ['department'],
      measures: ['revenue', 'employees', 'expenses'],
      recommendedChart: 'groupedBar',
      availableCharts: ['groupedBar', 'stackedBar', 'bar', 'multiLine'],
    },
  },
  {
    id: 'comparison',
    name: 'Product Comparison',
    description: 'Product performance across four quarters',
    data: comparisonData,
    config: {
      dimensions: ['product'],
      measures: ['q1', 'q2', 'q3', 'q4'],
      recommendedChart: 'groupedBar',
      availableCharts: ['groupedBar', 'stackedBar', 'multiLine', 'bar'],
    },
  },
  {
    id: 'distribution',
    name: 'Salary Distribution',
    description: 'Employee salary ranges and average salaries',
    data: distributionData,
    config: {
      dimensions: ['range'],
      measures: ['count', 'average'],
      recommendedChart: 'bar',
      availableCharts: ['bar', 'horizontalBar', 'pie', 'donut'],
    },
  },
  {
    id: 'part-to-whole',
    name: 'Budget Allocation',
    description: 'Budget breakdown by category',
    data: partToWholeData,
    config: {
      dimensions: ['category'],
      measures: ['amount'],
      recommendedChart: 'pie',
      availableCharts: ['pie', 'donut', 'bar', 'horizontalBar'],
    },
  },
  {
    id: 'correlation',
    name: 'Marketing vs Sales',
    description: 'Relationship between ad spend, sales, and leads',
    data: correlationData,
    config: {
      dimensions: ['adSpend'],
      measures: ['sales', 'leads'],
      recommendedChart: 'line',
      availableCharts: ['line', 'multiLine', 'area', 'bar'],
    },
  },
  {
    id: 'year-over-year',
    name: 'Year Over Year Performance',
    description: 'Quarterly revenue trends across multiple years',
    data: yearOverYearData,
    config: {
      dimensions: ['year'],
      measures: ['q1', 'q2', 'q3', 'q4'],
      recommendedChart: 'groupedBar',
      availableCharts: ['groupedBar', 'stackedBar', 'multiLine', 'bar'],
    },
  },
  {
    id: 'customer-segments',
    name: 'Customer Segments',
    description: 'Revenue and customer breakdown by segment',
    data: customerSegmentsData,
    config: {
      dimensions: ['segment'],
      measures: ['revenue', 'customers'],
      recommendedChart: 'bar',
      availableCharts: ['bar', 'horizontalBar', 'pie', 'donut', 'groupedBar'],
    },
  },
  {
    id: 'box-plot',
    name: 'Test Score Distribution',
    description: 'Box plot showing min, Q1, median, Q3, max for different subjects',
    data: boxPlotData,
    config: {
      dimensions: ['subject'],
      measures: ['min', 'q1', 'median', 'q3', 'max'],
      recommendedChart: 'boxPlot',
      availableCharts: ['boxPlot', 'bar', 'groupedBar'],
    },
  },
  {
    id: 'funnel',
    name: 'Sales Pipeline',
    description: 'Sales funnel stages with conversion rates',
    data: funnelData,
    config: {
      dimensions: ['stage'],
      measures: ['count', 'conversionRate'],
      recommendedChart: 'funnel',
      availableCharts: ['funnel', 'bar', 'horizontalBar'],
    },
  },
  {
    id: 'waterfall',
    name: 'Financial Bridge',
    description: 'Revenue bridge showing starting revenue, additions, subtractions, and ending revenue',
    data: waterfallData,
    config: {
      dimensions: ['category'],
      measures: ['value'],
      recommendedChart: 'waterfall',
      availableCharts: ['waterfall', 'bar', 'stackedBar'],
    },
  },
  {
    id: 'radar',
    name: 'Product Comparison',
    description: 'Radar chart comparing multiple products across features',
    data: radarData,
    config: {
      dimensions: ['feature'],
      measures: ['productA', 'productB', 'productC'],
      recommendedChart: 'radar',
      availableCharts: ['radar', 'groupedBar', 'multiLine'],
    },
  },
  {
    id: 'treemap',
    name: 'File Storage Usage',
    description: 'Treemap showing file storage usage by category',
    data: treemapData,
    config: {
      dimensions: ['name'],
      measures: ['value'],
      recommendedChart: 'treemap',
      availableCharts: ['treemap', 'pie', 'donut', 'bar'],
    },
  },
  {
    id: 'gauge',
    name: 'Performance Metrics',
    description: 'Gauge showing multiple performance metrics',
    data: gaugeData,
    config: {
      dimensions: ['name'],
      measures: ['value'],
      recommendedChart: 'gauge',
      availableCharts: ['gauge', 'bar', 'horizontalBar'],
    },
  },
  {
    id: 'sankey',
    name: 'Customer Journey',
    description: 'Sankey diagram showing customer flow through the conversion funnel',
    data: sankeyData,
    config: {
      dimensions: ['source', 'target'],
      measures: ['value'],
      recommendedChart: 'sankey',
      availableCharts: ['sankey', 'funnel', 'bar'],
    },
  },
  {
    id: 'sparkline',
    name: 'Mini Trend',
    description: 'Sparkline showing a mini trend over 7 days',
    data: sparklineData,
    config: {
      dimensions: ['day'],
      measures: ['value'],
      recommendedChart: 'sparkline',
      availableCharts: ['sparkline', 'line', 'area'],
    },
  },
  {
    id: 'scatter',
    name: 'Ad Spend vs Revenue',
    description: 'Scatter plot showing relationship between ad spend and revenue',
    data: scatterData,
    config: {
      dimensions: ['x'],
      measures: ['y'],
      recommendedChart: 'scatter',
      availableCharts: ['scatter', 'line', 'bar'],
    },
  },
  {
    id: 'histogram',
    name: 'Age Distribution',
    description: 'Histogram showing age distribution of customers',
    data: histogramData,
    config: {
      dimensions: ['range'],
      measures: ['count'],
      recommendedChart: 'histogram',
      availableCharts: ['histogram', 'bar', 'horizontalBar'],
    },
  },
  {
    id: 'horizontal-bar',
    name: 'Best Sellers',
    description: 'Horizontal bar chart showing top selling products',
    data: horizontalBarData,
    config: {
      dimensions: ['product'],
      measures: ['sales'],
      recommendedChart: 'horizontalBar',
      availableCharts: ['horizontalBar', 'bar', 'pie', 'donut'],
    },
  },
  {
    id: 'stacked-bar',
    name: 'Regional Revenue by Product',
    description: 'Stacked bar showing revenue breakdown by region and product category',
    data: stackedBarData,
    config: {
      dimensions: ['region'],
      measures: ['electronics', 'clothing', 'books'],
      recommendedChart: 'stackedBar',
      availableCharts: ['stackedBar', 'groupedBar', 'bar', 'area'],
    },
  },
  {
    id: 'grouped-bar',
    name: 'Monthly Revenue vs Expenses',
    description: 'Grouped bar chart comparing revenue, expenses, and profit by month',
    data: groupedBarData,
    config: {
      dimensions: ['month'],
      measures: ['revenue', 'expenses', 'profit'],
      recommendedChart: 'groupedBar',
      availableCharts: ['groupedBar', 'stackedBar', 'multiLine', 'bar'],
    },
  },
  {
    id: 'donut',
    name: 'Market Share',
    description: 'Donut chart showing market share by company',
    data: donutData,
    config: {
      dimensions: ['name'],
      measures: ['value'],
      recommendedChart: 'donut',
      availableCharts: ['donut', 'pie', 'bar', 'horizontalBar'],
    },
  },
  {
    id: 'multi-line',
    name: 'Multiple Metrics Over Time',
    description: 'Multi-line chart showing revenue, expenses, and profit over time',
    data: multiLineData,
    config: {
      dimensions: ['month'],
      measures: ['revenue', 'expenses', 'profit'],
      recommendedChart: 'multiLine',
      availableCharts: ['multiLine', 'area', 'stackedArea', 'bar', 'groupedBar'],
    },
  },
];

// Helper function to get a sample by ID
export function getSampleById(id: string): SampleDataset | undefined {
  return sampleDatasets.find((sample) => sample.id === id);
}

// Helper function to get all sample IDs
export function getAllSampleIds(): string[] {
  return sampleDatasets.map((sample) => sample.id);
}

// Helper function to get sample names
export function getSampleNames(): { id: string; name: string }[] {
  return sampleDatasets.map((sample) => ({ id: sample.id, name: sample.name }));
}