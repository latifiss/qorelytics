'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { CloseIcon, ArrowTopRightIcon } from '@/public/icons/mono';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    tier: 'free' | 'pro' | 'team';
    avatar?: string;
  };
  onSignOut?: () => void;
  position?: 'center' | 'above';
  anchorRef?: React.RefObject<HTMLElement>;
}

const tierConfig = {
  free: {
    label: 'Free',
    buttonText: 'Upgrade',
    buttonColor: 'text-neutral-500 dark:text-neutral-400',
    borderColor: 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500',
  },
  pro: {
    label: 'Pro',
    buttonText: 'Manage',
    buttonColor: 'text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-300 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-600',
  },
  team: {
    label: 'Team',
    buttonText: 'Manage',
    buttonColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600',
  },
};

export function ProfileModal({
  isOpen,
  onClose,
  user,
  onSignOut,
  position = 'center',
  anchorRef,
}: ProfileModalProps) {
  const tier = tierConfig[user.tier || 'free'];
  const avatarSrc = user.avatar || '/images/default-avatar.svg';
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && position === 'above' && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isOpen, position, anchorRef]);

  const handleUpgradeClick = () => {
    onClose();
    window.location.href = '/pricing';
  };

  if (position === 'center') {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-[#22282b] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-tab relative overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close modal"
                >
                  <CloseIcon size={20} className="text-neutral-500 dark:text-neutral-400" />
                </button>

                <div className="px-6 pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="shrink-0">
                      <Image
                        src={avatarSrc}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-3 py-0.5 rounded-full text-xs font-semibold uppercase text-white"
                      style={{
                        background: 'linear-gradient(90deg, #e1181b, #ff4d4f, #eb2f96)',
                        backgroundSize: '200% 100%',
                        animation: 'rainbow-slide 3s linear infinite',
                      }}
                    >
                      {tier.label}
                    </span>
                    <button
                      onClick={handleUpgradeClick}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium transition-colors bg-transparent border',
                        tier.buttonColor,
                        tier.borderColor
                      )}
                    >
                      {tier.buttonText}
                      <div className="block dark:hidden">
                        <ArrowTopRightIcon size={12} color="#000000" />
                      </div>
                      <div className="hidden dark:block">
                        <ArrowTopRightIcon size={12} color="#ffffff" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800" />

                <div className="px-4 py-4 space-y-1.5">
                  <Link
                    href="/terms"
                    onClick={onClose}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                  >
                    Terms
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={onClose}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                  >
                    Privacy
                  </Link>
                  <button
                    onClick={() => {
                      onClose();
                      onSignOut?.();
                    }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed z-50 w-72"
            style={{
              top: modalPosition.top - 200,
              left: `calc(${modalPosition.left}px - 144px)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-[#22282b] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-tab overflow-hidden">
              <div className="px-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <Image
                      src={avatarSrc}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'py-0.5 rounded-full text-[10px] font-semibold',
                            'text-neutral-500 dark:text-neutral-400'
                          )}
                        >
                          You&apos;re on
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase text-white"
                          style={{
                            background: 'linear-gradient(90deg, #e1181b, #ff4d4f, #eb2f96)',
                            backgroundSize: '200% 100%',
                            animation: 'rainbow-slide 3s linear infinite',
                          }}
                        >
                          {tier.label}
                        </span>
                      </div>
                      <button
                        onClick={handleUpgradeClick}
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors bg-transparent border',
                          tier.buttonColor,
                          tier.borderColor
                        )}
                      >
                        {tier.buttonText}
                        <div className="block dark:hidden">
                          <ArrowTopRightIcon size={10} color="#000000" />
                        </div>
                        <div className="hidden dark:block">
                          <ArrowTopRightIcon size={10} color="#ffffff" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 mt-3" />

              <div className="px-2 py-2 space-y-0.5">
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/terms';
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  Terms
                </button>
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/privacy';
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  Privacy
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSignOut?.();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}