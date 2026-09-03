import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Data Analytics Platform',
  description: 'Qorelytics is an AI-powered data analytics platform that helps businesses analyze data, discover trends, generate insights, and create visualizations from CSV and Excel files.',
  path: '/about',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
