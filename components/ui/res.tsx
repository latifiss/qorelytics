"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiDownload
} from "react-icons/fi";
import { cn } from "@/lib/cn";
import Indicator from "@/components/ui/indicator";
import { ChxIcon } from "@/public/icons/color";

interface ResponseProps {
  content?: string;
  role?: string;
  isStreaming?: boolean;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onDownload?: () => void;
  className?: string;
  isLast?: boolean;
}

const analysisSteps = [
  "Initializing analysis engine...",
  "Reading request...",
  "Understanding context...",
  "Analyzing information...",
  "Finding patterns...",
  "Generating insights...",
  "Preparing final response..."
];

export default function Response({
  content = "",
  role,
  isStreaming = false,
  onCopy,
  onRegenerate,
  onDownload,
  className = "",
  isLast = false
}: ResponseProps) {
  const isAssistant = role === "assistant";
  const isUser = role === "user";
  const [showResponse, setShowResponse] = useState(!isAssistant);
  const [activity, setActivity] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAssistant) return;

    setShowResponse(false);
    setActivity([]);
    setProgress(0);

    let step = 0;

    const interval = setInterval(() => {
      if (step < analysisSteps.length) {
        setActivity(prev => [
          ...prev.slice(-4),
          analysisSteps[step]
        ]);

        setProgress(
          Math.round(
            ((step + 1) / analysisSteps.length) * 100
          )
        );

        step++;
      }
    }, 350);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setShowResponse(true);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [content, isAssistant]);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn("w-full flex justify-end", className)}
      >
        <div className="max-w-[80%] border border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="text-sm text-neutral-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("w-full flex justify-start", className)}
    >
      <div className="max-w-[80%] w-full">
        {isAssistant && (
          <div className="flex justify-start gap-1 mb-2">
            <button
              onClick={copy}
              disabled={!content}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 rounded transition-colors"
            >
              {copied ? (
                <FiCheck size={14} className="text-green-600 dark:text-green-400" />
              ) : (
                <FiCopy size={14} className="text-neutral-600 dark:text-neutral-400" />
              )}
            </button>

            {onDownload && (
              <button
                onClick={onDownload}
                disabled={!content}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 rounded transition-colors"
              >
                <FiDownload size={14} className="text-neutral-600 dark:text-neutral-400" />
              </button>
            )}

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
              >
                <FiRefreshCw size={14} className="text-neutral-600 dark:text-neutral-400" />
              </button>
            )}
          </div>
        )}

        {isAssistant && !showResponse && (
          <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Thinking...</span>
              <span>{progress}%</span>
            </div>

            <div className="h-1 bg-neutral-200 dark:bg-neutral-700 overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#7FF86C]"
              />
            </div>

            <div className="space-y-1 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              {activity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 items-center"
                >
                  <span>
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
          </div>
        )}

        {showResponse && content && (
          <>
            <div className="relative">
              <div className="absolute -bottom-1 -right-1 w-full h-full border border-[#7FF86C] bg-[#7FF86C]/30" />
              
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative text-sm leading-relaxed whitespace-pre-wrap bg-white dark:bg-[#22282b] border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-neutral-900 dark:text-white"
              >
                {content}
              </motion.div>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
              <ChxIcon size={14} color="#7FF86C" />
              <span>Analysis complete</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}