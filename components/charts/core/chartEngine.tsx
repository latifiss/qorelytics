'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import {
  ChartConfig,
  ChartRecommendation,
  ChartDataPoint,
} from '@/components/charts/types/chart.types';
import { ChartContainer } from './chartContainer';
import { ChartToolbar } from './chartToolbar';
import { ChartLegend } from './chartLegend';
import { ChartTypeSwitcher } from '@/components/charts/controls/chartTypeSwitcher';
import { SchemaDetector } from '@/components/charts/detector/schemaDetector';
import { ChartRecommender } from '@/components/charts/detector/chartRecommender';
import { ConfigGenerator } from '@/components/charts/detector/configGenerator';
import {
  BarRenderer,
  HorizontalBarRenderer,
  GroupedBarRenderer,
  StackedBarRenderer,
  LineRenderer,
  AreaRenderer,
  PieRenderer,
  ScatterRenderer,
  HistogramRenderer,
  BoxPlotRenderer,
  FunnelRenderer,
  WaterfallRenderer,
  RadarRenderer,
  TreemapRenderer,
  GaugeRenderer,
  SankeyRenderer,
  SparklineRenderer,
} from '@/components/charts/renderers';
import { transformData } from '@/components/charts/data/transform';
import { CHART_COLORS } from '@/token/chartColors';

interface ChartEngineProps {
  data: ChartDataPoint[];
  config?: Partial<ChartConfig>;
  height?: number;
  className?: string;
  autoDetect?: boolean;
  onDataPointClick?: (point: ChartDataPoint) => void;
  onConfigChange?: (config: ChartConfig) => void;
  onRecommendation?: (
    recommendation: ChartRecommendation
  ) => void;
}

