import type { Metadata } from "next";
import "./globals.css";
import "@/styles/tokens.css";
import Providers from "./providers";
import LayoutWrapper from "@/components/layout/layoutWrapper";
import { defaultDescription, defaultKeywords, defaultTitle, siteName, siteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${siteName}` },
  description: defaultDescription,
  keywords: defaultKeywords,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Business",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: { type: "website", locale: "en_US", url: siteUrl, siteName, title: defaultTitle, description: defaultDescription },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon0.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: defaultDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: siteName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description: defaultDescription,
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased overflow-hidden" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('theme');
                const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              })();
            `,
          }}
        />
      </head>
      <body className="h-full flex flex-col bg-white dark:bg-[#171b1d] text-foreground font-text transition-colors overflow-hidden">
        <Providers><LayoutWrapper>{children}</LayoutWrapper></Providers>
      </body>
    </html>
  );
}
