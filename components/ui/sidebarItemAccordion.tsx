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
  items?: Array<{ label: string; href: string; variant?: 'external' | 'internal'; onClick?: () => void }>;
  children?: React.ReactNode;
  type?: 'desktop' | 'mobile';
  className?: string;
  textColor?: string;
  onToggle?: (isOpen: boolean) => void;
}

const SidebarItemAccordion: React.FC<SidebarItemAccordionProps> = ({
  label,
  items = [],
  children,
  type = 'desktop',
  className = '',
  textColor,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isDesktop = type === 'desktop';

  const getTextStyles = () => isDesktop ? 'text-[40px] text-neutral-900 dark:text-white leading-none' : `text-[64px] ${textColor || 'text-white'} leading-none`;
  const getIconColor = () => !isDesktop ? (textColor === 'text-black dark:text-white' ? '#000000' : '#ffffff') : undefined;
  const getChildTextStyles = () => isDesktop ? 'text-[30px] text-neutral-900 dark:text-white' : `text-[30px] ${textColor || 'text-white'}`;
  const getChildIconStyles = () => isDesktop ? 'ml-2 text-neutral-900 dark:text-white' : `ml-2 ${textColor || 'text-white'}`;
  const getChildIconColor = () => !isDesktop ? (textColor === 'text-black dark:text-white' ? '#000000' : '#ffffff') : undefined;
  const customEase: Transition['ease'] = [0.22, 1, 0.36, 1] as unknown as Transition['ease'];

  useEffect(() => {
    if (isOpen && !hasLoaded && items.length > 0) {
      const startTimer = setTimeout(() => setIsLoading(true), 0);
      const timer = setTimeout(() => { setIsLoading(false); setHasLoaded(true) }, 700);
      return () => { clearTimeout(startTimer); clearTimeout(timer) };
    }
  }, [isOpen, hasLoaded, items.length]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) setHasLoaded(false);
    onToggle?.(next);
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: -12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: customEase } as Transition },
  };

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const renderChildItem = (item: { label: string; href: string; variant?: 'external' | 'internal'; onClick?: () => void }) => {
    const isExternal = item.variant === 'external';
    const content = <><span className={getChildTextStyles()}>{item.label}</span>{isExternal && <ArrowTopRightIcon size={32} className={getChildIconStyles()} color={getChildIconColor()} />}</>;
    return (
      <motion.div key={`${item.href}-${item.label}`} variants={childVariants}>
        {isExternal ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={item.onClick} className={cn('inline-flex items-center transition-opacity hover:opacity-80 pl-4', className)}>{content}</a>
        ) : (
          <Link href={item.href} onClick={item.onClick} className={cn('inline-flex items-center transition-opacity hover:opacity-80 pl-4', className)}>{content}</Link>
        )}
      </motion.div>
    );
  };

  const content = children ?? items.map(renderChildItem);

  return (
    <div className="w-full">
      <button onClick={handleToggle} className={cn('flex w-full items-center justify-start gap-6 text-left hover:opacity-80 transition-opacity h-24 lg:h-auto', className)}>
        <motion.span className={cn(getTextStyles(), 'relative inline-block pb-2 mt-3')}>
          {label}
          <motion.span initial={{ width: '0%' }} animate={{ width: isOpen ? '100%' : '0%' }} transition={{ duration: 0.35, ease: customEase } as Transition} className="absolute left-0 bottom-0 h-0.75 z-10" style={{ backgroundColor: '#7FF86C' }} />
        </motion.span>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div key="open" initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.9 }} transition={{ duration: 0.25, ease: customEase } as Transition}>
                <div className="block dark:hidden"><UpIcon size={40} color={getIconColor() || '#000000'} className="-ml-4 mt-6" /></div>
                <div className="hidden dark:block"><UpIcon size={40} color="#ffffff" className="-ml-4 mt-6" /></div>
              </motion.div>
            ) : (
              <motion.div key="closed" initial={{ opacity: 0, y: -6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.9 }} transition={{ duration: 0.25, ease: customEase } as Transition}>
                <div className="block dark:hidden"><DownIcon size={40} color={getIconColor() || '#000000'} className="-ml-4 mt-6" /></div>
                <div className="hidden dark:block"><DownIcon size={40} color="#ffffff" className="-ml-4 mt-6" /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { duration: 0.55, ease: customEase } as Transition, opacity: { duration: 0.25 } } as Transition} className="overflow-hidden">
            <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.35, delay: 0.1, ease: customEase } as Transition} className="mt-2">
              {isLoading ? <div className="flex justify-center py-8"><ClipLoader color="#7FF86C" size={40} /></div> : <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2 pb-3">{content}</motion.div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarItemAccordion;
