import BlogCard from "@/components/ui/blogCard"
import { TagType } from "@/components/ui/blogCard"
import { client } from "@/sanity/lib/client"

const query = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    publishedAt,
    "imageUrl": mainImage.asset->url,
    "slug": slug.current,
    tags
  }
`

type BlogPost = {
  _id: string
  title: string
  publishedAt: string
  imageUrl: string
  slug: string
  tags: TagType[]
}

export default async function BlogPage() {
  const blogPosts: BlogPost[] = await client.fetch(
    query,
    {},
    {
      next: {
        revalidate: 60,
      },
    }
  )

  return (
    <div
      className="
        container 
        mx-auto 
        min-h-[90vh]
        px-6 
        py-12
        md:px-10
        lg:px-12
        xl:px-20
      "
    >
      <h1 className="text-5xl font-bold font-text text-black mb-12">
        Read Our Blog
      </h1>

      {blogPosts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-black/60 font-text">
            No blogs yet
          </p>
        </div>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-8
          "
        >
          {blogPosts.map((post) => (
            <BlogCard
              key={post._id}
              title={post.title}
              date={post.publishedAt}
              imageUrl={post.imageUrl}
              tags={post.tags ?? []}
              href={`/blog/${post.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}