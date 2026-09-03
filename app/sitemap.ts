import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { siteUrl } from '@/src/lib/seo'

const query = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current,
  publishedAt
}`

type BlogPost = {
  slug: string
  publishedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/pricing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/cookie`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  try {
    const posts: BlogPost[] = await client.fetch(query, {}, { next: { revalidate: 3600 } })

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticPages, ...blogPages]
  } catch {
    return staticPages
  }
}
