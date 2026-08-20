'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface HistogramRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

interface HistogramLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number | string;
  color: string;
  index?: number;
  dataLength: number;
}

function HistogramLabel({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value,
  color,
  index,
  dataLength,
}: HistogramLabelProps) {
  if (index !== dataLength - 1) return null;

  const displayValue =
    typeof value === 'number'
      ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : String(value ?? '');

  const paddingX = 8;
  const fontSize = 11;
  const charWidth = 6.5;
  const textWidth = Math.max(28, displayValue.length * charWidth);
  const rectWidth = textWidth + paddingX * 2;
  const rectHeight = 22;

  const labelX = x + width / 2 - rectWidth / 2;
  const labelY = y - rectHeight - 8;

  return (
    <g transform={`translate(${labelX}, ${labelY})`}>
      <rect width={rectWidth} height={rectHeight} rx={5} ry={5} fill={color} />
      <text
        x={rectWidth / 2}
        y={rectHeight / 2}
        dy="0.35em"
        textAnchor="middle"
        fill="#ffffff"
        fontSize={fontSize}
        fontWeight={600}
      >
        {displayValue}
      </text>
    </g>
  );
}

export function HistogramRenderer({
  data,
  config,
  colors,
  height = 300,
}: HistogramRendererProps) {
  const dimension =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'range';

  const numericKeys = Object.keys(data[0] || {}).filter(
    (key) => key !== dimension && typeof data[0]?.[key] === 'number'
  );

  const measure = config.measures?.[0] || numericKeys[0] || 'count';

  const chartData = data.map((row) => ({
    [dimension]: row[dimension] || 'Unknown',
    [measure]: Number(row[measure]) || 0,
    color: colors[0],
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 45, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />

        <XAxis
          dataKey={dimension}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }}
          className="dark:fill-neutral-400"
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }}
          width={60}
          className="dark:fill-neutral-400"
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

        <Bar
          dataKey={measure}
          fill={colors[0]}
          radius={[0, 0, 0, 0]}
          animationDuration={800}
          animationEasing="ease-out"
          barSize={30}
          activeBar={false}
        >
          <LabelList
            content={
              <HistogramLabel
                color={colors[0]}
                dataLength={chartData.length}
              />
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}