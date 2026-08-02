'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { FaCircleCheck } from 'react-icons/fa6';

type BarVariant = 'default' | 'flat' | 'grid';

interface BarOptionProps {
  label: string;
  icon?: React.ReactNode;
  iconSize?: number;
  selected?: boolean;
  onClick?: () => void;
  variant?: BarVariant;
  className?: string;
}

const BarOption: React.FC<BarOptionProps> = ({
  label,
  icon,
  iconSize = 24,
  selected = false,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const getContainerStyles = () => {
    switch (variant) {
      case 'default':
        return 'w-fit flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200';
      case 'flat':
        return 'w-fit flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200';
      case 'grid':
        return 'w-fit flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-200';
      default:
        return 'w-fit flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200';
    }
  };

  const getIconContainerStyles = () => {
    if (variant === 'grid') {
      return `flex-shrink-0 flex items-center justify-center`;
    }
    return 'flex-shrink-0';
  };

  const getIconWrapperStyles = () => {
    if (variant === 'grid') {
      return `flex-shrink-0 flex items-center justify-center`;
    }
    return 'flex-shrink-0';
  };

  const getLabelStyles = () => {
    switch (variant) {
      case 'default':
        return 'text-foreground whitespace-nowrap';
      case 'flat':
        return 'text-foreground whitespace-nowrap';
      case 'grid':
        return 'text-foreground text-sm whitespace-nowrap';
      default:
        return 'text-foreground whitespace-nowrap';
    }
  };

  const getCheckIconSize = () => {
    switch (variant) {
      case 'default':
        return 20;
      case 'flat':
        return 18;
      case 'grid':
        return 16;
      default:
        return 20;
    }
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        getContainerStyles(),
        selected
          ? 'border-black bg-black/5 dark:border-white dark:bg-white/10'
          : 'border-subtle hover:border-border hover:bg-fill-alpha-subtle',
        variant === 'grid' && 'min-h-12',
        className
      )}
      style={{
        ...(variant === 'grid' && icon && {
          paddingLeft: iconSize > 32 ? '8px' : '12px',
        }),
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className={getIconWrapperStyles()}>
            <div
              className={cn(
                'flex items-center justify-center',
                variant === 'grid' && `w-[${Math.min(iconSize, 56)}px]`
              )}
              style={{
                width: variant === 'grid' ? Math.min(iconSize, 56) : 'auto',
                minWidth: variant === 'grid' ? 24 : 'auto',
              }}
            >
              <div
                className={cn(
                  'flex items-center justify-center',
                  variant === 'grid' && 'w-full'
                )}
                style={{
                  ...(variant === 'grid' && {
                    width: Math.min(iconSize, 56),
                    height: Math.min(iconSize, 56),
                  }),
                }}
              >
                {icon}
              </div>
            </div>
          </div>
        )}

        <span className={cn(getLabelStyles())}>{label}</span>
      </div>

      {selected && (
        <FaCircleCheck
          className="shrink-0 text-black dark:text-white ml-2"
          size={getCheckIconSize()}
        />
      )}
    </motion.button>
  );
};

export default BarOption;