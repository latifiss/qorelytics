'use client';

import { ArrowRightIcon } from '@/public/icons/mono';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themeContext';
import { ProfileModal } from '@/components/ui/profileModal';

interface SidebarItemAuthProps {
  label: string;
  href: string;
  variant?: 'external' | 'internal';
  type?: 'desktop' | 'mobile';
  state?: 'loggedin' | 'loggedout';
  avatarSrc?: string;
  className?: string;
  textColor?: string;
  userData?: {
    name: string;
    email: string;
    tier: 'free' | 'pro' | 'team';
    plan?: string;
    avatar?: string;
  };
  onSignOut?: () => void;
}

const SidebarItemAuth: React.FC<SidebarItemAuthProps> = ({
  label,
  href,
  variant = 'internal',
  type = 'desktop',
  state = 'loggedout',
  avatarSrc = '/images/default-avatar.svg',
  className = '',
  textColor,
  userData,
  onSignOut,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const isExternal = variant === 'external';
  const isDesktop = type === 'desktop';
  const isLoggedIn = state === 'loggedin';
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isModalOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isModalOpen]);

  const getDisplayName = () => {
    if (isLoggedIn && userData?.name) {
      if (!isDesktop) {
        return userData.name.split(' ')[0];
      }
      return userData.name;
    }
    return label;
  };

  const getTextStyles = () => {
    if (isDesktop) {
      return 'text-[40px] text-neutral-900 dark:text-white';
    } else {
      return `text-[64px] ${textColor || 'text-white'}`;
    }
  };

  const getIconStyles = () => {
    const baseStyles = 'ml-2 flex-shrink-0';
    if (isDesktop) {
      return `${baseStyles} text-neutral-900 dark:text-white`;
    } else {
      return `${baseStyles} ${textColor || 'text-white'}`;
    }
  };

  const getIconColor = () => {
    if (isDesktop) {
      return undefined;
    } else {
      if (textColor === 'text-black dark:text-white') {
        return '#000000';
      }
      return '#ffffff';
    }
  };

  const getIconSize = () => {
    if (isDesktop) {
      return 40;
    }
    return 56;
  };

  const getAvatarSize = () => {
    if (isDesktop) {
      return 40;
    }
    return 56;
  };

  const resolvedAvatarSrc = userData?.avatar || avatarSrc?.trim() || '/images/default-avatar.svg';

  const handleClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
    onSignOut?.();
  };

  const renderContent = () => (
    <>
      {isLoggedIn && (
        <div className="mr-4 shrink-0 rounded-full">
          <Image
            src={resolvedAvatarSrc}
            alt="Avatar"
            width={getAvatarSize()}
            height={getAvatarSize()}
            className="rounded-full object-cover"
          />
        </div>
      )}
      <span className={cn(getTextStyles(), 'min-w-0 truncate whitespace-nowrap')}>{getDisplayName()}</span>
      {isExternal && !isLoggedIn && (
        <ArrowRightIcon
          size={getIconSize()}
          className={getIconStyles()}
          color={getIconColor()}
        />
      )}
    </>
  );

  if (isLoggedIn) {
    return (
      <>
        <button
          ref={buttonRef}
          onClick={handleClick}
          className={cn(
            'inline-flex items-center transition-opacity hover:opacity-80 w-full h-24 lg:h-15 relative',
            className
          )}
        >
          {renderContent()}
        </button>

        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={{
            name: userData?.name || 'User',
            email: userData?.email || 'user@email.com',
            tier: userData?.tier || 'free',
            avatar: resolvedAvatarSrc,
          }}
          onSignOut={handleSignOut}
          position="above"
          anchorRef={buttonRef}
        />
      </>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center transition-opacity hover:opacity-80 w-full h-24 lg:h-15',
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
        'inline-flex items-center transition-opacity hover:opacity-80 w-full h-24 lg:h-16',
        className
      )}
    >
      {renderContent()}
    </Link>
  );
};

export default SidebarItemAuth;