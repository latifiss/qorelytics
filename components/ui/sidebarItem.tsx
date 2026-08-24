import { ArrowTopRightIcon } from '@/public/icons/mono';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/cn';

interface SidebarItemProps {
  label: string;
  href: string;
  variant?: 'external' | 'internal';
  type?: 'desktop' | 'mobile';
  className?: string;
  textColor?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  variant = 'internal',
  type = 'desktop',
  className = '',
  textColor,
}) => {
  const isExternal = variant === 'external';
  const isDesktop = type === 'desktop';

  const getTextStyles = () => {
    if (isDesktop) {
      return 'text-[40px] text-neutral-900 dark:text-white';
    } else {
      return `text-[64px] ${textColor || 'text-white'}`;
    }
  };

  const getIconStyles = () => {
    const baseStyles = 'ml-2';
    if (isDesktop) {
      return `${baseStyles}`;
    } else {
      return `${baseStyles} ${textColor || 'text-white'}`;
    }
  };

  const getIconSize = () => {
    if (isDesktop) {
      return 30;
    }
    return 56;
  };

  const renderContent = () => (
    <>
      <span className={getTextStyles()}>{label}</span>
      {isExternal && (
        <>
          <span className={cn('ml-2', getIconStyles())}>
            <span className="block dark:hidden">
              <ArrowTopRightIcon
                size={getIconSize()}
                color="#000000"
              />
            </span>
            <span className="hidden dark:block">
              <ArrowTopRightIcon
                size={getIconSize()}
                color="#ffffff"
              />
            </span>
          </span>
        </>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center transition-opacity hover:opacity-80',
          className
        )}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center transition-opacity hover:opacity-80 w-full h-24 lg:h-15',
        className
      )}
    >
      {renderContent()}
    </Link>
  );
};

export default SidebarItem;