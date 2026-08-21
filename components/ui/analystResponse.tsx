'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import { FiChevronDown } from 'react-icons/fi';

import { cn } from '@/lib/cn';

import {
  reportSections,
  defaultResponse,
} from './analysis-data';

import { AnalystResponseProps } from './types';

import {
  CopyIcon,
  RefreshIcon,
} from '@/public/icons/mono';

import { DownloadAs } from '@/components/ui/downloadAs';

import {
  PointA,
  PointB,
  PointC,
  PointD,
  PointE,
  PointF,
  PointG,
  PointH,
} from '@/public/icons/points';

import { ChartEngine } from '@/components/charts/core/chartEngine';
import { ChartConfig, ChartDataPoint } from '@/components/charts/types/chart.types';

const pointIcons = [
  PointA,
  PointB,
  PointC,
  PointD,
  PointE,
  PointF,
  PointG,
  PointH,
];

const POINT_SIZE = 14;

let startPointPool: number[] = [];
let previousStartPoint: number | null = null;

function shufflePointPool() {
  const pool = pointIcons.map((_, index) => index);
  for (let i = pool.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[randomIndex]] = [pool[randomIndex], pool[i]];
  }
  if (previousStartPoint !== null && pool.length > 1 && pool[0] === previousStartPoint) {
    const swapIndex = 1 + Math.floor(Math.random() * (pool.length - 1));
    [pool[0], pool[swapIndex]] = [pool[swapIndex], pool[0]];
  }
  return pool;
}

function getRandomStartPoint() {
  if (startPointPool.length === 0) {
    startPointPool = shufflePointPool();
  }
  const nextPoint = startPointPool.shift()!;
  previousStartPoint = nextPoint;
  return nextPoint;
}

const isListItem = (line: string) => {
  return /^\s*(?:[-*•✓]|\d+[.)])\s+/.test(line);
};

const removeListBullet = (line: string) => {
  return line.replace(/^\s*(?:[-*•✓]|\d+[.)])\s+/, '');
};

function createPointAssignments(sections: typeof reportSections, startIndex: number) {
  const assignments: Record<number, number> = {};
  let currentIndex = startIndex;
  let usedIndices: number[] = [];

  sections.forEach((_, sectionIndex) => {
    if (usedIndices.length >= pointIcons.length) {
      usedIndices = [];
    }
    let pointIndex = currentIndex;
    let attempts = 0;
    while (usedIndices.includes(pointIndex) && attempts < pointIcons.length) {
      pointIndex = (pointIndex + 1) % pointIcons.length;
      attempts++;
    }
    assignments[sectionIndex] = pointIndex;
    usedIndices.push(pointIndex);
    currentIndex = (pointIndex + 1) % pointIcons.length;
  });

  return assignments;
}

interface ChartData {
  config: ChartConfig;
  data: ChartDataPoint[];
}

interface ExtendedAnalystResponseProps extends AnalystResponseProps {
  chartData?: ChartData[];
}

function renderReportContent(
  content: string,
  pointIndex: number,
  chartData?: ChartData[]
) {
  const lines = content.split('\n');
  const PointIcon = pointIcons[pointIndex] ?? PointA;
  const result: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if line contains a chart placeholder
    const chartMatch = trimmedLine.match(/\[CHART:(\d+)\]/);
    if (chartMatch && chartData) {
      const chartIndex = parseInt(chartMatch[1]);
      const chart = chartData[chartIndex];
      if (chart) {
        // Add spacing before chart
        if (result.length > 0 && result[result.length - 1] !== null) {
          result.push(<div key={`chart-spacer-${i}`} className="h-2" />);
        }
        
        result.push(
          <div key={`chart-${i}`} className="my-3 w-full">
            <ChartEngine
              data={chart.data}
              config={chart.config}
              height={280}
              autoDetect={false}
              className="rounded-xl border border-[#E5E5E5] dark:border-neutral-700 bg-white dark:bg-[#171b1d] p-3 shadow-[0_1px_0_#E5E5E5] dark:shadow-[0_1px_0_#3a3a3a]"
            />
          </div>
        );
        
        // Add spacing after chart
        result.push(<div key={`chart-spacer-after-${i}`} className="h-2" />);
        continue;
      }
    }

    if (isListItem(line)) {
      const remaining = removeListBullet(line);
      result.push(
        <div key={i} className="flex items-start gap-2 py-0.5">
          <PointIcon size={POINT_SIZE} className="shrink-0 mt-[2px]" />
          <span className="min-w-0 flex-1">{remaining}</span>
        </div>
      );
      continue;
    }

    if (line.trim() === '') {
      result.push(<div key={i} className="h-1" />);
      continue;
    }

    result.push(
      <div key={i} className="py-0.5">
        {line}
      </div>
    );
  }

  return result;
}

