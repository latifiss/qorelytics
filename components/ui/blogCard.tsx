import ClockIcon from '@/public/icons/mono/clock'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface BlogCardProps {
  title: string
  date: string
  imageUrl: string
  imageAlt?: string
  tags?: TagType[]
  className?: string
  href?: string
}

export type TagType = 
  | 'announcement'
  | 'creators'
  | 'tutorials'
  | 'insights'
  | 'trends'
  | 'productivity'
  | 'visualization'
  | 'strategy'
  | 'community'
  | 'innovation'


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
        <Tag 
          key={`${tag}-${index}`} 
          type={tag} 
        />
      ))}
    </div>
  )
}


const BlogCard = ({
  title,
  date,
  imageUrl,
  imageAlt = 'Blog Image',
  tags = [],
  className = '',
  href,
}: BlogCardProps) => {

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })


  return (
    <Link
      href={href ?? '#'}
      className={`flex flex-col items-center gap-5.75 tablet:gap-5 mobile:gap-4 w-full min-w-49.25 max-w-full ${className}`}
    >

      <div className='h-74.75! relative tablet:w-[197px] tablet:h-[197px] mobile:w-full mobile:h-[317px]'>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={287}
          height={291}
          className='object-cover rounded-lg w-full! h-full!'
          priority={false}
        />
      </div>


      <div className='flex flex-col items-start gap-0 w-full'>

        <TagGroup tags={tags} />

        <div className='flex flex-col items-start gap-4.75 tablet:gap-5 mobile:gap-4 w-full'>

          <h2 className='text-4xl font-regular text-black leading-tight line-clamp-3 tablet:text-2xl mobile:text-[25px]'>
            {title}
          </h2>


          <div className='flex items-center justify-start gap-1'>
            <ClockIcon size={18} color='#13151B' />

            <time 
              className='text-md font-regular text-black tablet:text-sm mobile:text-sm' 
              dateTime={date}
            >
              {formattedDate}
            </time>
          </div>

        </div>

      </div>

    </Link>
  )
}

export default BlogCard