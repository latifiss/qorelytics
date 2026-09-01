'use client';

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface ScatterRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

export function ScatterRenderer({
  data,
  config,
  colors,
  height = 300,
}: ScatterRendererProps) {
  const xAxisKey =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'x';

  const numericKeys = Object.keys(
    data[0] || {}
  ).filter(
    (key) =>
      key !== xAxisKey &&
      typeof data[0]?.[key] === 'number'
  );

  const yAxisKey =
    config.measures?.[0] ||
    numericKeys[0] ||
    'y';

  const visibleMeasures =
    config.visibleSeries &&
    config.visibleSeries.length > 0
      ? numericKeys.filter(
          (key) =>
            !config.visibleSeries?.includes(
              key
            )
        )
      : numericKeys;

  const chartData = data.map((row) => ({
    name: String(
      row[xAxisKey] || 'Unknown'
    ),
    [xAxisKey]:
      Number(row[xAxisKey]) || 0,
    [yAxisKey]:
      Number(row[yAxisKey]) || 0,
    color:
      colors[0] || '#1484f9',
  }));

  if (chartData.length === 0) {
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
      <ScatterChart
        margin={{
          top: 45,
          right: 80,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          horizontal={false}
          vertical={false}
        />

        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 12,
            fontWeight: 500,
            fill: '#6b7280',
          }}
          className="dark:fill-neutral-400"
        />

        <YAxis
          dataKey={yAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 12,
            fontWeight: 500,
            fill: '#6b7280',
          }}
          width={60}
          className="dark:fill-neutral-400"
        />

        <Tooltip
          cursor={false}
          content={({
            active,
            payload,
          }) => {
            const point =
              payload?.[0]?.payload;

            return (
              <ChartTooltip
                active={active}
                payload={
                  point
                    ? [
                        {
                          name: point.name,
                          value:
                            point[
                              yAxisKey
                            ],
                        },
                      ]
                    : []
                }
                label={point?.name}
                formatter={(value) => {
                  if (
                    typeof value ===
                    'number'
                  ) {
                    return value.toLocaleString();
                  }

                  return String(value);
                }}
              />
            );
          }}
        />

        <Legend
          wrapperStyle={{
            fontSize: 12,
          }}
          iconType="circle"
          formatter={() => (
            <span className="text-neutral-700 dark:text-neutral-300">
              Data Points
            </span>
          )}
        />

        <Scatter
          data={chartData}
          fill={
            colors[0] ||
            '#1484f9'
          }
          animationDuration={800}
          animationEasing="ease-out"
        >
          {chartData.map(
            (entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colors[
                    index %
                      Math.max(
                        colors.length,
                        1
                      )
                  ] ||
                  '#1484f9'
                }
                className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
              />
            )
          )}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}