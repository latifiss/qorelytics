import ArticleDetail from '@/components/layout/articleDetail'
import { client } from "@/sanity/lib/client"
import { TagType } from "@/components/ui/blogCard"
import { notFound } from "next/navigation"

const query = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    publishedAt,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    tags,
    "author": author->name,
    "authorImage": author->image.asset->url,
    body
  }
`

type Article = {
  _id: string
  title: string
  publishedAt: string
  imageUrl: string
  imageAlt?: string
  tags: TagType[]
  author?: string
  authorImage?: string
  body: unknown
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article: Article | null = await client.fetch(
    query,
    { slug },
    {
      next: {
        revalidate: 60,
      },
    }
  )

  if (!article) {
    notFound()
  }

  return (
    <ArticleDetail
      title={article.title}
      date={article.publishedAt}
      imageUrl={article.imageUrl}
      imageAlt={article.imageAlt ?? "Blog post cover image"}
      tags={article.tags ?? []}
      author={article.author ?? "Unknown"}
      authorImage={
        article.authorImage ?? "/images/default-avatar.svg"
      }
      content={article.body as string}
    />
  )
}