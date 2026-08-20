'use client';

import React, { useMemo, useState } from 'react';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface BoxPlotRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

interface BoxPlotDatum {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  color: string;
}

export function BoxPlotRenderer({
  data,
  config,
  colors,
  height = 300,
}: BoxPlotRendererProps) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

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

    if (numericKeys.length === 0) {
      return [];
    }

    const findKey = (
      patterns: string[],
      fallbackIndex: number
    ) => {
      const match = numericKeys.find((key) => {
        const lower = key.toLowerCase();

        return patterns.some((pattern) =>
          lower === pattern ||
          lower.includes(pattern)
        );
      });

      return (
        match ||
        numericKeys[
          Math.min(
            fallbackIndex,
            numericKeys.length - 1
          )
        ]
      );
    };

    const minKey = findKey(
      ['min', 'minimum'],
      0
    );

    const q1Key = findKey(
      ['q1', 'firstquartile', 'lowerquartile'],
      1
    );

    const medianKey = findKey(
      ['median', 'med'],
      2
    );

    const q3Key = findKey(
      ['q3', 'thirdquartile', 'upperquartile'],
      3
    );

    const maxKey = findKey(
      ['max', 'maximum'],
      4
    );

    return data.map((row, index) => {
      const min =
        Number(row[minKey]) || 0;

      const q1 =
        Number(row[q1Key]) || min;

      const median =
        Number(row[medianKey]) || q1;

      const q3 =
        Number(row[q3Key]) || median;

      const max =
        Number(row[maxKey]) || q3;

      return {
        name:
          String(
            row[dimension] ??
              'Unknown'
          ).trim() || 'Unknown',
        min: Math.min(
          min,
          q1,
          median,
          q3,
          max
        ),
        q1,
        median,
        q3,
        max: Math.max(
          min,
          q1,
          median,
          q3,
          max
        ),
        color:
          colors[
            index %
              Math.max(colors.length, 1)
          ] || '#1484f9',
      };
    });
  }, [data, config, colors]);

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
          No valid box plot data found.
        </p>
      </div>
    );
  }

  const width = 1000;
  const chartHeight = Math.max(
    height,
    280
  );

  const leftPadding = 80;
  const rightPadding = 35;
  const topPadding = 24;
  const bottomPadding = 48;

  const plotWidth =
    width -
    leftPadding -
    rightPadding;

  const plotHeight =
    chartHeight -
    topPadding -
    bottomPadding;

  const allValues = chartData.flatMap(
    (item) => [
      item.min,
      item.q1,
      item.median,
      item.q3,
      item.max,
    ]
  );

  let minValue = Math.min(
    ...allValues
  );

  let maxValue = Math.max(
    ...allValues
  );

  if (
    !Number.isFinite(minValue) ||
    !Number.isFinite(maxValue)
  ) {
    minValue = 0;
    maxValue = 100;
  }

  if (minValue === maxValue) {
    const padding =
      Math.abs(minValue) * 0.1 ||
      10;

    minValue -= padding;
    maxValue += padding;
  }

  const valueRange =
    maxValue - minValue;

  const scaleY = (value: number) => {
    return (
      topPadding +
      plotHeight -
      ((value - minValue) /
        valueRange) *
        plotHeight
    );
  };

  const categoryWidth =
    plotWidth /
    chartData.length;

  const boxWidth = Math.min(
    58,
    categoryWidth * 0.5
  );

  const capWidth =
    Math.min(
      42,
      boxWidth * 0.7
    );

  const formatValue = (
    value: number
  ) =>
    value.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      }
    );

  const activeData =
    activeIndex !== null
      ? chartData[activeIndex]
      : null;

  const tickCount = 5;

  const ticks = Array.from(
    { length: tickCount },
    (_, index) => {
      const ratio =
        index /
        (tickCount - 1);

      return (
        maxValue -
        valueRange * ratio
      );
    }
  );

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
      >
        <g>
          {ticks.map(
            (tick, index) => {
              const y =
                scaleY(tick);

              return (
                <g
                  key={`tick-${index}`}
                >
                  <line
                    x1={leftPadding}
                    x2={
                      width -
                      rightPadding
                    }
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.08}
                  />

                  <text
                    x={
                      leftPadding -
                      12
                    }
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight={500}
                    className="fill-neutral-500 dark:fill-neutral-400"
                  >
                    {formatValue(
                      tick
                    )}
                  </text>
                </g>
              );
            }
          )}
        </g>

        <g>
          {chartData.map(
            (item, index) => {
              const centerX =
                leftPadding +
                categoryWidth *
                  index +
                categoryWidth /
                  2;

              const minY =
                scaleY(item.min);

              const q1Y =
                scaleY(item.q1);

              const medianY =
                scaleY(item.median);

              const q3Y =
                scaleY(item.q3);

              const maxY =
                scaleY(item.max);

              const boxTop =
                Math.min(
                  q1Y,
                  q3Y
                );

              const boxBottom =
                Math.max(
                  q1Y,
                  q3Y
                );

              const isActive =
                activeIndex ===
                index;

              return (
                <g
                  key={`box-${index}`}
                  onMouseEnter={() =>
                    setActiveIndex(
                      index
                    )
                  }
                  onMouseLeave={() =>
                    setActiveIndex(
                      null
                    )
                  }
                  className="cursor-pointer"
                >
                  <line
                    x1={centerX}
                    x2={centerX}
                    y1={maxY}
                    y2={q3Y}
                    stroke={item.color}
                    strokeWidth={2}
                    opacity={
                      isActive
                        ? 1
                        : 0.8
                    }
                  />

                  <line
                    x1={centerX}
                    x2={centerX}
                    y1={q1Y}
                    y2={minY}
                    stroke={item.color}
                    strokeWidth={2}
                    opacity={
                      isActive
                        ? 1
                        : 0.8
                    }
                  />

                  <line
                    x1={
                      centerX -
                      capWidth / 2
                    }
                    x2={
                      centerX +
                      capWidth / 2
                    }
                    y1={maxY}
                    y2={maxY}
                    stroke={item.color}
                    strokeWidth={2}
                  />

                  <line
                    x1={
                      centerX -
                      capWidth / 2
                    }
                    x2={
                      centerX +
                      capWidth / 2
                    }
                    y1={minY}
                    y2={minY}
                    stroke={item.color}
                    strokeWidth={2}
                  />

                  <rect
                    x={
                      centerX -
                      boxWidth / 2
                    }
                    y={boxTop}
                    width={boxWidth}
                    height={Math.max(
                      2,
                      boxBottom -
                        boxTop
                    )}
                    fill={item.color}
                    fillOpacity={
                      isActive
                        ? 0.42
                        : 0.28
                    }
                    stroke={item.color}
                    strokeWidth={2}
                    rx={3}
                    className="transition-all duration-200"
                  />

                  <line
                    x1={
                      centerX -
                      boxWidth / 2
                    }
                    x2={
                      centerX +
                      boxWidth / 2
                    }
                    y1={medianY}
                    y2={medianY}
                    stroke={item.color}
                    strokeWidth={3}
                  />

                  <circle
                    cx={centerX}
                    cy={medianY}
                    r={4}
                    fill={item.color}
                    className="transition-all duration-200"
                  />

                  <text
                    x={centerX}
                    y={
                      chartHeight -
                      18
                    }
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={500}
                    className="fill-neutral-700 dark:fill-neutral-300 select-none"
                  >
                    {item.name.length >
                    16
                      ? `${item.name.slice(
                          0,
                          16
                        )}…`
                      : item.name}
                  </text>

                  <title>
                    {item.name}
                    {'\n'}
                    Min: {formatValue(
                      item.min
                    )}
                    {'\n'}
                    Q1: {formatValue(
                      item.q1
                    )}
                    {'\n'}
                    Median:{' '}
                    {formatValue(
                      item.median
                    )}
                    {'\n'}
                    Q3: {formatValue(
                      item.q3
                    )}
                    {'\n'}
                    Max: {formatValue(
                      item.max
                    )}
                  </title>
                </g>
              );
            }
          )}
        </g>
      </svg>

      {activeData && (
        <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2">
          <ChartTooltip
            active={true}
            payload={[
              {
                name: 'Minimum',
                value:
                  activeData.min,
              },
              {
                name: 'Q1',
                value:
                  activeData.q1,
              },
              {
                name: 'Median',
                value:
                  activeData.median,
              },
              {
                name: 'Q3',
                value:
                  activeData.q3,
              },
              {
                name: 'Maximum',
                value:
                  activeData.max,
              },
            ]}
            label={activeData.name}
            formatter={(value) =>
              typeof value ===
              'number'
                ? value.toLocaleString()
                : String(value)
            }
          />
        </div>
      )}
    </div>
  );
}