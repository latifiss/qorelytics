'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface CommandProps {
  label: string;
  className?: string;
}

const Command: React.FC<CommandProps> = ({ label, className = '' }) => {
  const renderKeys = () => {
    const keys = label.split('+').map((key) => key.trim());
    
    return keys.map((key, index) => (
      <React.Fragment key={index}>
        <kbd
          className={cn(
            'px-1.5 py-0.5 text-[10px] font-mono font-medium leading-none',
            'bg-fill-alpha-subtle border border-subtle text-foreground',
            'shadow-[0_1px_0_rgba(0,0,0,0.15),0_2px_0_rgba(0,0,0,0.08)]',
            'dark:bg-gray-solid-800 dark:border-gray-solid-700 dark:text-white',
            'dark:shadow-[0_1px_0_rgba(255,255,255,0.08),0_2px_0_rgba(0,0,0,0.4)]',
            'transform hover:transalte-y-x hover:shadow-[0_0px_0_rgba(0,0,0,0.15),0_1px_0_rgba(0,0,0,0.08)]',
            'transition-all duration-100',
            'relative',
            'before:absolute before:inset-0 before:bg-linear-to-b before:from-white/20 before:to-transparent before:opacity-50',
            'dark:before:from-white/5 dark:before:to-transparent'
          )}
        >
          <span className="relative z-10">{key}</span>
        </kbd>
        {index < keys.length - 1 && (
          <span className="text-muted text-[10px] font-medium px-0.5">+</span>
        )}
      </React.Fragment>
    ));
  };

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {renderKeys()}
    </span>
  );
};

export default Command;