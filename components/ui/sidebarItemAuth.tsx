'use client';

import { ArrowRightIcon } from '@/public/icons/mono';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { cn } from '@/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themeContext';

interface SidebarItemAuthProps {
  label: string;
  href: string;
  variant?: 'external' | 'internal';
  type?: 'desktop' | 'mobile';
  state?: 'loggedin' | 'loggedout';
  avatarSrc?: string;
  className?: string;
  userData?: {
    name: string;
    email: string;
    tier: 'free' | 'pro' | 'team';
    plan?: string;
    avatar?: string;
  };
}

const SidebarItemAuth: React.FC<SidebarItemAuthProps> = ({
  label,
  href,
  variant = 'internal',
  type = 'desktop',
  state = 'loggedout',
  avatarSrc = '/images/default-avatar.svg',
  className = '',
  userData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExternal = variant === 'external';
  const isDesktop = type === 'desktop';
  const isLoggedIn = state === 'loggedin';
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getTextStyles = () => {
    if (isDesktop) {
      return 'text-[40px] text-foreground';
    } else {
      return 'text-[64px] text-white';
    }
  };

  const getIconStyles = () => {
    const baseStyles = 'ml-2 flex-shrink-0';
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
      <span className={getTextStyles()}>{label}</span>
      {isExternal && !isLoggedIn && (
        <ArrowRightIcon
          size={getIconSize()}
          className={getIconStyles()}
          color={getIconColor()}
        />
      )}
    </>
  );

  // If logged in, render as button with click handler
  if (isLoggedIn) {
    return (
      <>
        <button
          onClick={handleClick}
          className={cn(
            'inline-flex items-center transition-opacity hover:opacity-80 w-full h-15',
            className
          )}
        >
          {renderContent()}
        </button>

        {/* Profile Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-surface-elevated rounded-2xl border border-subtle shadow-tab p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="shrink-0">
                      <Image
                        src={resolvedAvatarSrc}
                        alt="Profile"
                        width={64}
                        height={64}
                        className="rounded-full object-cover border-2 border-subtle"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {userData?.name || 'User'}
                      </h3>
                      <p className="text-sm text-muted truncate">
                        {userData?.email || 'user@email.com'}
                      </p>
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-fill-alpha-subtle border border-subtle">
                    <span className="text-sm font-medium text-foreground">Current Plan</span>
                    <span className={cn(
                      'ml-auto px-3 py-1 rounded-full text-xs font-semibold uppercase',
                      userData?.tier === 'pro' && 'bg-accent-alpha-yellow text-warning',
                      userData?.tier === 'team' && 'bg-accent-alpha-green text-success',
                      (!userData?.tier || userData?.tier === 'free') && 'bg-fill-alpha-muted text-muted'
                    )}>
                      {userData?.tier || 'Free'}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-subtle my-4" />

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        // Navigate to profile
                        window.location.href = '/profile';
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-fill-alpha-subtle transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        // Navigate to settings
                        window.location.href = '/settings';
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-fill-alpha-subtle transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        // Handle logout
                        localStorage.removeItem('token');
                        window.location.href = '/signin';
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-subtle transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // If logged out, render as link
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
        'inline-flex items-center transition-opacity hover:opacity-80 w-full h-15',
        className
      )}
    >
      {renderContent()}
    </Link>
  );
};

export default SidebarItemAuth;