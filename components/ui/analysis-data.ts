import { AnalysisStep, ReportSection } from './types';

export const analysisSteps: AnalysisStep[] = [
  { id: 1, message: 'Initializing analysis engine...' },
  { id: 2, message: 'Detecting uploaded file type...' },
  { id: 3, message: 'Reading dataset structure...' },
  { id: 4, message: 'Scanning columns and data types...' },
  { id: 5, message: 'Finding missing values...' },
  { id: 6, message: 'Calculating statistical patterns...' },
  { id: 7, message: 'Comparing trends over time...' },
  { id: 8, message: 'Generating chart recommendations...' },
  { id: 9, message: 'Preparing final insights...' },
];

export const followUpSteps: AnalysisStep[] = [
  { id: 1, message: 'Reviewing the previous analysis...' },
  { id: 2, message: 'Understanding your question...' },
  { id: 3, message: 'Checking the relevant findings...' },
  { id: 4, message: 'Reasoning from the available data...' },
  { id: 5, message: 'Preparing a focused answer...' },
];

export const reportSections: ReportSection[] = [
  { title: 'Dataset Overview', content: `\nFile:\nCustomer Sales Report.csv\n\nRows:\n12,450\n\nColumns:\n18\n\nRevenue:\n$2,450,000\n` },
  { title: 'Revenue Trend Analysis', content: `\nRevenue increased by 24% over the last six months.\n\n[CHART:0]\n\nThe growth was driven by:\n• New customer acquisition (up 18%)\n• Increased average order value (up 12%)\n• Seasonal promotions (up 8%)\n` },
  { title: 'Product Category Breakdown', content: `\nElectronics led the growth with 32% increase.\n\n[CHART:1]\n\nOther categories showed steady growth:\n• Home & Garden: 18%\n• Clothing: 12%\n• Books: 8%\n` },
  { title: 'Regional Performance', content: `\nNorth America and Asia Pacific show the strongest growth potential.\n\n[CHART:2]\n\nKey regional insights:\n• North America: 28% growth\n• Asia Pacific: 22% growth\n• Europe: 15% growth\n• Latin America: 18% growth\n` },
  { title: 'Recommendations', content: `\nBased on the analysis, I recommend:\n• Increase marketing spend in Electronics category\n• Launch retention campaigns for Q3\n• Explore expansion in Asia Pacific markets\n• Optimize pricing strategy for Home & Garden\n\nConfidence Score: 92%\n` },
];

export const defaultResponse = `\nI analyzed your customer sales dataset.\n\nThe analysis shows strong growth, but there are opportunities to improve customer retention.\n\nBelow is the generated analysis report.\n`;
