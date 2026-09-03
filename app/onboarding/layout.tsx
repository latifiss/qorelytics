import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started | Qorelytics',
  description: 'Set up your Qorelytics workspace and start using AI-powered data analytics.',
  robots: { index: false, follow: false },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
