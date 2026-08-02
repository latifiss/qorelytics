'use client'

import ClockIcon from '@/public/icons/mono/clock'
import Image from 'next/image'
import React from 'react'
import { TagType } from '@/components/ui/blogCard'

interface ArticleDetailProps {
  title: string
  date: string
  imageUrl: string
  imageAlt?: string
  tags?: TagType[]
  content?: string
  author?: string
  authorImage?: string
  className?: string
}

const TAG_CONFIG: Record<TagType, { label: string; colorClass: string }> = {
  announcement: { label: '#ANNOUNCEMENT', colorClass: 'bg-code-vivid-1' },
  creators: { label: '#CREATORS', colorClass: 'bg-code-vivid-4' },
  tutorials: { label: '#TUTORIALS', colorClass: 'bg-code-vivid-7' },
  insights: { label: '#INSIGHTS', colorClass: 'bg-code-vivid-10' },
  trends: { label: '#TRENDS', colorClass: 'bg-code-vivid-13' },
  productivity: { label: '#PRODUCTIVITY', colorClass: 'bg-code-vivid-16' },
  visualization: { label: '#VISUALIZATION', colorClass: 'bg-code-vivid-18' },
  strategy: { label: '#STRATEGY', colorClass: 'bg-code-vivid-20' },
  community: { label: '#COMMUNITY', colorClass: 'bg-code-vivid-22' },
  innovation: { label: '#INNOVATION', colorClass: 'bg-code-vivid-24' },
}

const Tag = ({ type }: { type: TagType }) => {
  const config = TAG_CONFIG[type]
  return (
    <span className={`flex items-center justify-center text-xs font-medium text-black py-1 px-2 rounded-lg h-7 tablet:h-[25px] mobile:h-[25px] ${config.colorClass}`}>
      {config.label}
    </span>
  )
}

const TagGroup = ({ tags }: { tags: TagType[] }) => {
  if (!tags || tags.length === 0) return null
  
  return (
    <div className='flex flex-wrap items-center justify-start gap-2'>
      {tags.map((tag, index) => (
        <Tag key={`${tag}-${index}`} type={tag} />
      ))}
    </div>
  )
}

const ArticleDetail = ({
  title,
  date,
  imageUrl,
  imageAlt = 'Blog Image',
  tags = [],
  content = '',
  className = '',
}: ArticleDetailProps) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
  }

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400')
  }

  return (
    <article className={`max-w-4xl mx-auto px-6 py-12 ${className}`}>
      <div className='flex flex-col items-start gap-6'>
        <TagGroup tags={tags} />
        
        <h1 className='text-5xl font-bold text-black leading-tight tablet:text-4xl mobile:text-3xl'>
          {title}
        </h1>
        
        <div className='flex items-center justify-between w-full flex-wrap gap-4'>
          <div className='flex items-center justify-start gap-4'>
            
            <div className='flex items-center justify-start gap-1'>
                <ClockIcon size={16} color='#13151B' />
                <time className='text-sm font-regular text-black' dateTime={date}>
                  {formattedDate}
                </time>
              </div>
          </div>
          
          <div className='flex items-center gap-2'>
  <a
    href={shareLinks.facebook}
    target="_blank"
    rel="noopener noreferrer"
    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
    aria-label='Share on Facebook'
  >
    <Image src='/social/facebook.svg' alt='Facebook' width={32} height={32} />
  </a>
  <a
    href={shareLinks.twitter}
    target="_blank"
    rel="noopener noreferrer"
    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
    aria-label='Share on Twitter'
  >
    <Image src='/social/x.svg' alt='Twitter' width={32} height={32} />
  </a>
  <a
    href={shareLinks.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
    aria-label='Share on LinkedIn'
  >
    <Image src='/social/linkedin.svg' alt='LinkedIn' width={32} height={32} />
  </a>
  <a
    href={shareLinks.reddit}
    target="_blank"
    rel="noopener noreferrer"
    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
    aria-label='Share on Reddit'
  >
    <Image src='/social/reddit.svg' alt='Reddit' width={32} height={32} />
  </a>
</div>
        </div>
        
        <div className='relative w-full h-100 tablet:h-[350px] mobile:h-[250px]'>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className='object-cover rounded-lg'
            priority
          />
        </div>
        
        {content && (
          <div 
            className='prose prose-lg max-w-none text-black'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </article>
  )
}

export default ArticleDetail