'use client';

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface PieRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

export function PieRenderer({
  data,
  config,
  colors,
  height = 300,
}: PieRendererProps) {
  const [activeIndex, setActiveIndex] = useState<
    number | undefined
  >();

  const isDonut =
    config.type === 'donut' ||
    config.type === 'donutWithKpi' ||
    config.type === 'nestedDonut';

  const dimension =
    config.dimensions?.[0] ||
    Object.keys(data[0] || {})[0] ||
    'name';

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

  const chartData = useMemo(() => {
    return data
      .map((row) => ({
        name: String(
          row[dimension] || 'Unknown'
        ),
        value:
          Number(row[measure]) || 0,
      }))
      .filter(
        (item) => item.value > 0
      );
  }, [
    data,
    dimension,
    measure,
  ]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No data available
        </p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No data to display in Pie chart. Try
          selecting a different dimension or
          measure.
        </p>
      </div>
    );
  }

  if (chartData.length === 1) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Only one data point
          </p>

          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            {chartData[0].name}:{' '}
            {chartData[0].value.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  const onPieEnter = (
    _data: unknown,
    index: number
  ) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const renderActiveShape = (
    props: any
  ) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          dy={8}
          textAnchor="middle"
          fill="currentColor"
          className="text-sm font-medium text-neutral-900 dark:text-white"
        >
          {payload.name}
        </text>

        <text
          x={cx}
          y={cy + 20}
          dy={8}
          textAnchor="middle"
          fill="currentColor"
          className="text-lg font-bold text-neutral-900 dark:text-white"
        >
          {payload.value.toLocaleString()}
        </text>

        <text
          x={cx}
          y={cy + 40}
          dy={8}
          textAnchor="middle"
          fill="currentColor"
          className="text-xs text-neutral-500 dark:text-neutral-400"
        >
          {(percent * 100).toFixed(1)}%
        </text>

        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none"
          strokeWidth={0}
          className="transition-all duration-300"
        />
      </g>
    );
  };

  const innerRadius = isDonut ? 60 : 0;

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <PieChart
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={innerRadius}
          outerRadius={Math.min(
            120,
            height / 3
          )}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          animationDuration={800}
          animationEasing="ease-out"
          label={({
            name,
            percent,
          }) => {
            if (percent < 0.05) {
              return '';
            }

            return `${name} ${(
              percent * 100
            ).toFixed(0)}%`;
          }}
          labelStyle={{
            fontSize: 10,
            fill: 'currentColor',
          }}
          stroke="none"
          strokeWidth={0}
        >
          {chartData.map(
            (entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colors[
                    index %
                      colors.length
                  ]
                }
                stroke="none"
                strokeWidth={0}
                className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
              />
            )
          )}
        </Pie>

        <Tooltip
          content={({
            active,
            payload,
          }) => {
            const data =
              payload?.[0]?.payload;

            return (
              <ChartTooltip
                active={active}
                payload={
                  data
                    ? [
                        {
                          name: data.name,
                          value: data.value,
                        },
                      ]
                    : []
                }
                label=""
                formatter={(v) => {
                  if (
                    typeof v ===
                    'number'
                  ) {
                    return v.toLocaleString();
                  }

                  return String(v);
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
          formatter={(value) => (
            <span className="text-neutral-700 dark:text-neutral-300">
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}