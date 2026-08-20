'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  className = '',
  formatter = (v) => v.toLocaleString(),
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'rounded-lg border border-neutral-200 dark:border-neutral-800',
          'bg-white dark:bg-[#22282b] shadow-tab',
          'px-3 py-2 min-w-[140px]',
          className
        )}
      >
        {label && (
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
            {label}
          </div>
        )}
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color || '#7FF86C' }}
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {formatter(item.value)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}