import {
  AnalysisStep,
  ReportSection,
} from './types';

export const analysisSteps: AnalysisStep[] = [
  {
    id: 1,
    message: 'Initializing analysis engine...',
  },
  {
    id: 2,
    message: 'Detecting uploaded file type...',
  },
  {
    id: 3,
    message: 'Reading dataset structure...',
  },
  {
    id: 4,
    message: 'Scanning columns and data types...',
  },
  {
    id: 5,
    message: 'Finding missing values...',
  },
  {
    id: 6,
    message: 'Calculating statistical patterns...',
  },
  {
    id: 7,
    message: 'Comparing trends over time...',
  },
  {
    id: 8,
    message: 'Generating chart recommendations...',
  },
  {
    id: 9,
    message: 'Preparing final insights...',
  },
];

export const reportSections: ReportSection[] = [
  {
    title: 'Dataset Overview',
    content: `
File:
Customer Sales Report.csv

Rows:
12,450

Columns:
18

Revenue:
$2,450,000
`,
  },

  {
    title: 'Revenue Trend Analysis',
    content: `
Revenue increased by 24% over the last six months.

[CHART:0]

The growth was driven by:
• New customer acquisition (up 18%)
• Increased average order value (up 12%)
• Seasonal promotions (up 8%)
`,
  },

  {
    title: 'Product Category Breakdown',
    content: `
Electronics led the growth with 32% increase.

[CHART:1]

Other categories showed steady growth:
• Home & Garden: 18%
• Clothing: 12%
• Books: 8%
`,
  },

  {
    title: 'Regional Performance',
    content: `
North America and Asia Pacific show the strongest growth potential.

[CHART:2]

Key regional insights:
• North America: 28% growth
• Asia Pacific: 22% growth
• Europe: 15% growth
• Latin America: 18% growth
`,
  },

  {
    title: 'Recommendations',
    content: `
Based on the analysis, I recommend:
• Increase marketing spend in Electronics category
• Launch retention campaigns for Q3
• Explore expansion in Asia Pacific markets
• Optimize pricing strategy for Home & Garden

Confidence Score: 92%
`,
  },
];

export const defaultResponse = `
I analyzed your customer sales dataset.

The analysis shows strong growth, but there are opportunities to improve customer retention.

Below is the generated analysis report.
`;