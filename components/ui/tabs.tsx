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
        return 'flex w-full';

      case 'pill':
      case 'default':
      default:
        return 'flex w-full rounded-2xl border border-subtle bg-fill-alpha-subtle p-1 shadow-tab h-[68px]';
    }
  };

  const getActiveBackgroundStyles = () => {
    switch (variant) {
      case 'pill':
        return 'rounded-2xl bg-surface border border-subtle shadow-tab-active';
      case 'default':
      default:
        return 'rounded-2xl bg-surface border border-subtle shadow-tab-active';
    }
  };

  const getButtonStyles = (active: boolean) => {
    switch (variant) {
      case 'underline':
        return `
          relative
          flex-1
          px-6
          py-3
          text-sm
          font-medium
          transition-colors
          duration-200
          ${
            active
              ? 'text-foreground'
              : 'text-muted hover:text-foreground'
          }
        `;

      case 'pill':
      case 'default':
      default:
        return `
          relative
          flex-1
          px-6
          py-3
          rounded-2xl
          text-sm
          font-medium
          transition-colors
          duration-200
          ${
            active
              ? 'text-foreground'
              : 'text-muted hover:text-foreground'
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
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    transition={spring}
                  />
                )}

                <span
                  className={cn(
                    'relative z-10 text-lg transition-all duration-200',
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
            className="mt-6"
          >
            {activeItem?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default Tabs;