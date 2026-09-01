'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type TabVariant = 'default' | 'pill' | 'underline';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  variant?: TabVariant;
  defaultActiveId?: string;
  className?: string;
  onTabChange?: (id: string) => void;
}

const spring = {
  type: 'spring',
  stiffness: 650,
  damping: 42,
  mass: 0.8,
} as const;

const Tabs: React.FC<TabsProps> = ({
  items,
  variant = 'default',
  defaultActiveId,
  className = '',
  onTabChange,
}) => {
  const [activeId, setActiveId] = useState(
    defaultActiveId ?? items[0]?.id ?? ''
  );

  const activeItem = items.find((item) => item.id === activeId);

  const handleTabChange = (id: string) => {
    setActiveId(id);
    onTabChange?.(id);
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'underline':
        return 'flex w-full border-b border-neutral-200 dark:border-neutral-800';

      case 'pill':
      case 'default':
      default:
        return 'flex w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-1 shadow-sm h-[68px]';
    }
  };

  const getActiveBackgroundStyles = () => {
    switch (variant) {
      case 'pill':
        return 'rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md';
      case 'default':
      default:
        return 'rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md';
    }
  };

  const getButtonStyles = (active: boolean) => {
    switch (variant) {
      case 'underline':
        return `
          relative
          flex-1
          px-4
          py-3
          text-sm
          font-medium
          transition-colors
          duration-200
          ${
            active
              ? 'text-neutral-900 dark:text-white'
              : 'text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white'
          }
        `;

      case 'pill':
      case 'default':
      default:
        return `
          relative
          flex-1
          px-4
          py-3
          rounded-2xl
          text-sm
          font-medium
          transition-colors
          duration-200
          ${
            active
              ? 'text-neutral-900 dark:text-white'
              : 'text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white'
          }
        `;
    }
  };

  return (
    <LayoutGroup>
      <div className={`w-full ${className}`}>
        <div className={getContainerStyles()}>
          {items.map((item) => {
            const active = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={getButtonStyles(active)}
              >
                {active && variant !== 'underline' && (
                  <motion.div
                    layoutId="tabs-indicator"
                    className={`absolute inset-0 ${getActiveBackgroundStyles()}`}
                    transition={spring}
                  />
                )}

                {active && variant === 'underline' && (
                  <motion.div
                    layoutId="tabs-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white"
                    transition={spring}
                  />
                )}

                <span
                  className={cn(
                    'relative z-10 text-sm transition-all duration-200',
                    active ? 'font-medium' : 'font-regular'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
            transition={{
              duration: 0.25,
              ease: 'easeInOut',
            }}
            className="mt-6 text-neutral-900 dark:text-white"
          >
            {activeItem?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default Tabs;