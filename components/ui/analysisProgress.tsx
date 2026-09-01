'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

import { analysisSteps, followUpSteps } from './analysis-data';
import { AnalysisProgressProps } from './types';

import Indicator from '@/components/ui/indicator';
import { ChxIcon } from '@/public/icons/color';

export default function AnalysisProgress({
  className,
  onComplete,
  onStreamingUpdate,
  mode = 'initial',
}: AnalysisProgressProps) {
  const [activity, setActivity] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const stepRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const steps = mode === 'follow-up' ? followUpSteps : analysisSteps;

  useEffect(() => {
    stepRef.current = 0;
    setActivity([]);
    setProgress(0);

    const runAnalysis = () => {
      if (stepRef.current < steps.length) {
        const currentStep = steps[stepRef.current].message;

        setActivity((prev) => [...prev.slice(-4), currentStep]);

        setProgress(
          Math.round(((stepRef.current + 1) / steps.length) * 100)
        );

        stepRef.current++;

        timerRef.current = setTimeout(
          runAnalysis,
          mode === 'follow-up' ? 600 : 700
        );
      } else {
        onComplete?.();
      }
    };

    runAnalysis();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [mode, onComplete, steps]);

  useEffect(() => {
    onStreamingUpdate?.();
  }, [activity, progress, onStreamingUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('space-y-2', className)}
    >
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>{mode === 'follow-up' ? 'Thinking...' : 'Analyzing data...'}</span>
        <span>{progress}%</span>
      </div>

      <div className="h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut' }}
          className="h-full"
          style={{ backgroundColor: '#7FF86C' }}
        />
      </div>

      <div className="mt-3 space-y-1 text-xs font-mono text-neutral-500 dark:text-neutral-400">
        {activity.map((item, index) => (
          <motion.div
            key={`${item}-${index}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-[10px]">
              {index === activity.length - 1 ? (
                <Indicator size={14} className="inline-block" />
              ) : (
                <ChxIcon size={14} color="#7FF86C" />
              )}
            </span>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
