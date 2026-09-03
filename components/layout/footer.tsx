'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/themeContext';
import LogoWordmark from '@/public/icons/logo/logoWordmark';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const columns: FooterColumn[] = [
    {
      title: 'Use Cases',
      links: [
        { label: 'Solo Entrepreneur', href: 'https://qorelytics-nine.vercel.app/blog/data-is-not-just-for-big-companies' },
        { label: 'Startups', href: 'https://qorelytics-nine.vercel.app/blog/why-visualization-matters-for-startups' },
        { label: 'Creators', href: 'https://qorelytics-nine.vercel.app/blog/building-better-products-starts-with-better-questions' },
        { label: 'Freelancers', href: 'https://qorelytics-nine.vercel.app/blog/how-freelancers-can-get-more-from-their-data' },
      ],
    },
    {
      title: 'Product',
      links: [
        { label: 'New Chat', href: 'https://qorelytics-nine.vercel.app/' },
        { label: 'Pricing', href: 'https://qorelytics-nine.vercel.app/pricing' },
        { label: 'Blog', href: 'https://qorelytics-nine.vercel.app/blog' },
        { label: 'About', href: 'https://qorelytics-nine.vercel.app/about' },
      ],
    },
    {
      title: 'Compare',
      links: [
        { label: 'Qorelytics vs ChatGPT', href: 'https://qorelytics-nine.vercel.app/blog/qorelytics-vs-chatgpt' },
        { label: 'Qorelytics vs Claude', href: 'https://qorelytics-nine.vercel.app/blog/qorelytics-vs-claude' },
        { label: 'Qorelytics vs DeepSeek', href: 'https://qorelytics-nine.vercel.app/blog/qorelytics-vs-deepseek' },
        { label: 'Qorelytics vs Perplexity', href: 'https://qorelytics-nine.vercel.app/blog/qorelytics-vs-perplexity' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: 'https://qorelytics-nine.vercel.app/terms' },
        { label: 'Privacy Policy', href: 'https://qorelytics-nine.vercel.app/privacy' },
        { label: 'Refund Policy', href: 'https://qorelytics-nine.vercel.app/refund' },
        { label: 'Cookie Policy', href: 'https://qorelytics-nine.vercel.app/cookies' },
      ],
    },
  ];

  return (
    <footer className="w-full border-t bg-white dark:bg-[#171b1d] border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        {/* Logo - using same pattern as IntroPage */}
        <div className="block dark:hidden">
          <LogoWordmark
            width="100%"
            height="auto"
            accentColor="#7FF86C"
            className="w-full"
          />
        </div>
        <div className="hidden dark:block">
          <Image
            src="/images/logo/logo-wordmark-white.svg"
            alt="Qorelytics Logo"
            width={160}
            height={40}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border rounded-lg border-neutral-200 dark:border-neutral-800">
          {columns.map((column, index) => (
            <div
              key={column.title}
              className={`p-6 space-y-3 ${
                index < columns.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-800' : ''
              } ${
                index % 2 === 0 && index < columns.length - 1 ? 'sm:border-r border-neutral-200 dark:border-neutral-800' : ''
              } ${
                index < columns.length - 2 ? 'lg:border-r border-neutral-200 dark:border-neutral-800' : ''
              }`}
            >
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            &copy; {new Date().getFullYear()} Qorelytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;