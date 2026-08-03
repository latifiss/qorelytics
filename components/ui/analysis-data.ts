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
    title: 'Key Findings',
    content: `
• Revenue increased by 18.6%

• North America generated the highest sales

• Returning customers created 64% of revenue

• New customer churn increased by 7%
`,
  },

  {
    title: 'Recommendations',
    content: `
✓ Improve customer onboarding

✓ Launch retention campaigns

✓ Increase investment in top performing regions
`,
  },

  {
    title: 'Confidence Score',
    content: `
92% confidence based on dataset quality and pattern consistency.
`,
  },
];


export const defaultResponse = `
I analyzed your customer sales dataset.

The analysis shows strong growth, but there are opportunities to improve customer retention.

Below is the generated analysis report.
`;