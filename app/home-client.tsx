'use client';

import { useCallback, useRef, useState, useMemo } from 'react';
import Input from '@/components/ui/input';
import AnalystResponse from '@/components/ui/analystResponse';
import SelectionModal from '@/components/ui/selectionModal';
import { getSampleById } from '@/data/sample';
import { ChartConfig, ChartDataPoint } from '@/components/charts/types/chart.types';

interface HomeClientProps {
  userName?: string;
}

interface ChatTurn {
  id: string;
  userMessage: string;
  response: string;
  isFollowUp: boolean;
}

const sampleResponse = `
I analyzed your customer sales dataset.

The analysis shows strong growth, but there are opportunities to improve customer retention.

Below is the generated analysis report.
`;

const getFollowUpResponse = () => `
Thanks for your follow-up.

Based on the analysis so far, retention dips correlate with onboarding friction in weeks 2–3. I'd recommend A/B testing a simplified checkout flow and segmenting cohorts by acquisition channel to isolate the drop-off.

Happy to dig deeper into any segment or metric.
`;

export default function Home({ userName }: HomeClientProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);

  const started = turns.length > 0;

  // Generate chart data from sample
  const chartData = useMemo(() => {
    const sample = getSampleById('time-series');
    if (!sample) return [];

    const charts = [];
    const dimensions = sample.config.dimensions;
    const measures = sample.config.measures;

    // Chart 0: Main trend (recommended chart)
    charts.push({
      config: {
        id: `chart-0-${Date.now()}`,
        type: sample.config.recommendedChart as any,
        dimensions: dimensions,
        measures: [measures[0]],
        title: `${measures[0]} Trend`,
        showLegend: true,
      } as ChartConfig,
      data: sample.data as ChartDataPoint[],
    });

    // Chart 1: Bar chart for second measure
    if (measures.length > 1) {
      charts.push({
        config: {
          id: `chart-1-${Date.now()}`,
          type: 'bar' as any,
          dimensions: dimensions,
          measures: [measures[1]],
          title: `${measures[1]} Distribution`,
          showLegend: true,
        } as ChartConfig,
        data: sample.data as ChartDataPoint[],
      });
    }

    // Chart 2: Area chart for multi-measure comparison
    if (measures.length > 2) {
      charts.push({
        config: {
          id: `chart-2-${Date.now()}`,
          type: 'area' as any,
          dimensions: dimensions,
          measures: measures.slice(0, 3),
          title: 'Multi-Measure Comparison',
          showLegend: true,
        } as ChartConfig,
        data: sample.data as ChartDataPoint[],
      });
    }

    // Chart 3: Donut chart for breakdown (if data has <= 10 unique categories)
    const uniqueCategories = new Set(sample.data.map(d => String(d[dimensions[0]])));
    if (uniqueCategories.size <= 10 && uniqueCategories.size > 1) {
      charts.push({
        config: {
          id: `chart-3-${Date.now()}`,
          type: 'donut' as any,
          dimensions: dimensions,
          measures: [measures[0]],
          title: `${measures[0]} Breakdown`,
          showLegend: true,
        } as ChartConfig,
        data: sample.data as ChartDataPoint[],
      });
    }

    return charts;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (userScrolledUpRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight - el.clientHeight;
        }
        bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    userScrolledUpRef.current = distanceFromBottom > 120;
  }, []);

  const handleStreamingUpdate = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleTurnComplete = useCallback(() => {
    setActiveTurnId(null);
    setIsGenerating(false);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = (text: string, _mode: string, file?: File) => {
    if ((!text && !file) || isGenerating) return;

    const message = text || `Analyze ${file?.name}`;
    const isFollowUp = turns.length > 0;
    const newTurnId = crypto.randomUUID();

    setActiveTurnId(newTurnId);

    setTurns((prev) => [
      ...prev,
      {
        id: newTurnId,
        userMessage: message,
        response: isFollowUp ? getFollowUpResponse() : sampleResponse,
        isFollowUp,
      },
    ]);

    setIsGenerating(true);
    userScrolledUpRef.current = false;
    scrollToBottom();
  };

  return (
    <div className="fixed top-19.5 lg:top-0 right-0 bottom-0 left-0 lg:left-80 flex flex-col overflow-hidden bg-white dark:bg-[#171b1d]">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto pt-8 px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-500 dark:hover:scrollbar-thumb-neutral-500"
      >
        <div className="max-w-2xl mx-auto w-full">
          {!started && (
            <div className="mb-12 mt-20 text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 dark:text-white">
                {userName ? (
                  <>
                    <span className="rainbow-text">
                      Hey {userName.split(' ')[0]}
                    </span>
                    <br />
                    <span className="text-2xl">
                      What are you analyzing today?
                    </span>
                  </>
                ) : (
                  <>What are you analyzing today?</>
                )}
              </h1>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm">
                Upload your data and let Qorelytics uncover insights.
              </p>
            </div>
          )}

          {started && (
            <div className="space-y-8">
              {turns.map((turn) => {
                const isActiveTurn =
                  isGenerating && turn.id === activeTurnId;

                return (
                  <div key={turn.id} className="space-y-6">
                    {/* User Message */}
                    <div className="w-full flex justify-end">
                      <div
                        className="max-w-[80%] px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-none text-sm text-neutral-900 dark:text-white leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-900/50"
                      >
                        {turn.userMessage}
                      </div>
                    </div>

                    {/* AI Response with Charts */}
                    <AnalystResponse
  content={turn.response}
  isStreaming={isActiveTurn}
  showReport={true}
  chartData={chartData}  // Make sure this is passed
  onCopy={() => console.log('copied')}
  onRegenerate={() => {}}
  onStreamingUpdate={handleStreamingUpdate}
  onStreamingComplete={isActiveTurn ? handleTurnComplete : undefined}
/>
                  </div>
                );
              })}

              <div ref={bottomRef} className="h-60 shrink-0" aria-hidden />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-linear-to-t from-white dark:from-[#171b1d] via-white/95 dark:via-[#171b1d]/95 to-transparent pt-8 pb-4 px-4 z-40">
        <div className="max-w-2xl mx-auto">
          <Input
            onSubmit={handleSubmit}
            disabled={isGenerating}
            placeholder={started ? 'Ask a follow-up...' : 'Ask anything...'}
          />
        </div>
      </div>

      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={() => {}}
      />
    </div>
  );
}