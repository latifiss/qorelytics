'use client'

import ClockIcon from '@/public/icons/mono/clock'
import Image from 'next/image'
import React from 'react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { TagType } from '@/components/ui/blogCard'

interface ArticleDetailProps {
  title: string
  date: string
  imageUrl: string
  imageAlt?: string
  tags?: TagType[]
  content?: unknown
  author?: string
  authorImage?: string
  className?: string
}

const TAG_CONFIG: Record<TagType, { label: string; colorClass: string }> = {
  announcement: {
    label: '#ANNOUNCEMENT',
    colorClass: 'bg-code-vivid-1',
  },
  creators: {
    label: '#CREATORS',
    colorClass: 'bg-code-vivid-4',
  },
  tutorials: {
    label: '#TUTORIALS',
    colorClass: 'bg-code-vivid-7',
  },
  insights: {
    label: '#INSIGHTS',
    colorClass: 'bg-code-vivid-10',
  },
  trends: {
    label: '#TRENDS',
    colorClass: 'bg-code-vivid-13',
  },
  productivity: {
    label: '#PRODUCTIVITY',
    colorClass: 'bg-code-vivid-16',
  },
  visualization: {
    label: '#VISUALIZATION',
    colorClass: 'bg-code-vivid-18',
  },
  strategy: {
    label: '#STRATEGY',
    colorClass: 'bg-code-vivid-20',
  },
  community: {
    label: '#COMMUNITY',
    colorClass: 'bg-code-vivid-22',
  },
  innovation: {
    label: '#INNOVATION',
    colorClass: 'bg-code-vivid-24',
  },
}

const Tag = ({ type }: { type: TagType }) => {
  const config = TAG_CONFIG[type]

  return (
    <span
      className={`flex items-center justify-center text-xs font-medium text-black dark:text-white py-1 px-2 rounded-lg h-7 tablet:h-[25px] mobile:h-[25px] ${config.colorClass}`}
    >
      {config.label}
    </span>
  )
}

const TagGroup = ({ tags }: { tags: TagType[] }) => {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-start gap-2">
      {tags.map((tag, index) => (
        <Tag key={`${tag}-${index}`} type={tag} />
      ))}
    </div>
  )
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-black dark:text-white leading-8 mb-6">
        {children}
      </p>
    ),

    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-black dark:text-white leading-tight mt-10 mb-6">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-black dark:text-white leading-tight mt-10 mb-5">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-black dark:text-white leading-tight mt-8 mb-4">
        {children}
      </h3>
    ),

    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-black dark:text-white leading-tight mt-8 mb-4">
        {children}
      </h4>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-black dark:border-white pl-5 my-8 text-black/70 dark:text-white/70 italic">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-black dark:text-white">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-black dark:text-white">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 text-black dark:text-white leading-7">
        {children}
      </li>
    ),

    number: ({ children }) => (
      <li className="pl-1 text-black dark:text-white leading-7">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-black dark:text-white">
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em>{children}</em>
    ),

    link: ({ value, children }) => {
      const href = value?.href

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 text-black dark:text-white hover:opacity-70 transition-opacity"
        >
          {children}
        </a>
      )
    },
  },
}

const ArticleDetail = ({
  title,
  date,
  imageUrl,
  imageAlt = 'Blog Image',
  tags = [],
  content = [],
  className = '',
}: ArticleDetailProps) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : ''

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(title)}`,
  }

  return (
    <article
      className={`max-w-4xl mx-auto px-6 py-12 min-h-screen bg-white dark:bg-[#171b1d] ${className}`}
    >
      <div className="flex flex-col items-start gap-6">
        <TagGroup tags={tags} />

        <h1 className="text-5xl font-bold text-black dark:text-white leading-tight tablet:text-4xl mobile:text-3xl">
          {title}
        </h1>

        <div className="flex items-center justify-between w-full flex-wrap gap-4">
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center justify-start gap-1">
              <ClockIcon
                size={16}
                color="#13151B"
                className="text-black dark:text-white"
              />

              <time
                className="text-sm font-regular text-black dark:text-white"
                dateTime={date}
              >
                {formattedDate}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              aria-label="Share on Facebook"
            >
              <Image
                src="/social/facebook.svg"
                alt="Facebook"
                width={32}
                height={32}
              />
            </a>

            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              aria-label="Share on Twitter"
            >
              <Image
                src="/social/x.svg"
                alt="Twitter"
                width={32}
                height={32}
              />
            </a>

            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Image
                src="/social/linkedin.svg"
                alt="LinkedIn"
                width={32}
                height={32}
              />
            </a>

            <a
              href={shareLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              aria-label="Share on Reddit"
            >
              <Image
                src="/social/reddit.svg"
                alt="Reddit"
                width={32}
                height={32}
              />
            </a>
          </div>
        </div>

        <div className="relative w-full h-100 tablet:h-[350px] mobile:h-[250px]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {Array.isArray(content) && content.length > 0 && (
          <div
            className="
              prose
              prose-lg
              max-w-none
              w-full
              text-black
              dark:text-white
              prose-headings:text-black
              dark:prose-headings:text-white
              prose-p:text-black
              dark:prose-p:text-white
              prose-strong:text-black
              dark:prose-strong:text-white
              prose-li:text-black
              dark:prose-li:text-white
              prose-a:text-black
              dark:prose-a:text-white
            "
          >
            <PortableText
              value={content as any}
              components={portableTextComponents}
            />
          </div>
        )}
      </div>
    </article>
  )
}

export default ArticleDetail