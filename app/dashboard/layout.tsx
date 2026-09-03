import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Qorelytics',
  description: 'Your private Qorelytics AI data analytics workspace.',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
