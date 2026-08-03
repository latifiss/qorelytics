'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

import { analysisSteps } from './analysis-data';
import { AnalysisProgressProps } from './types';

import Indicator from '@/components/ui/indicator';
import { ChxIcon } from '@/public/icons/color';

export default function AnalysisProgress({
  className,
  onComplete,
  onStreamingUpdate,
}: AnalysisProgressProps) {
  const [activity, setActivity] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const stepRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    stepRef.current = 0;
    setActivity([]);
    setProgress(0);

    const runAnalysis = () => {
      if (stepRef.current < analysisSteps.length) {
        const currentStep = analysisSteps[stepRef.current].message;

        setActivity((prev) => [...prev.slice(-4), currentStep]);

        setProgress(
          Math.round(((stepRef.current + 1) / analysisSteps.length) * 100)
        );

        stepRef.current++;

        timerRef.current = setTimeout(runAnalysis, 700);
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
  }, [onComplete]);

  useEffect(() => {
    onStreamingUpdate?.();
  }, [activity, progress, onStreamingUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('space-y-2', className)}
    >
      <div className="flex justify-between text-xs text-muted">
        <span>Analyzing data...</span>
        <span>{progress}%</span>
      </div>

      <div className="h-1 rounded-full bg-fill-alpha-subtle overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut' }}
          className="h-full"
          style={{ backgroundColor: '#7FF86C' }}
        />
      </div>

      <div className="mt-3 space-y-1 text-xs font-mono text-muted">
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
