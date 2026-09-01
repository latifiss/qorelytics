'use client';

import React from 'react';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';

interface GaugeRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

export function GaugeRenderer({
  data,
  config,
  colors,
  height = 300,
}: GaugeRendererProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No data available
        </p>
      </div>
    );
  }

  const dimension =
    config.dimensions?.[0] || 'name';

  const numericKeys = Object.keys(
    data[0] || {}
  ).filter(
    (key) =>
      key !== dimension &&
      typeof data[0]?.[key] === 'number'
  );

  const measure =
    config.measures?.[0] ||
    numericKeys[0] ||
    'value';

  const values = data.map((row) => {
    const value = Number(row[measure]);

    return Number.isFinite(value)
      ? value
      : 0;
  });

  const value = values[0] ?? 0;

  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);

  if (minValue === maxValue) {
    minValue = 0;

    if (maxValue === 0) {
      maxValue = 100;
    }
  }

  if (maxValue <= minValue) {
    maxValue = minValue + 100;
  }

  const rawPercentage =
    ((value - minValue) /
      (maxValue - minValue)) *
    100;

  const percentage = Math.min(
    100,
    Math.max(0, rawPercentage)
  );

  const getColor = () => {
    if (percentage >= 80) {
      return (
        colors?.[1] ||
        '#25cf99'
      );
    }

    if (percentage >= 50) {
      return (
        colors?.[2] ||
        '#25c5f9'
      );
    }

    return (
      colors?.[3] ||
      colors?.[0] ||
      '#1484f9'
    );
  };

  const color = getColor();

  const strokeWidth = 20;
  const radius = 120;

  const center =
    radius + strokeWidth;

  const svgWidth = center * 2;
  const svgHeight =
    center * 2 + 70;

  const circumference =
    2 * Math.PI * radius;

  const strokeDashoffset =
    circumference *
    (1 - percentage / 100);

  const dimensionValue =
    data[0]?.[dimension];

  const label =
    dimensionValue !== undefined &&
    dimensionValue !== null &&
    String(dimensionValue).trim()
      ? String(dimensionValue)
      : 'Value';

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        height,
      }}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className="block max-w-full"
        role="img"
        aria-label={`${label}: ${value.toLocaleString()}`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          className="dark:stroke-[#323a3f]"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-1000 ease-out"
        />

        <text
          x={center}
          y={center - 22}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="500"
          className="fill-neutral-500 dark:fill-neutral-400"
        >
          {label.length > 24
            ? `${label.slice(0, 24)}…`
            : label}
        </text>

        <text
          x={center}
          y={center + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="30"
          fontWeight="700"
          className="fill-neutral-900 dark:fill-white"
        >
          {value.toLocaleString()}
        </text>

        <text
          x={center}
          y={center + 52}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="500"
          className="fill-neutral-500 dark:fill-neutral-400"
        >
          {percentage.toFixed(1)}%
        </text>

        <text
          x={24}
          y={center + 52}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="500"
          className="fill-neutral-500 dark:fill-neutral-400"
        >
          {minValue.toLocaleString()}
        </text>

        <text
          x={svgWidth - 24}
          y={center + 52}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="500"
          className="fill-neutral-500 dark:fill-neutral-400"
        >
          {maxValue.toLocaleString()}
        </text>

        <title>
          {label}: {value.toLocaleString()} (
          {percentage.toFixed(1)}%)
        </title>
      </svg>
    </div>
  );
}