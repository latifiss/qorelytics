import BlogCard from "@/components/ui/blogCard"
import { TagType } from '@/components/ui/blogCard'

const blogPosts: {
  id: number
  title: string
  date: string
  imageUrl: string
  tags: TagType[]
}[] = [
  {
    id: 1,
    title: "Close Friends Only: J Balvin & Ryan Castro Talk New Album",
    date: "2026-06-30",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hbGwlMjBidXNpbmVzc3xlbnwwfHwwfHx8MA%3D%3D",
    tags: ['announcement']
  },
  {
    id: 2,
    title: "Mastering Data Visualization in 2026",
    date: "2026-07-15",
    imageUrl: "https://images.unsplash.com/photo-1556740772-1a741367b93e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNtYWxsJTIwYnVzaW5lc3N8ZW58MHx8MHx8fDA%3D",
    tags: ['tutorials', 'visualization', 'trends']
  },
  {
    id: 3,
    title: "AI-Powered Analytics: The Future of Business Intelligence",
    date: "2026-07-10",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBhbmFseXRpY3N8ZW58MHx8MHx8fDA%3D",
    tags: ['insights', 'strategy']
  },
  {
    id: 4,
    title: "How Creators Are Leveraging Data to Grow Their Audience",
    date: "2026-07-05",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JlYXRvcnN8ZW58MHx8MHx8fDA%3D",
    tags: ['creators', 'community']
  },
  {
    id: 5,
    title: "Top 10 Data Visualization Trends to Watch in 2026",
    date: "2026-06-28",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGF0YSUyMHZpc3VhbGl6YXRpb258ZW58MHx8MHx8fDA%3D",
    tags: ['visualization', 'trends', 'innovation']
  },
  {
    id: 6,
    title: "Productivity Hacks for Data Analysts in 2026",
    date: "2026-06-20",
    imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdGl2aXR5fGVufDB8fDB8fHww",
    tags: ['productivity', 'tutorials']
  },
  {
    id: 7,
    title: "From Data to Decisions: A Strategic Approach to Analytics",
    date: "2026-06-15",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RyYXRlZ3l8ZW58MHx8MHx8fDA%3D",
    tags: ['strategy', 'insights']
  },
  {
    id: 8,
    title: "Building a Data-Driven Community: Lessons from Top Brands",
    date: "2026-06-10",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5fGVufDB8fDB8fHww",
    tags: ['community', 'creators']
  },
  {
    id: 9,
    title: "Innovation in Data Science: What's Next for AI and ML",
    date: "2026-06-05",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5ub3ZhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    tags: ['innovation', 'insights']
  },
  {
    id: 10,
    title: "The Ultimate Guide to Data Storytelling for Analysts",
    date: "2026-05-28",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YSUyMHN0b3J5dGVsbGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    tags: ['tutorials', 'visualization']
  }
]

export default function BlogPage() {
  return (
    <div
      className="
        container 
        mx-auto 
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
            key={post.id}
            title={post.title}
            date={post.date}
            imageUrl={post.imageUrl}
            tags={post.tags}
          />
        ))}
      </div>
    </div>
  )
}