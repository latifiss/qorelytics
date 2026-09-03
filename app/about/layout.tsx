import type { Metadata } from 'next'
import { buildMetadata, siteName, siteUrl } from '@/src/lib/seo'
import faqData from '@/data/faq.json'

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
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
    },
    {
      '@type': 'SoftwareApplication',
      name: siteName,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered data analytics for analyzing CSV and Excel business data, discovering trends, generating insights, and creating visualizations.',
      url: `${siteUrl}/about`,
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/about#faq`,
      mainEntity: faqData.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
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
