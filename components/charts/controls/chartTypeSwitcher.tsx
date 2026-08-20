'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ChartType } from '@/components/charts/types/chart.types';

interface ChartTypeSwitcherProps {
  types: ChartType[];
  selected: ChartType;
  onChange: (type: ChartType) => void;
  className?: string;
}

const CHART_TYPE_LABELS: Record<ChartType, string> = {
  bar: 'Bar',
  horizontalBar: 'H-Bar',
  groupedBar: 'Grouped',
  stackedBar: 'Stacked',
  hundredStackedBar: '100%',
  divergingBar: 'Diverging',
  lollipop: 'Lollipop',
  dotPlot: 'Dot Plot',
  line: 'Line',
  multiLine: 'Multi-Line',
  stepLine: 'Step',
  cumulativeLine: 'Cumulative',
  area: 'Area',
  multiArea: 'Multi-Area',
  stackedArea: 'Stacked Area',
  hundredStackedArea: '100% Area',
  pie: 'Pie',
  donut: 'Donut',
  donutWithKpi: 'Donut+KPI',
  nestedDonut: 'Nested',
};

export function ChartTypeSwitcher({
  types,
  selected,
  onChange,
  className = '',
}: ChartTypeSwitcherProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {types.map((type) => (
        <motion.button
          key={type}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(type)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
            selected === type
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          )}
        >
          {CHART_TYPE_LABELS[type] || type}
        </motion.button>
      ))}
    </div>
  );
}