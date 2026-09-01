'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface HorizontalBarRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

interface BarValueLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number | string;
  color: string;
  index?: number;
  dataLength: number;
}

function BarValueLabel({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value,
  color,
  index,
  dataLength,
}: BarValueLabelProps) {
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

  const labelX = x + width + 8;
  const labelY = y + height / 2 - rectHeight / 2;

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

export function HorizontalBarRenderer({
  data,
  config,
  colors,
  height = 300,
}: HorizontalBarRendererProps) {
  const dimension =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'name';

  const numericKeys = Object.keys(data[0] || {}).filter(
    (key) => key !== dimension && typeof data[0]?.[key] === 'number'
  );

  const visibleMeasures =
    config.visibleSeries && config.visibleSeries.length > 0
      ? numericKeys.filter((key) => !config.visibleSeries?.includes(key))
      : numericKeys;

  const chartData = data.map((row) => {
    const result: Record<string, any> = {
      [dimension]: row[dimension] || 'Unknown',
    };
    numericKeys.forEach((key) => {
      result[key] = Number(row[key]) || 0;
    });
    return result;
  });

  if (chartData.length === 0 || numericKeys.length === 0) {
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
        layout="vertical"
        margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />

        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }}
          className="dark:fill-neutral-400"
        />

        <YAxis
          dataKey={dimension}
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }}
          width={100}
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

        <Legend
          wrapperStyle={{ fontSize: 12 }}
          iconType="circle"
          formatter={(value) => (
            <span className="text-neutral-700 dark:text-neutral-300">{value}</span>
          )}
        />

        {visibleMeasures.map((measure, index) => {
          const barColor = colors[index % colors.length];

          return (
            <Bar
              key={measure}
              dataKey={measure}
              name={measure.charAt(0).toUpperCase() + measure.slice(1)}
              fill={barColor}
              radius={[0, 0, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
              barSize={20}
              activeBar={false}
            >
              <LabelList
                content={
                  <BarValueLabel
                    color={barColor}
                    dataLength={chartData.length}
                  />
                }
              />
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}