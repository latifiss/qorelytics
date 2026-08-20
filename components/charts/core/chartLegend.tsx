'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ChartLegendItem } from '@/components/charts/types/chart.types';

interface ChartLegendProps {
  items: ChartLegendItem[];
  onToggle?: (key: string) => void;
  className?: string;
}

export function ChartLegend({ items, onToggle, className = '' }: ChartLegendProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 px-1', className)}>
      {items.map((item, index) => (
        <motion.button
          key={item.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onToggle?.(item.key)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            !item.visible && 'opacity-40 line-through'
          )}
        >
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors duration-200"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-neutral-700 dark:text-neutral-300">{item.label}</span>
        </motion.button>
      ))}
    </div>
  );
}