'use client'

import Image from 'next/image'
import React from 'react'

interface SocialButtonProps {
  type: 'google' | 'apple' | 'facebook' | 'tiktok' | 'x'
  onClick?: () => void
  className?: string
}

const SocialButton = ({ type, onClick, className = '' }: SocialButtonProps) => {
  const getIconPath = () => {
    switch (type) {
      case 'google':
        return '/auth/google.svg'
      case 'apple':
        return '/auth/apple.svg'
      case 'facebook':
        return '/auth/facebook.svg'
      case 'tiktok':
        return '/auth/tiktok.svg'
      case 'x':
        return '/auth/x.svg'
      default:
        return ''
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'google':
        return 'bg-white hover:bg-gray-50 border border-gray-300'
      case 'apple':
        return 'bg-black hover:bg-gray-900 text-white'
      case 'facebook':
        return 'bg-[#1877F2] hover:bg-[#1666D0] text-white'
      case 'tiktok':
        return 'bg-[#000000] hover:bg-[#1a1a1a] text-white'
      case 'x':
        return 'bg-[#000000] hover:bg-[#1a1a1a] text-white'
      default:
        return 'bg-gray-100 hover:bg-gray-200'
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'google':
        return 'text-black'
      case 'apple':
        return 'text-white'
      case 'facebook':
        return 'text-white'
      case 'tiktok':
        return 'text-white'
      case 'x':
        return 'text-white'
      default:
        return 'text-black'
    }
  }

  const getLabel = () => {
    switch (type) {
      case 'google':
        return 'Google'
      case 'apple':
        return 'Apple'
      case 'facebook':
        return 'Facebook'
      case 'tiktok':
        return 'TikTok'
      case 'x':
        return 'X'
      default:
        return ''
    }
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-3
        h-12 px-6 rounded-lg
        font-medium text-sm
        transition-all duration-200
        ${getBackgroundColor()}
        ${getIconColor()}
        ${className}
      `}
    >
      <div className='relative w-5 h-5 shrink-0'>
        <Image
          src={getIconPath()}
          alt={`${getLabel()} icon`}
          fill
          className='object-contain'
        />
      </div>
      <span className='text-lg font-normal font-text'>Continue with {getLabel()}</span>
    </button>
  )
}

export default SocialButton