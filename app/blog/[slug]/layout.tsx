import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { siteName, siteUrl } from '@/src/lib/seo'

const query = `*[_type == "post" && slug.current == $slug][0] {
  title,
  publishedAt,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  tags,
  "author": author->name
}`

type Article = {
  title: string
  publishedAt?: string
  imageUrl?: string
  imageAlt?: string
  tags?: string[]
  author?: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article: Article | null = await client.fetch(query, { slug }, { next: { revalidate: 60 } })

  if (!article) {
    return {
      title: `Article Not Found | ${siteName}`,
      robots: { index: false, follow: false },
    }
  }

  const url = `${siteUrl}/blog/${slug}`
  const description = `Read ${article.title} from ${siteName} for practical insights on AI, data analytics, business intelligence, and data visualization.`

  return {
    title: article.title,
    description,
    keywords: article.tags ?? [],
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName,
      title: article.title,
      description,
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : undefined,
      images: article.imageUrl
        ? [{ url: article.imageUrl, alt: article.imageAlt ?? article.title }]
        : undefined,
    },
    twitter: {
      card: article.imageUrl ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  }
}

export default async function BlogArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article: Article | null = await client.fetch(query, { slug }, { next: { revalidate: 60 } })

  const structuredData = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${siteUrl}/blog/${slug}#article`,
        headline: article.title,
        description: `Read ${article.title} from ${siteName} for practical insights on AI, data analytics, business intelligence, and data visualization.`,
        url: `${siteUrl}/blog/${slug}`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/blog/${slug}`,
        },
        datePublished: article.publishedAt,
        author: article.author
          ? { '@type': 'Person', name: article.author }
          : { '@type': 'Organization', name: siteName },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
        },
        image: article.imageUrl
          ? {
              '@type': 'ImageObject',
              url: article.imageUrl,
              caption: article.imageAlt ?? article.title,
            }
          : undefined,
        keywords: article.tags?.join(', '),
      }
    : null

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {children}
    </>
  )
}
