import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Cookie Policy',
  description: 'Learn how Qorelytics uses cookies and similar technologies across its website and application.',
  path: '/cookie',
})

export default function CookieLayout({ children }: { children: React.ReactNode }) {
  return children
}
