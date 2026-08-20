// app/demo/page.tsx
'use client';

import { useState } from 'react';
import { ChartEngine } from '@/components/charts/core/chartEngine';
import { sampleDatasets, getSampleById } from '@/data/sample';
import { cn } from '@/lib/cn';

export default function DemoPage() {
  const [selectedSampleId, setSelectedSampleId] = useState(sampleDatasets[0].id);
  const [selectedConfig, setSelectedConfig] = useState(sampleDatasets[0].config);

  const currentSample = getSampleById(selectedSampleId);

  const handleSampleChange = (id: string) => {
    const sample = getSampleById(id);
    if (sample) {
      setSelectedSampleId(id);
      setSelectedConfig(sample.config);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#171b1d] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Chart System Demo
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            AI-driven chart detection & visualization engine
          </p>
        </div>

        {/* Sample Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
            Select Dataset
          </label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pb-2">
            {sampleDatasets.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSampleChange(sample.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap',
                  selectedSampleId === sample.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                )}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Info */}
        {currentSample && (
          <div className="mb-6 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {currentSample.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {currentSample.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {currentSample.data.length} rows
                </span>
                <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {Object.keys(currentSample.data[0] || {}).length} columns
                </span>
                <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Recommended: <span className="text-[#7FF86C]">{currentSample.config.recommendedChart}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart Engine */}
        {currentSample && (
          <div className="mb-8">
            <ChartEngine
              data={currentSample.data}
              config={{
                dimensions: currentSample.config.dimensions,
                measures: currentSample.config.measures,
                type: currentSample.config.recommendedChart as any,
                title: currentSample.name,
                description: currentSample.description,
                showLegend: true,
              }}
              height={500}
              onDataPointClick={(point) => console.log('Clicked:', point)}
              onConfigChange={(config) => console.log('Config changed:', config)}
            />
          </div>
        )}

        {/* Available Charts Info */}
        {currentSample && (
          <div className="mt-6 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Available Chart Types for this Dataset
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentSample.config.availableCharts.map((chartType) => (
                <span
                  key={chartType}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium',
                    chartType === currentSample.config.recommendedChart
                      ? 'bg-[#7FF86C]/20 text-[#7FF86C] border border-[#7FF86C]/30'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  )}
                >
                  {chartType}
                  {chartType === currentSample.config.recommendedChart && ' ★'}
                </span>
              ))}
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
              ★ Recommended chart type • Click on chart type buttons above the chart to switch views
            </p>
          </div>
        )}

        {/* All Datasets Quick Reference */}
        <div className="mt-8 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
          <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2">
            All Available Datasets & Their Chart Types
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sampleDatasets.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSampleChange(sample.id)}
                className={cn(
                  'text-left p-2 rounded-md text-xs transition-all duration-200',
                  selectedSampleId === sample.id
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                )}
              >
                <span className="font-medium">{sample.name}</span>
                <span className="block text-[10px] text-neutral-400 dark:text-neutral-500">
                  {sample.config.availableCharts.join(' • ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}