import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Read the Qorelytics terms of service governing use of the AI-powered data analytics platform.',
  path: '/terms',
})

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
