'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface RadarRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

export function RadarRenderer({
  data,
  config,
  colors,
  height = 300,
}: RadarRendererProps) {
  const dimension =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'category';

  const numericKeys = Object.keys(
    data[0] || {}
  ).filter(
    (key) =>
      key !== dimension &&
      typeof data[0]?.[key] === 'number'
  );

  const visibleMeasures =
    config.visibleSeries &&
    config.visibleSeries.length > 0
      ? numericKeys.filter(
          (key) =>
            !config.visibleSeries?.includes(key)
        )
      : numericKeys;

  const chartData = data.map((row) => {
    const result: Record<string, any> = {
      [dimension]:
        row[dimension] || 'Unknown',
    };

    numericKeys.forEach((key) => {
      result[key] = Number(row[key]) || 0;
    });

    return result;
  });

  if (
    chartData.length === 0 ||
    numericKeys.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No data available
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <RadarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <PolarGrid
          stroke="#e5e7eb"
          strokeOpacity={1}
        />

        <PolarAngleAxis
          dataKey={dimension}
          tick={{
            fontSize: 12,
            fill: '#6b7280',
          }}
        />

        <PolarRadiusAxis
          tick={{
            fontSize: 10,
            fill: '#6b7280',
          }}
        />

        <Tooltip
          cursor={false}
          content={({
            active,
            payload,
            label,
          }) => (
            <ChartTooltip
              active={active}
              payload={payload}
              label={label}
              formatter={(v) => {
                if (typeof v === 'number') {
                  return v.toLocaleString();
                }

                return String(v);
              }}
            />
          )}
        />

        <Legend
          wrapperStyle={{
            fontSize: 12,
          }}
          iconType="circle"
          formatter={(value) => (
            <span className="text-neutral-700 dark:text-neutral-300">
              {value}
            </span>
          )}
        />

        {visibleMeasures.map(
          (measure, index) => {
            const radarColor =
              colors[index % colors.length];

            return (
              <Radar
                key={measure}
                dataKey={measure}
                name={
                  measure.charAt(0).toUpperCase() +
                  measure.slice(1)
                }
                stroke={radarColor}
                fill={radarColor}
                fillOpacity={0.3}
                strokeWidth={2}
                style={{
                  stroke: radarColor,
                  fill: radarColor,
                }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            );
          }
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}