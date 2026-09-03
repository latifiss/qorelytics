import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Data Analytics & AI Insights Blog',
  description: 'Learn about AI data analysis, business intelligence, data visualization, analytics workflows, and practical ways to turn business data into useful insights.',
  path: '/blog',
  keywords: [
    'data analytics blog',
    'AI data analysis blog',
    'business intelligence blog',
    'data visualization tips',
    'AI analytics',
    'business data insights',
  ],
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
