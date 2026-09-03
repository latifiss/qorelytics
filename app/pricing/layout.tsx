import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Data Analytics Pricing',
  description: 'Explore Qorelytics pricing plans for AI-powered data analysis, business insights, visualizations, reports, and advanced analytics.',
  path: '/pricing',
  keywords: [
    'Qorelytics pricing',
    'AI data analytics pricing',
    'AI data analyst pricing',
    'data analysis software pricing',
    'business analytics software',
    'AI analytics platform',
  ],
})

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
