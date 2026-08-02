'use client';

import React from 'react';
import Link from 'next/link';
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
        { label: 'Solo Entrepreneur', href: '/use-cases/solo-entrepreneur' },
        { label: 'Startups', href: '/use-cases/startups' },
        { label: 'Agencies', href: '/use-cases/agencies' },
        { label: 'Enterprise', href: '/use-cases/enterprise' },
        { label: 'Freelancers', href: '/use-cases/freelancers' },
      ],
    },
    {
      title: 'Product',
      links: [
        { label: 'New Chat', href: '/' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
      ],
    },
    {
      title: 'Compare',
      links: [
        { label: 'Qorelytics vs ChatGPT', href: '/compare/chatgpt' },
        { label: 'Qorelytics vs Claude', href: '/compare/claude' },
        { label: 'Qorelytics vs DeepSeek', href: '/compare/deepseek' },
        { label: 'Qorelytics vs Perplexity', href: '/compare/perplexity' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Refund Policy', href: '/legal/refund' },
        { label: 'Cookie Policy', href: '/legal/cookies' },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-subtle bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
  <LogoWordmark
    width="100%"
    height="auto"
    color={isDark ? '#ffffff' : '#000000'}
    accentColor="#7FF86C"
    className="w-full"
  />
</div>
      <div className="max-w-7xl mx-auto px-6 pb-12 lg:pb-16 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-subtle">
  {columns.map((column, index) => (
    <div
      key={column.title}
      className={`p-6 space-y-3 ${
        index < columns.length - 1 ? 'border-b border-subtle' : ''
      } ${
        index % 2 === 0 && index < columns.length - 1 ? 'sm:border-r border-subtle' : ''
      }`}
    >
      <h3 className="text-3xl font-semibold text-foreground uppercase tracking-wider">
        {column.title}
      </h3>
      <ul className="space-y-2">
        {column.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-3xl text-muted hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
              <div className=" mt-10 pt-6">
  <p className="text-sm text-muted text-center">
    &copy; {new Date().getFullYear()} Qorelytics. All rights reserved.
  </p>
</div>
      </div>
    </footer>
  );
};

export default Footer;