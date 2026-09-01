'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ChartType } from '@/components/charts/types/chart.types';

interface ChartToolbarProps {
  chartType: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
  onExport?: () => void;
  onFullscreen?: () => void;
  className?: string;
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'pie', label: 'Pie' },
  { value: 'donut', label: 'Donut' },
];

export function ChartToolbar({
  chartType,
  onChartTypeChange,
  onExport,
  onFullscreen,
  className = '',
}: ChartToolbarProps) {
  return (
    <div className={cn('flex items-center gap-2 p-2 border-b border-neutral-200 dark:border-neutral-800', className)}>
      <div className="flex items-center gap-1">
        {CHART_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onChartTypeChange?.(type.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
              chartType === type.value
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <button
          onClick={onExport}
          className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button
          onClick={onFullscreen}
          className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m0 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m0 0l5-5" />
          </svg>
        </button>
      </div>
    </div>
  );
}