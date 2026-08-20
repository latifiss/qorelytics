'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { AggregationType } from '@/components/charts/types/chart.types';

interface AggregationSelectorProps {
  value: AggregationType;
  onChange: (value: AggregationType) => void;
  className?: string;
}

const AGGREGATIONS: { value: AggregationType; label: string }[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'average', label: 'Avg' },
  { value: 'count', label: 'Count' },
  { value: 'distinctCount', label: 'Distinct' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'median', label: 'Median' },
  { value: 'percentage', label: '%' },
  { value: 'runningTotal', label: 'Running' },
];

export function AggregationSelector({
  value,
  onChange,
  className = '',
}: AggregationSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {AGGREGATIONS.map((agg) => (
        <button
          key={agg.value}
          onClick={() => onChange(agg.value)}
          className={cn(
            'px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200',
            value === agg.value
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          {agg.label}
        </button>
      ))}
    </div>
  );
}