export function ChartEngine({
  data,
  config: userConfig,
  height = 400,
  className = '',
  autoDetect = true,
  onDataPointClick,
  onConfigChange,
  onRecommendation,
}: ChartEngineProps) {
  const [config, setConfig] =
    useState<ChartConfig | null>(null);

  const [recommendations, setRecommendations] =
    useState<ChartRecommendation[]>([]);

  const [selectedType, setSelectedType] =
    useState<string>('');

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log('ChartEngine: No data provided');
      setIsLoading(false);
      return;
    }

    console.log('ChartEngine: Data received:', data);
    console.log('ChartEngine: Data length:', data.length);
    console.log('ChartEngine: Sample data point:', data[0]);

    const detector = new SchemaDetector();
    const schema = detector.detect(data);

    console.log('ChartEngine: Detected schema:', schema);

    if (
      autoDetect &&
      schema.dimensions.length > 0 &&
      schema.measures.length > 0
    ) {
      const recommender =
        new ChartRecommender();

      const recs =
        recommender.recommend(
          data,
          schema
        );

      console.log(
        'ChartEngine: Recommendations:',
        recs
      );

      setRecommendations(recs);

      if (recs.length > 0) {
        const generator =
          new ConfigGenerator();

        const generatedConfig =
          generator.generate(
            data,
            schema,
            recs[0]
          );

        console.log(
          'ChartEngine: Generated config:',
          generatedConfig
        );

        const finalConfig = userConfig
          ? {
              ...generatedConfig,
              ...userConfig,
            }
          : generatedConfig;

        console.log(
          'ChartEngine: Final config:',
          finalConfig
        );

        setConfig(finalConfig);
        setSelectedType(
          finalConfig.type
        );

        onRecommendation?.(
          recs[0]
        );
      } else {
        console.log(
          'ChartEngine: No recommendations found'
        );
      }
    } else if (userConfig) {
      const fullConfig =
        userConfig as ChartConfig;

      console.log(
        'ChartEngine: Using user config:',
        fullConfig
      );

      setConfig(fullConfig);
      setSelectedType(
        fullConfig.type
      );
    } else {
      console.log(
        'ChartEngine: Auto-detect disabled or no dimensions/measures found'
      );
    }

    setIsLoading(false);
  }, [
    data,
    userConfig,
    autoDetect,
    onRecommendation,
  ]);

  const transformedData = useMemo(() => {
    if (
      !config ||
      !data ||
      data.length === 0
    ) {
      return [];
    }

    const result = transformData(
      data,
      config
    );

    console.log(
      'ChartEngine: Transformed data:',
      result
    );

    console.log(
      'ChartEngine: Transformed data length:',
      result.length
    );

    return result;
  }, [data, config]);

  const availableChartTypes =
    useMemo(() => {
      if (
        recommendations.length === 0
      ) {
        return [];
      }

      const primary =
        recommendations[0].primary;

      const alternatives =
        recommendations[0]
          .alternatives || [];

      const allTypes = [
        primary,
        ...alternatives,
      ];

      console.log(
        'ChartEngine: Available chart types:',
        allTypes
      );

      return allTypes;
    }, [recommendations]);

  const handleChartTypeChange = (
    type: string
  ) => {
    if (!config) {
      return;
    }

    console.log(
      'ChartEngine: Chart type changed to:',
      type
    );

    const rec =
      recommendations.find(
        (r) => r.primary === type
      );

    const alternativeRec =
      recommendations.find((r) =>
        r.alternatives.includes(
          type as any
        )
      );

    const selectedRec =
      rec || alternativeRec;

    if (!selectedRec) {
      console.log(
        'ChartEngine: No recommendation found for type:',
        type
      );

      return;
    }

    const updatedConfig = {
      ...config,
      type: type as any,
      ...([
        'pie',
        'donut',
      ].includes(type) &&
      config.measures.length > 1
        ? {
            measures: [
              config.measures[0],
            ],
          }
        : {}),
    };

    console.log(
      'ChartEngine: Updated config:',
      updatedConfig
    );

    setConfig(updatedConfig);
    setSelectedType(type);

    onConfigChange?.(
      updatedConfig
    );
  };

  const renderChart = () => {
    console.log(
      'ChartEngine: Rendering chart'
    );

    console.log(
      'ChartEngine: Config:',
      config
    );

    console.log(
      'ChartEngine: Transformed data:',
      transformedData
    );

    if (
      !config ||
      !transformedData ||
      transformedData.length === 0
    ) {
      console.log(
        'ChartEngine: No data or config to render'
      );

      return (
        <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
          <div className="text-center">
            <p className="text-sm">
              {isLoading
                ? 'Analyzing data...'
                : 'No data to display'}
            </p>

            <p className="text-xs mt-1">
              {isLoading
                ? 'Detecting chart types...'
                : 'Try uploading a different dataset'}
            </p>
          </div>
        </div>
      );
    }

    const baseProps = {
      data: transformedData,
      config,
      colors: CHART_COLORS,
      height: height - 100,
    };

    console.log(
      'ChartEngine: Rendering chart type:',
      config.type
    );

    console.log(
      'ChartEngine: Base props:',
      baseProps
    );

    switch (config.type) {
      case 'bar':
        return (
          <BarRenderer
            {...baseProps}
          />
        );

      case 'horizontalBar':
        return (
          <HorizontalBarRenderer
            {...baseProps}
          />
        );

      case 'groupedBar':
        return (
          <GroupedBarRenderer
            {...baseProps}
          />
        );

      case 'stackedBar':
      case 'hundredStackedBar':
        return (
          <StackedBarRenderer
            {...baseProps}
          />
        );

      case 'line':
      case 'multiLine':
      case 'stepLine':
      case 'cumulativeLine':
        return (
          <LineRenderer
            {...baseProps}
          />
        );

      case 'area':
      case 'multiArea':
      case 'stackedArea':
      case 'hundredStackedArea':
        return (
          <AreaRenderer
            {...baseProps}
          />
        );

      case 'pie':
      case 'donut':
      case 'donutWithKpi':
      case 'nestedDonut':
        return (
          <PieRenderer
            {...baseProps}
          />
        );

      case 'scatter':
      case 'bubble':
        return (
          <ScatterRenderer
            {...baseProps}
          />
        );

      case 'histogram':
        return (
          <HistogramRenderer
            {...baseProps}
          />
        );

      case 'boxPlot':
        return (
          <BoxPlotRenderer
            {...baseProps}
          />
        );

      case 'funnel':
        return (
          <FunnelRenderer
            {...baseProps}
          />
        );

      case 'waterfall':
        return (
          <WaterfallRenderer
            {...baseProps}
          />
        );

      case 'radar':
        return (
          <RadarRenderer
            {...baseProps}
          />
        );

      case 'treemap':
        return (
          <TreemapRenderer
            {...baseProps}
          />
        );

      case 'gauge':
        return (
          <GaugeRenderer
            {...baseProps}
          />
        );

      case 'sankey':
        return (
          <SankeyRenderer
            {...baseProps}
          />
        );

      case 'sparkline':
        return (
          <SparklineRenderer
            {...baseProps}
          />
        );

      case 'divergingBar':
        return (
          <BarRenderer
            {...baseProps}
          />
        );

      case 'lollipop':
      case 'dotPlot':
        return (
          <BarRenderer
            {...baseProps}
          />
        );

      default:
        return (
          <BarRenderer
            {...baseProps}
          />
        );
    }
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#171b1d] shadow-[0_3px_0_0_#d1d5db] dark:shadow-[0_3px_0_0_#323a3f]">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 mx-auto" />
            <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className={cn(
        'rounded-lg border border-neutral-200 dark:border-neutral-800',
        'bg-white dark:bg-[#171b1d] overflow-hidden',
        'shadow-[0_4px_0_0_#d1d5db]',
        'dark:shadow-[0_4px_0_0_#323a3f]',
        isFullscreen &&
          'fixed inset-4 z-50',
        className
      )}
    >
      <ChartToolbar
        chartType={config.type}
        onChartTypeChange={
          handleChartTypeChange
        }
        onFullscreen={() =>
          setIsFullscreen(
            !isFullscreen
          )
        }
        onExport={() =>
          console.log('Export')
        }
      />

      <div className="p-4">
        {config.title && (
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            {config.title}
          </h3>
        )}

        {config.description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            {config.description}
          </p>
        )}

        {availableChartTypes.length >
          0 && (
          <ChartTypeSwitcher
            types={
              availableChartTypes
            }
            selected={
              selectedType ||
              config.type
            }
            onChange={
              handleChartTypeChange
            }
            className="mb-3"
          />
        )}

        <ChartContainer
          height={height - 100}
        >
          {renderChart()}
        </ChartContainer>

        {config.showLegend !==
          false && (
          <ChartLegend
            items={[]}
            onToggle={() => {}}
            className="mt-3"
          />
        )}
      </div>
    </motion.div>
  );
}