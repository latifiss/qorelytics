import type { Metadata } from 'next'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://qorelytics.vercel.app').replace(/\/$/, '')
export const siteName = 'Qorelytics'
export const defaultTitle = 'Qorelytics — AI Data Analyst for Business Analytics'
export const defaultDescription = 'Qorelytics is an AI-powered data analytics platform that analyzes CSV and Excel files, discovers trends, generates insights and visualizations, and answers questions about your business data.'
export const defaultKeywords = [
  'AI data analyst',
  'AI data analytics',
  'business data analytics',
  'data analysis AI',
  'CSV data analysis',
  'Excel data analysis',
  'AI analytics platform',
  'automated data analysis',
  'data insights',
  'data visualization',
  'business intelligence',
  'AI business intelligence',
]

export function buildMetadata({
  title,
  description = defaultDescription,
  path = '/',
  keywords = defaultKeywords,
  noIndex = false,
}: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const canonical = `${siteUrl}${path === '/' ? '' : path}`

  return {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description,
    keywords,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName,
      title: title ? `${title} | ${siteName}` : defaultTitle,
      description,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${siteName}` : defaultTitle,
      description,
    },
  }
}
