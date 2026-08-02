'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { ClipLoader } from 'react-spinners';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'skip';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  size = 'md',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-black text-white shadow-lg hover:opacity-90 dark:bg-white dark:text-black';
      case 'secondary':
        return 'bg-transparent text-foreground hover:bg-fill-alpha-subtle border border-subtle';
      case 'skip':
        return 'bg-transparent text-muted hover:text-foreground';
      default:
        return 'bg-black text-white shadow-lg hover:opacity-90';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-1.5 text-xs';
      case 'md':
        return 'px-6 py-2.5 text-sm lg:px-8 lg:py-3 lg:text-base';
      case 'lg':
        return 'px-8 py-3 text-base lg:px-10 lg:py-4 lg:text-lg';
      default:
        return 'px-6 py-2.5 text-sm lg:px-8 lg:py-3 lg:text-base';
    }
  };

  const getWidthStyles = () => {
    return fullWidth ? 'w-full' : 'w-auto';
  };

  const getLoadingColor = () => {
    switch (variant) {
      case 'primary':
        return 'var(--text-on-button)';
      case 'secondary':
        return 'var(--text-primary)';
      case 'skip':
        return 'var(--text-muted)';
      default:
        return 'var(--text-on-button)';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2',
        getVariantStyles(),
        getSizeStyles(),
        getWidthStyles(),
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        variant === 'primary' && 'hover:shadow-xl',
        className
      )}
    >
      {loading ? (
        <>
          <ClipLoader
            color={getLoadingColor()}
            size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            loading={loading}
          />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;