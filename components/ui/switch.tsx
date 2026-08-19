'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { useTheme } from '@/context/themeContext';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'right';
}

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className = '',
  size = 'md',
  label,
  labelPosition = 'right',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  const sizes = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'size-3.5',
      offset: 'translate-x-[14px]',
      font: 'text-xs',
      gap: 'gap-2',
      padding: 'left-0.5',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'size-[18px]',
      offset: 'translate-x-[18px]',
      font: 'text-sm',
      gap: 'gap-2.5',
      padding: 'left-0.5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'size-[22px]',
      offset: 'translate-x-[24px]',
      font: 'text-base',
      gap: 'gap-3',
      padding: 'left-0.5',
    },
  };

  const sizeClasses = sizes[size];

  const trackColor = disabled
    ? isDark
      ? 'bg-neutral-700/50'
      : 'bg-neutral-300'
    : checked
      ? isDark
        ? 'bg-neutral-500'
        : 'bg-neutral-800'
      : isDark
        ? 'bg-neutral-700'
        : 'bg-neutral-300';

  const thumbColor = disabled
    ? isDark
      ? 'bg-neutral-600'
      : 'bg-neutral-400'
    : isDark
      ? 'bg-neutral-300'
      : 'bg-white';

  const switchElement = (
    <label
      className={cn(
        'inline-flex items-center select-none',
        sizeClasses.gap,
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
        className
      )}
    >
      {label && labelPosition === 'left' && (
        <span
          className={cn(
            'font-medium',
            sizeClasses.font,
            disabled
              ? 'text-neutral-500'
              : 'text-neutral-800 dark:text-neutral-400'
          )}
        >
          {label}
        </span>
      )}

      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
        className="sr-only"
        aria-label={label || 'Toggle switch'}
      />

      <span
        className={cn(
          'relative inline-flex shrink-0 items-center',
          sizeClasses.track,
          'rounded-full',
          'transition-colors duration-300 ease-out',
          trackColor
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 left-0.5',
            '-translate-y-1/2',
            sizeClasses.thumb,
            'rounded-full',
            'shadow-sm',
            'ring-1 ring-black/10 dark:ring-white/5',
            'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            checked && sizeClasses.offset,
            thumbColor
          )}
        />
      </span>

      {label && labelPosition === 'right' && (
        <span
          className={cn(
            'font-medium',
            sizeClasses.font,
            disabled
              ? 'text-neutral-500'
              : 'text-neutral-800 dark:text-neutral-400'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );

  return switchElement;
};

export default Switch;