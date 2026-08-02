import ArticleDetail from '@/components/layout/articleDetail'

const articleData = {
  title: "Close Friends Only: J Balvin & Ryan Castro Talk New Album",
  date: "2026-06-30",
  imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hbGwlMjBidXNpbmVzc3xlbnwwfHwwfHx8MA%3D%3D",
  imageAlt: "Blog post cover image",
  tags: ['announcement', 'creators'],
  author: "Sarah Johnson",
  authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
  content: `
    <p>In an exclusive interview, J Balvin and Ryan Castro sit down to discuss their groundbreaking new album that's taking the music world by storm. The duo opens up about their creative process, the inspiration behind their latest tracks, and what fans can expect from this exciting collaboration.</p>
    
    <p>The album, which blends reggaeton with urban influences, represents a new chapter in both artists' careers. Balvin, known for his innovative approach to Latin music, shares how this project pushed him out of his comfort zone.</p>
    
    <h2>The Creative Process</h2>
    <p>Working together in the studio, the two artists found a unique chemistry that translated into something special. They spent months perfecting each track, drawing from personal experiences and the vibrant culture of their hometowns.</p>
    
    <p>Ryan Castro, who has been making waves in the Latin music scene, describes the collaboration as a dream come true. "Working with J Balvin has been one of the most fulfilling experiences of my career," he says.</p>
    
    <h2>What's Next</h2>
    <p>With the album set to release later this year, both artists are already planning a world tour that promises to be their most ambitious yet. Fans can expect high-energy performances and surprise guest appearances.</p>
    
    <p>Stay tuned for more updates as we follow their journey leading up to the album release and beyond.</p>
  `
}

export default function ArticlePage() {
  return <ArticleDetail {...articleData} />
}