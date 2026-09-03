import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | Qorelytics',
  robots: { index: false, follow: false },
}

export default function AuthSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
