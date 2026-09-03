import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Data Analyst for Business Analytics',
  description: 'Use Qorelytics as an AI data analyst to analyze CSV and Excel files, uncover trends, generate business insights, create visualizations, and ask questions about your data.',
  path: '/intro',
  keywords: [
    'AI data analyst',
    'AI business analytics',
    'CSV analysis tool',
    'Excel analysis tool',
    'automated business insights',
    'AI data visualization',
    'business data analysis',
  ],
})

export default function IntroLayout({ children }: { children: React.ReactNode }) {
  return children
}
