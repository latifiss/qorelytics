import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Data Analytics Platform',
  description: 'Qorelytics is an AI-powered data analytics platform that helps businesses analyze data, discover trends, generate insights, and create visualizations from CSV and Excel files.',
  path: '/about',
})

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://qorelytics.vercel.app/#organization',
      name: 'Qorelytics',
      url: 'https://qorelytics.vercel.app',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Qorelytics',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered data analytics for analyzing CSV and Excel business data, discovering trends, generating insights, and creating visualizations.',
      url: 'https://qorelytics.vercel.app/about',
    },
  ],
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}