export default function AnalystResponse({
  content = defaultResponse,
  isStreaming = true,
  className,
  showReport = true,
  chartData,
  onCopy,
  onRegenerate,
  onStreamingComplete,
  onStreamingUpdate,
}: ExtendedAnalystResponseProps) {
  const [text, setText] = useState('');
  const [sections, setSections] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pointStartIndex, setPointStartIndex] = useState<number>(0);

  const isMounted = useRef(true);
  const hasAnimated = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const onStreamingCompleteRef = useRef(onStreamingComplete);
  const onStreamingUpdateRef = useRef(onStreamingUpdate);

  onStreamingCompleteRef.current = onStreamingComplete;
  onStreamingUpdateRef.current = onStreamingUpdate;

  useEffect(() => {
    setPointStartIndex(getRandomStartPoint());
  }, [content]);

  useLayoutEffect(() => {
    onStreamingUpdateRef.current?.();
  }, [text, sections, complete]);

  useEffect(() => {
    if (hasAnimated.current) return;
    isMounted.current = true;

    const clearTimers = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };

    if (!isStreaming) {
      hasAnimated.current = true;
      setText(content);
      setSections(showReport ? reportSections.map((_, index) => index) : []);
      setComplete(true);
      return;
    }

    let charIndex = 0;

    const finishResponse = () => {
      if (!isMounted.current) return;
      hasAnimated.current = true;
      setComplete(true);
      onStreamingCompleteRef.current?.();
    };

    const revealSections = () => {
      if (!showReport) {
        finishResponse();
        return;
      }

      reportSections.forEach((_, index) => {
        const timeout = setTimeout(() => {
          if (!isMounted.current) return;
          setSections((prev) => prev.includes(index) ? prev : [...prev, index]);
          if (index === reportSections.length - 1) {
            finishResponse();
          }
        }, index * 600);
        timeoutRefs.current.push(timeout);
      });
    };

    const typeNextChar = () => {
      if (!isMounted.current) return;
      if (charIndex < content.length) {
        setText((prev) => prev + content.charAt(charIndex));
        charIndex++;
        timerRef.current = setTimeout(typeNextChar, 15);
      } else {
        revealSections();
      }
    };

    timerRef.current = setTimeout(typeNextChar, 100);

    return () => {
      isMounted.current = false;
      clearTimers();
    };
  }, [content, isStreaming, showReport]);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const isTyping = isStreaming && text.length > 0 && !complete;

  const pointAssignments = useMemo(
    () => createPointAssignments(reportSections, pointStartIndex),
    [pointStartIndex]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('w-full bg-transparent', className)}
    >
      <div className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
        {text && (
          <>
            <div className="leading-tight">{text}</div>
            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-neutral-900/60 dark:bg-white/60 animate-pulse ml-0.5" />
            )}
          </>
        )}

        {showReport && sections.length > 0 && (
          <div className="mt-5 w-full bg-white dark:bg-[#22282b] border-2 border-[#E5E5E5] dark:border-neutral-700 rounded-xl shadow-[0_2px_0_#E5E5E5] dark:shadow-[0_2px_0_#3a3a3a] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#E5E5E5] dark:border-neutral-700">
              <span className="text-xs font-mono text-[#AFAFAF] dark:text-neutral-500 tracking-wider">
                analysis_report.md
              </span>
              <FiChevronDown size={14} className="text-[#AFAFAF] dark:text-neutral-500" />
            </div>

            <div className="p-4 space-y-3">
              {sections.map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h4 className="text-[13px] font-semibold text-[#4B4B4B] dark:text-neutral-200 mb-1">
                    {reportSections[index].title}
                  </h4>

                  <div className="text-[11px] font-mono text-[#6B6B6B] dark:text-neutral-400 leading-normal">
                    {renderReportContent(
                      reportSections[index].content,
                      pointAssignments[index] ?? 0,
                      chartData
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {complete && (
        <div className="mt-3 flex items-center gap-0">
          <button
            onClick={copy}
            disabled={!text}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 rounded"
          >
            <CopyIcon size={18} className="text-[#AFAFAF] dark:text-neutral-500" />
          </button>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded"
            >
              <RefreshIcon size={18} className="text-[#AFAFAF] dark:text-neutral-500" />
            </button>
          )}

          <DownloadAs onClick={() => {}} />
        </div>
      )}
    </motion.div>
  );
}