'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import { cn } from '@/lib/cn';

interface ResponseProps {
  content?: string;
  isStreaming?: boolean;
  onCopy?: () => void;
  onRegenerate?: () => void;
  className?: string;
  timestamp?: string;
}

const analysisSteps = [
  'Initializing analysis engine...',
  'Detecting uploaded file type...',
  'Reading dataset structure...',
  'Processing page 1 and extracting headings...',
  'Processing page 2 and reading the title...',
  'Scanning columns and data types...',
  'Finding missing values...',
  'Calculating statistical patterns...',
  'Comparing trends over time...',
  'Generating charts recommendations...',
  'Preparing final insights...',
];

const reportSections = [
  {
    title: 'Dataset Overview',
    content: `
File:
Customer Sales Report.csv

Rows:
12,450

Columns:
18

Revenue:
$2,450,000
`,
  },
  {
    title: 'Key Findings',
    content: `
• Revenue increased by 18.6%

• North America generated the highest sales

• Returning customers created 64% of revenue

• New customer churn increased by 7%
`,
  },
  {
    title: 'Recommendations',
    content: `
✓ Improve customer onboarding

✓ Launch retention campaigns

✓ Increase investment in top performing regions
`,
  },
  {
    title: 'Confidence Score',
    content: `
92% confidence based on dataset quality and pattern consistency.
`,
  },
];

const defaultResponse = `
I analyzed your customer sales dataset.

The analysis shows strong growth, but there are opportunities to improve customer retention.

Below is the generated analysis report.
`;

const Response: React.FC<ResponseProps> = ({
  content = defaultResponse,
  isStreaming = true,
  onCopy,
  onRegenerate,
  className = '',
  timestamp,
}) => {
  const [phase, setPhase] = useState<'thinking' | 'writing' | 'complete'>(
    isStreaming ? 'thinking' : 'complete'
  );
  const [activity, setActivity] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const [sections, setSections] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const stepRef = useRef(0);
  const charRef = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isStreaming) {
      setText(content);
      setSections(reportSections.map((_, i) => i));
      return;
    }

    const runAnalysis = () => {
      if (stepRef.current < analysisSteps.length) {
        const current = analysisSteps[stepRef.current];
        setActivity((prev) => [...prev.slice(-4), current]);
        setProgress(
          Math.round(((stepRef.current + 1) / analysisSteps.length) * 100)
        );
        stepRef.current++;
        timer.current = setTimeout(runAnalysis, 700);
      } else {
        setPhase('writing');
        startTyping();
      }
    };

    const startTyping = () => {
      if (charRef.current < content.length) {
        setText((prev) => prev + content[charRef.current]);
        charRef.current++;
        timer.current = setTimeout(startTyping, 20);
      } else {
        animateReport();
      }
    };

    const animateReport = () => {
      reportSections.forEach((_, index) => {
        setTimeout(() => {
          setSections((prev) => [...prev, index]);
          if (index === reportSections.length - 1) {
            setPhase('complete');
          }
        }, index * 700);
      });
    };

    runAnalysis();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [content, isStreaming]);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('w-full', className)}
    >
      <div className="flex justify-end gap-1 mb-2">
        <button
          onClick={copy}
          disabled={!text}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {copied ? (
            <FiCheck size={14} className="text-green-600 dark:text-green-400" />
          ) : (
            <FiCopy size={14} className="text-neutral-600 dark:text-neutral-400" />
          )}
        </button>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiRefreshCw size={14} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        )}
      </div>

      {phase === 'thinking' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Analyzing data...</span>
            <span>{progress}%</span>
          </div>

          <div className="h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#7FF86C]"
            />
          </div>

          <div className="mt-3 space-y-1 text-xs font-mono text-neutral-600 dark:text-neutral-400">
            {activity.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-[10px]">
                  {index === activity.length - 1 ? '→' : '✓'}
                </span>
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {phase !== 'thinking' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-neutral-900 dark:text-white leading-relaxed whitespace-pre-wrap"
        >
          {text}

          {sections.length > 0 && (
            <div className="mt-4 border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-900/50 shadow-[0_1px_0_#7FF86C,5px_1px_0_#7FF86C,5px_4px_0_#7FF86C]">
              <div className="flex justify-between items-center px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 tracking-wider">
                  analysis_report.md
                </span>
                <FiChevronDown size={12} className="text-neutral-500 dark:text-neutral-400" />
              </div>

              <div className="p-3 space-y-3">
                {sections.map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h4 className="text-[11px] font-semibold mb-1 text-neutral-900 dark:text-white">
                      {reportSections[index].title}
                    </h4>
                    <pre className="text-[10px] font-mono whitespace-pre-wrap text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {reportSections[index].content}
                    </pre>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {phase === 'complete' && (
        <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400">
          ✓ Analysis complete
        </div>
      )}
    </motion.div>
  );
};

export default Response;