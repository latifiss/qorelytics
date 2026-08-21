'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { PDFIcon } from '@/public/icons/color';

interface DownloadAsProps {
  onClick?: () => void;
  className?: string;
}

export function DownloadAs({ onClick, className = '' }: DownloadAsProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 h-5 px-2 rounded-full',
        'bg-transparent',
        'border border-neutral-200/60 dark:border-neutral-700/50',
        'text-neutral-500 dark:text-neutral-400',
        'text-[10px] font-medium',
        'transition-colors duration-200',
        'hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30',
        'hover:text-neutral-600 dark:hover:text-neutral-300',
        'hover:border-neutral-300 dark:hover:border-neutral-600',
        className
      )}
    >
      <span>Download as PDF</span>
      <PDFIcon size={11} />
    </button>
  );
}