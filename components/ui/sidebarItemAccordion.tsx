"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ClipLoader } from 'react-spinners';
import { ArrowTopRightIcon, DownIcon, UpIcon } from '@/public/icons/mono';

interface SidebarItemAccordionProps {
  label: string;
  items?: Array<{
    label: string;
    href: string;
    variant?: 'external' | 'internal';
  }>;
  type?: 'desktop' | 'mobile';
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

const SidebarItemAccordion: React.FC<SidebarItemAccordionProps> = ({
  label,
  items = [],
  type = 'desktop',
  className = '',
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const isDesktop = type === 'desktop';

  const getTextStyles = () =>
    isDesktop
      ? 'text-[40px] text-foreground leading-none'
      : 'text-[64px] text-white leading-none';

  const getIconColor = () =>
    isDesktop ? 'var(--text-primary)' : '#ffffff';

  const getIconSize = () => 40;

  const getChildTextStyles = () =>
    isDesktop
      ? 'text-[30px] text-foreground'
      : 'text-[30px] text-white';

  const getChildIconStyles = () =>
    isDesktop
      ? 'ml-2 text-foreground'
      : 'ml-2 text-white';

  const getChildIconColor = () =>
    isDesktop ? 'var(--text-primary)' : '#ffffff';

  const getChildIconSize = () => 32;

  useEffect(() => {
    if (isOpen && !hasLoaded && items.length > 0) {
      // Schedule setting loading state asynchronously to avoid
      // synchronous setState inside the effect body which can
      // trigger cascading renders. Use a microtask timeout.
      const startTimer = setTimeout(() => setIsLoading(true), 0);

      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasLoaded(true);
      }, 700);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen, hasLoaded, items.length]);

  const handleToggle = () => {
    const next = !isOpen;

    setIsOpen(next);

    if (!next) {
      setHasLoaded(false);
    }

    onToggle?.(next);
  };

  const customEase: Transition['ease'] = [0.22, 1, 0.36, 1] as unknown as Transition['ease'];

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -12,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: customEase,
      } as Transition,
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const renderChildItem = (item: {
    label: string;
    href: string;
    variant?: 'external' | 'internal';
  }) => {
    const isExternal = item.variant === 'external';

    const content = (
      <>
        <span className={getChildTextStyles()}>
          {item.label}
        </span>

        {isExternal && (
          <ArrowTopRightIcon
            size={getChildIconSize()}
            className={getChildIconStyles()}
            color={getChildIconColor()}
          />
        )}
      </>
    );

    return (
      <motion.div
        key={item.href}
        variants={childVariants}
      >
        {isExternal ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center transition-opacity hover:opacity-80 pl-4',
              className
            )}
          >
            {content}
          </a>
        ) : (
          <Link
            href={item.href}
            className={cn(
              'inline-flex items-center transition-opacity hover:opacity-80 pl-4',
              className
            )}
          >
            {content}
          </Link>
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      <button
        onClick={handleToggle}
        className={cn(
            'flex w-full items-center justify-start gap-6 text-left hover:opacity-80 transition-opacity h-24 lg:h-auto',
            className
         )}
      >
        <motion.span
          className={cn(
            getTextStyles(),
            'relative inline-block pb-2 mt-3'
          )}
        >
          {label}

          <motion.span
            initial={{ width: '0%' }}
            animate={{ width: isOpen ? '100%' : '0%' }}
            transition={{ duration: 0.35, ease: customEase } as Transition}
            className={cn('absolute left-0 bottom-0 h-0.75 z-10')}
            style={{
              width: isOpen ? '100%' : '0%',
              backgroundColor: '#7FF86C',
            }}
          />
        </motion.span>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            {isOpen ? (
              <motion.div
                key="open"
                initial={{
                  opacity: 0,
                  y: 6,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.25,
                  ease: customEase,
                } as Transition}
              >
                <UpIcon
                  size={getIconSize()}
                                  color={getIconColor()}
                                  className="-ml-4 mt-6"
                />
              </motion.div>
            ) : (
              <motion.div
                key="closed"
                initial={{
                  opacity: 0,
                  y: -6,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 6,
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.25,
                  ease: customEase,
                } as Transition}
              >
                <DownIcon
                  size={getIconSize()}
                  color={getIconColor()}
                  className="-ml-4 mt-6"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.55,
                ease: customEase,
              } as Transition,
              opacity: {
                duration: 0.25,
              },
            } as Transition}
            className="overflow-hidden"
          >
            <motion.div
              initial={{
                y: -12,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -8,
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
                delay: 0.1,
                ease: customEase,
              } as Transition}
              className="mt-2"
            >
              {isLoading ? (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="flex justify-center py-8"
                >
                  <ClipLoader
                    color="#7FF86C"
                    size={40}
                  />
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-2 pb-3"
                >
                  {items.map(renderChildItem)}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarItemAccordion;