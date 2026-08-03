'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiChevronDown,
  FiCopy,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';

import { cn } from '@/lib/cn';
import { reportSections, defaultResponse } from './analysis-data';
import { AnalystResponseProps } from './types';

export default function AnalystResponse({
  content = defaultResponse,
  isStreaming = true,
  className,
  showReport = true,
  onCopy,
  onRegenerate,
  onStreamingComplete,
  onStreamingUpdate,
}: AnalystResponseProps) {
  const [text, setText] = useState('');
  const [sections, setSections] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [complete, setComplete] = useState(false);

  const isMounted = useRef(true);
  const hasAnimated = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const onStreamingCompleteRef = useRef(onStreamingComplete);
  const onStreamingUpdateRef = useRef(onStreamingUpdate);

  onStreamingCompleteRef.current = onStreamingComplete;
  onStreamingUpdateRef.current = onStreamingUpdate;

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

          setSections((prev) =>
            prev.includes(index) ? prev : [...prev, index]
          );

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

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analysis-report.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const isTyping = isStreaming && text.length > 0 && !complete;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('w-full', className)}
    >
      <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
        {text && (
          <>
            <span>{text}</span>
            {isTyping && (
              <span className="inline-block w-[2px] h-4 bg-foreground/60 animate-pulse ml-0.5" />
            )}
          </>
        )}

        {showReport && sections.length > 0 && (
          <div className="mt-4 border border-subtle overflow-hidden bg-fill-alpha-subtle shadow-[0_1px_0_#7FF86C,5px_1px_0_#7FF86C,5px_4px_0_#7FF86C]">
            <div className="flex justify-between items-center px-3 py-1.5 border-b border-subtle">
              <span className="text-[10px] font-mono text-muted tracking-wider">
                analysis_report.md
              </span>
              <FiChevronDown size={12} color="var(--text-secondary)" />
            </div>
            <div className="p-3 space-y-3">
              {sections.map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-[11px] font-semibold mb-1">
                    {reportSections[index].title}
                  </h4>
                  <pre className="text-[10px] font-mono whitespace-pre-wrap text-muted leading-relaxed">
                    {reportSections[index].content}
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {complete && (
        <>
          <div className="mt-4 flex items-center gap-1">
            <button
              onClick={copy}
              disabled={!text}
              className="p-1.5 hover:bg-fill-alpha-subtle transition-colors disabled:opacity-50"
            >
              {copied ? (
                <FiCheck size={14} color="var(--status-success)" />
              ) : (
                <FiCopy size={14} color="var(--text-secondary)" />
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 hover:bg-fill-alpha-subtle transition-colors"
              >
                <FiRefreshCw size={14} color="var(--text-secondary)" />
              </button>
            )}

            <button
              onClick={download}
              disabled={!text}
              className="p-1.5 hover:bg-fill-alpha-subtle transition-colors disabled:opacity-50"
            >
              <FiDownload size={14} color="var(--text-secondary)" />
            </button>
          </div>

          {showReport && (
            <div className="mt-3 pt-2 border-t border-subtle text-[10px] text-muted">
              ✓ Analysis complete
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
