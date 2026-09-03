import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Read the Qorelytics privacy policy to learn how data, accounts, analytics, and personal information are handled.',
  path: '/privacy',
})

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
