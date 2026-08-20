'use client';

import React, { useMemo, useState } from 'react';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';
import { ChartTooltip } from '@/components/charts/core/chartTooltip';

interface FunnelRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export function FunnelRenderer({
  data,
  config,
  colors,
  height = 300,
}: FunnelRendererProps) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const dimension =
      config.dimensions?.[0] ||
      Object.keys(data[0] || {})[0] ||
      'stage';

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
      'count';

    const firstValue =
      Number(data[0]?.[measure]) || 0;

    return data.map((row, index) => {
      const value =
        Number(row[measure]) || 0;

      const percentage =
        firstValue > 0
          ? (value / firstValue) * 100
          : 0;

      return {
        name:
          String(row[dimension] ?? 'Unknown').trim() ||
          'Unknown',
        value,
        percentage,
        color:
          colors[index % Math.max(colors.length, 1)] ||
          '#1484f9',
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
          No valid funnel data found.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...chartData.map((stage) => stage.value),
    1
  );

  const width = 1000;
  const chartHeight = Math.max(height, 280);

  const labelWidth = 130;
  const valueWidth = 110;

  const funnelLeft = labelWidth + 20;
  const funnelRight =
    width - valueWidth - 20;

  const funnelWidth =
    funnelRight - funnelLeft;

  const topPadding = 18;
  const bottomPadding = 18;
  const stageGap = 4;

  const availableHeight =
    chartHeight -
    topPadding -
    bottomPadding;

  const stageHeight =
    Math.max(
      32,
      (availableHeight -
        stageGap *
          (chartData.length - 1)) /
        chartData.length
    );

  const actualFunnelHeight =
    stageHeight * chartData.length +
    stageGap *
      (chartData.length - 1);

  const startY =
    (chartHeight -
      actualFunnelHeight) /
    2;

  const minWidth =
    Math.min(90, funnelWidth * 0.18);

  const getStageWidth = (
    value: number
  ) => {
    if (maxValue <= 0) {
      return minWidth;
    }

    const ratio =
      Math.max(
        0,
        Math.min(1, value / maxValue)
      );

    return (
      minWidth +
      (funnelWidth - minWidth) *
        ratio
    );
  };

  const getStagePoints = (
    index: number,
    value: number
  ) => {
    const currentWidth =
      getStageWidth(value);

    const currentLeft =
      funnelLeft +
      (funnelWidth -
        currentWidth) /
        2;

    const currentRight =
      currentLeft +
      currentWidth;

    const y =
      startY +
      index *
        (stageHeight + stageGap);

    const nextStage =
      chartData[index + 1];

    const nextWidth = nextStage
      ? getStageWidth(nextStage.value)
      : Math.max(
          minWidth * 0.72,
          currentWidth * 0.72
        );

    const nextLeft =
      funnelLeft +
      (funnelWidth -
        nextWidth) /
        2;

    const nextRight =
      nextLeft + nextWidth;

    const nextY =
      y + stageHeight;

    return [
      `${currentLeft},${y}`,
      `${currentRight},${y}`,
      `${nextRight},${nextY}`,
      `${nextLeft},${nextY}`,
    ].join(' ');
  };

  const getTextColor = (
    color: string
  ) => {
    const hex = color.replace('#', '');

    if (hex.length !== 6) {
      return '#ffffff';
    }

    const r = parseInt(
      hex.substring(0, 2),
      16
    );

    const g = parseInt(
      hex.substring(2, 4),
      16
    );

    const b = parseInt(
      hex.substring(4, 6),
      16
    );

    const luminance =
      (0.299 * r +
        0.587 * g +
        0.114 * b) /
      255;

    return luminance > 0.65
      ? '#111827'
      : '#ffffff';
  };

  const activeStage =
    activeIndex !== null
      ? chartData[activeIndex]
      : null;

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
          {chartData.map(
            (stage, index) => {
              const y =
                startY +
                index *
                  (stageHeight +
                    stageGap);

              const stageWidth =
                getStageWidth(
                  stage.value
                );

              const left =
                funnelLeft +
                (funnelWidth -
                  stageWidth) /
                  2;

              const right =
                left + stageWidth;

              const centerX =
                funnelLeft +
                funnelWidth / 2;

              const centerY =
                y + stageHeight / 2;

              const points =
                getStagePoints(
                  index,
                  stage.value
                );

              const isActive =
                activeIndex === index;

              const textColor =
                getTextColor(
                  stage.color
                );

              return (
                <g
                  key={`stage-${index}`}
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
                  <polygon
                    points={points}
                    fill={stage.color}
                    opacity={
                      activeIndex !== null &&
                      !isActive
                        ? 0.55
                        : 1
                    }
                    className="transition-opacity duration-200"
                  />

                  <text
                    x={labelWidth}
                    y={centerY}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={13}
                    fontWeight={500}
                    className="fill-neutral-700 dark:fill-neutral-300 select-none"
                  >
                    {stage.name.length >
                    18
                      ? `${stage.name.slice(
                          0,
                          18
                        )}…`
                      : stage.name}
                  </text>

                  <text
                    x={centerX}
                    y={
                      centerY - 2
                    }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill={textColor}
                    className="select-none"
                  >
                    {stage.value.toLocaleString()}
                  </text>

                  {stageWidth >
                    145 && (
                    <text
                      x={centerX}
                      y={
                        centerY + 15
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10}
                      fontWeight={500}
                      fill={textColor}
                      opacity={0.85}
                      className="select-none"
                    >
                      {stage.percentage.toFixed(
                        1
                      )}
                      %
                    </text>
                  )}

                  <text
                    x={width - 20}
                    y={centerY}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={12}
                    fontWeight={500}
                    className="fill-neutral-500 dark:fill-neutral-400 select-none"
                  >
                    {stage.percentage.toFixed(
                      1
                    )}
                    %
                  </text>

                  <title>
                    {stage.name}:{' '}
                    {stage.value.toLocaleString()}{' '}
                    (
                    {stage.percentage.toFixed(
                      1
                    )}
                    %)
                  </title>
                </g>
              );
            }
          )}
        </g>
      </svg>

      {activeStage && (
        <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2">
          <ChartTooltip
            active={true}
            payload={[
              {
                name: 'Count',
                value:
                  activeStage.value,
              },
              {
                name: 'Conversion',
                value: `${activeStage.percentage.toFixed(
                  1
                )}%`,
              },
            ]}
            label={activeStage.name}
            formatter={(value) =>
              String(value)
            }
          />
        </div>
      )}
    </div>
  );
}