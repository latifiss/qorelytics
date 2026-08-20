'use client';

import React from 'react';
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';

interface TreemapRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

interface CustomizedContentProps {
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  index?: number;
  colors: string[];
}

const CustomizedContent = ({
  depth = 0,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name = '',
  value = 0,
  index = 0,
  colors,
}: CustomizedContentProps) => {
  const color = colors[index % colors.length];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={4}
        ry={4}
        className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
      />
      {width > 40 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={12}
            fontWeight={600}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={10}
            opacity={0.8}
          >
            {value.toLocaleString()}
          </text>
        </>
      )}
    </g>
  );
};

export function TreemapRenderer({
  data,
  config,
  colors,
  height = 300,
}: TreemapRendererProps) {
  const dimension =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'name';

  const numericKeys = Object.keys(data[0] || {}).filter(
    (key) => key !== dimension && typeof data[0]?.[key] === 'number'
  );

  const measure = config.measures?.[0] || numericKeys[0] || 'value';

  const chartData = data.map((row) => ({
    name: String(row[dimension] || 'Unknown'),
    value: Number(row[measure]) || 0,
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
      <Treemap
        data={chartData}
        dataKey="value"
        nameKey="name"
        aspectRatio={4 / 3}
        stroke="#ffffff"
        fill={colors[0]}
        animationDuration={800}
        animationEasing="ease-out"
        content={<CustomizedContent colors={colors} />}
      />
    </ResponsiveContainer>
  );
}