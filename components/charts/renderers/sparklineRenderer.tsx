'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface SparklineRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

export function SparklineRenderer({
  data,
  config,
  colors,
  height = 300,
}: SparklineRendererProps) {
  const dimension =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'index';

  const numericKeys = Object.keys(data[0] || {}).filter(
    (key) => key !== dimension && typeof data[0]?.[key] === 'number'
  );

  const measure = config.measures?.[0] || numericKeys[0] || 'value';

  const chartData = data.map((row, index) => ({
    [dimension]: row[dimension] || index + 1,
    [measure]: Number(row[measure]) || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No data available</p>
      </div>
    );
  }

  const values = chartData.map(row => Number(row[measure]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.2 || 10;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis
          dataKey={dimension}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={false}
          domain={[min - padding, max + padding]}
        />
        <Tooltip
          cursor={false}
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              payload={payload}
              label={label}
              formatter={(v) => {
                if (typeof v === 'number') return v.toLocaleString();
                return String(v);
              }}
            />
          )}
        />
        <Line
          type="monotone"
          dataKey={measure}
          stroke={colors[0]}
          strokeWidth={2}
          dot={false}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}