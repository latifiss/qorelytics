import { ArrowRightIcon } from '@/public/icons/mono';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/cn';

interface SidebarItemNewProps {
  label: string;
  href: string;
  variant?: 'external' | 'internal';
  type?: 'desktop' | 'mobile';
  className?: string;
}

const SidebarItemNew: React.FC<SidebarItemNewProps> = ({
  label,
  href,
  variant = 'internal',
  type = 'desktop',
  className = '',
}) => {
  const isExternal = variant === 'external';
  const isDesktop = type === 'desktop';

  const getTextStyles = () => {
    if (isDesktop) {
      return 'text-[40px] text-foreground';
    } else {
      return 'text-[64px] text-white';
    }
  };

  const getIconStyles = () => {
    const baseStyles = 'ml-2';
    if (isDesktop) {
      return `${baseStyles} text-foreground`;
    } else {
      return `${baseStyles} text-white`;
    }
  };

  const getIconColor = () => {
    if (isDesktop) {
      return 'var(--text-primary)';
    } else {
      return '#ffffff';
    }
  };

  const getIconSize = () => {
    if (isDesktop) {
      return 40;
    }
    return 56;
  };

  const renderContent = () => (
    <>
      <span className={getTextStyles()}>{label}</span>
      {isExternal && (
        <ArrowRightIcon
          size={getIconSize()}
          className={getIconStyles()}
          color={getIconColor()}
        />
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

export default SidebarItemNew;