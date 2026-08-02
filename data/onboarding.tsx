import {
  EntertainmentIcon,
  HealthIcon,
  SportIcon,
  FinanceIcon,
  EnergyIcon,
  LogisticsIcon,
  EducationIcon,
  RetailIcon,
  TravelIcon,
} from '@/public/icons/industries';
import {
  DropboxIcon,
  TableauIcon,
  ExcelIcon,
  SheetsIcon,
  PowerBiIcon,
  SQLIcon,
  SalesforceIcon,
  NotionIcon,
  QuickbooksIcon,
  SnowflakeIcon,
} from '@/public/icons/tools';
import {
  GoogleIcon,
  FacebookIcon,
  AIIcon,
  LinkedinIcon,
  XIcon,
  RedditIcon,
  NewsIcon,
  YoutubeIcon,
} from '@/public/icons/social';

export interface Step {
  id: number;
  title: string;
  description: string;
  skipable?: boolean;
}

export const reasons = [
  'Financial Reports',
  'KPI Tracking',
  'Business Analytics',
  'Data Visualization',
  'AI Insights',
  'Customer Analytics',
  'Marketing Reports',
  'Operations Analytics',
  'Other'
];

export const roles = [
  'CEO',
  'Founder',
  'Student',
  'Data Analyst',
  'Business Analyst',
  'Product Manager',
  'Marketing Manager',
  'Finance Manager',
  'Operations Manager',
  'Software Engineer',
  'Consultant',
  'Other'
];

export const industries = [
  { label: 'Entertainment', icon: <EntertainmentIcon size={24} /> },
  { label: 'Health', icon: <HealthIcon size={24} /> },
  { label: 'Sports', icon: <SportIcon size={24} /> },
  { label: 'Finance', icon: <FinanceIcon size={24} /> },
  { label: 'Energy', icon: <EnergyIcon size={24} /> },
  { label: 'Logistics', icon: <LogisticsIcon size={24} /> },
  { label: 'Education', icon: <EducationIcon size={24} /> },
  { label: 'Retail', icon: <RetailIcon size={24} /> },
  { label: 'Travel', icon: <TravelIcon size={24} /> },
  { label: 'Other' },
];

export const tools = [
  { label: 'Dropbox', icon: <DropboxIcon size={24} /> },
  { label: 'Tableau', icon: <TableauIcon size={24} /> },
  { label: 'Excel', icon: <ExcelIcon size={24} /> },
  { label: 'Google Sheets', icon: <SheetsIcon size={24} /> },
  { label: 'Power BI', icon: <PowerBiIcon size={24} /> },
  { label: 'SQL', icon: <SQLIcon size={24} /> },
  { label: 'Python', icon: <SalesforceIcon size={24} /> },
  { label: 'Notion', icon: <NotionIcon size={24} /> },
  { label: 'Airtable', icon: <QuickbooksIcon size={24} /> },
  { label: 'Snowflake', icon: <SnowflakeIcon size={24} /> },
  { label: 'Other' },
];

export const referralSources = [
  { label: 'Google', icon: <GoogleIcon size={32} /> },
  { label: 'Facebook', icon: <FacebookIcon size={32} /> },
  { label: 'AI Recommendation', icon: <AIIcon size={32} /> },
  { label: 'LinkedIn', icon: <LinkedinIcon size={32} /> },
  { label: 'X (Formally twitter)', icon: <XIcon size={32} /> },
  { label: 'Reddit', icon: <RedditIcon size={32} /> },
  { label: 'Newsletter', icon: <NewsIcon size={32} /> },
  { label: 'YouTube', icon: <YoutubeIcon size={32} /> },
  { label: 'Other' },
];

export const steps: Omit<Step, 'component'>[] = [
  {
    id: 0,
    title: 'What do you want to do with Qorelytics?',
    description: 'Select what you want to accomplish',
    skipable: false,
  },
  {
    id: 1,
    title: 'Who are you?',
    description: 'Select your role to personalize your experience',
    skipable: true,
  },
  {
    id: 2,
    title: "What's your industry?",
    description: 'Select the industry you work in',
    skipable: true,
  },
  {
    id: 3,
    title: 'What tools do you use?',
    description: 'Select all the tools you currently use',
    skipable: true,
  },
  {
    id: 4,
    title: 'Where did you hear about us?',
    description: 'Help us understand how you found us',
    skipable: true,
  },
];