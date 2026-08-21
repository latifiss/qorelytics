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

/**
 * Size used for all report point icons.
 */
const POINT_SIZE = 14;

/**
 * ---------------------------------------------------------------------------
 * RANDOM START POINT SYSTEM
 * ---------------------------------------------------------------------------
 *
 * Instead of calling Math.random() independently for every response,
 * we keep a shuffled pool of all 8 points.
 *
 * Example possible sequence:
 *
 * H → C → F → A → G → D → B → E
 *
 * Then the pool is reshuffled:
 *
 * C → H → A → F → D → E → G → B
 *
 * This gives much better randomness while preventing the same starting
 * point from appearing repeatedly in a predictable pattern.
 *
 * The only intentional restriction:
 *
 * - A point will not repeat until the current pool has been exhausted.
 * - When a new pool is created, its first point will not be the same as
 *   the previous response's starting point.
 *
 * The section assignment logic below remains completely unchanged.
 */

/**
 * Stores the shuffled starting-point pool between responses.
 *
 * This exists outside the component so it survives component renders
 * and new AnalystResponse instances.
 */
let startPointPool: number[] = [];

/**
 * Remembers the starting point used by the previous response.
 */
let previousStartPoint: number | null = null;

/**
 * Fisher-Yates shuffle.
 *
 * Produces a genuinely shuffled ordering of the point indexes.
 */
function shufflePointPool() {
  const pool = pointIcons.map(
    (_, index) => index
  );

  for (
    let i = pool.length - 1;
    i > 0;
    i--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      pool[i],
      pool[randomIndex],
    ] = [
      pool[randomIndex],
      pool[i],
    ];
  }

  /**
   * When starting a completely new cycle,
   * don't allow the first point to be the same
   * as the previous response.
   */
  if (
    previousStartPoint !== null &&
    pool.length > 1 &&
    pool[0] === previousStartPoint
  ) {
    /**
     * Pick a random position from the rest
     * of the shuffled pool and swap it with
     * the first position.
     */
    const swapIndex =
      1 +
      Math.floor(
        Math.random() *
          (pool.length - 1)
      );

    [
      pool[0],
      pool[swapIndex],
    ] = [
      pool[swapIndex],
      pool[0],
    ];
  }

  return pool;
}

/**
 * Gets the next random starting point.
 *
 * Points are consumed from a shuffled pool rather
 * than independently generated each time.
 */
function getRandomStartPoint() {
  /**
   * Create a new shuffled cycle when the
   * current cycle has been exhausted.
   */
  if (startPointPool.length === 0) {
    startPointPool =
      shufflePointPool();
  }

  /**
   * Take the next point from the shuffled pool.
   */
  const nextPoint =
    startPointPool.shift()!;

  previousStartPoint = nextPoint;

  return nextPoint;
}

/**
 * Detect list items inside report content.
 *
 * Supported:
 * - item
 * * item
 * • item
 * ✓ item
 * 1. item
 * 1) item
 */
const isListItem = (line: string) => {
  return /^\s*(?:[-*•✓]|\d+[.)])\s+/.test(
    line
  );
};

/**
 * Remove the original markdown/list bullet.
 */
const removeListBullet = (line: string) => {
  return line.replace(
    /^\s*(?:[-*•✓]|\d+[.)])\s+/,
    ''
  );
};

/**
 * Creates ONE point assignment per report section.
 *
 * This is intentionally section-based.
 *
 * Example:
 *
 * Random start = PointD
 *
 * Section 0 -> PointD
 * Section 1 -> PointE
 * Section 2 -> PointF
 * Section 3 -> PointG
 * Section 4 -> PointH
 * Section 5 -> PointA
 * Section 6 -> PointB
 * Section 7 -> PointC
 * Section 8 -> PointD
 *
 * Every list item inside the same section receives
 * the exact same point.
 */
function createPointAssignments(
  sections: typeof reportSections,
  startIndex: number
) {
  const assignments: Record<
    number,
    number
  > = {};

  let currentIndex = startIndex;

  /*
   * Tracks points used in the current cycle.
   *
   * Once all 8 have been used, the cycle resets.
   */
  let usedIndices: number[] = [];

  sections.forEach((_, sectionIndex) => {
    /*
     * If all points have been used, start
     * a fresh cycle before assigning this section.
     */
    if (
      usedIndices.length >=
      pointIcons.length
    ) {
      usedIndices = [];
    }

    let pointIndex = currentIndex;

    /*
     * Find the next unused point.
     *
     * Normally this will immediately be
     * currentIndex because we move sequentially.
     */
    let attempts = 0;

    while (
      usedIndices.includes(pointIndex) &&
      attempts < pointIcons.length
    ) {
      pointIndex =
        (pointIndex + 1) %
        pointIcons.length;

      attempts++;
    }

    /*
     * Assign exactly ONE point to this
     * entire report section.
     */
    assignments[sectionIndex] = pointIndex;

    /*
     * Mark this point as used.
     */
    usedIndices.push(pointIndex);

    /*
     * The next report section gets the
     * next point.
     */
    currentIndex =
      (pointIndex + 1) %
      pointIcons.length;
  });

  return assignments;
}

/**
 * Renders one complete report section.
 *
 * Every list item in this section uses the
 * SAME point icon.
 */
function renderReportContent(
  content: string,
  pointIndex: number
) {
  const lines = content.split('\n');

  const PointIcon =
    pointIcons[pointIndex] ?? PointA;

  return lines.map((line, index) => {
    /*
     * List item.
     *
     * Every list item gets the SAME PointIcon
     * because the point belongs to the section,
     * not the individual item.
     */
    if (isListItem(line)) {
      const remaining =
        removeListBullet(line);

      return (
        <div
          key={index}
          className="flex items-start gap-2 py-0.5"
        >
          <PointIcon
            size={POINT_SIZE}
            className="shrink-0 mt-[2px]"
          />

          <span className="min-w-0 flex-1">
            {remaining}
          </span>
        </div>
      );
    }

    /*
     * Blank line.
     */
    if (line.trim() === '') {
      return (
        <div
          key={index}
          className="h-1"
        />
      );
    }

    /*
     * Normal text.
     */
    return (
      <div
        key={index}
        className="py-0.5"
      >
        {line}
      </div>
    );
  });
}

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

  const [sections, setSections] =
    useState<number[]>([]);

  const [copied, setCopied] =
    useState(false);

  const [complete, setComplete] =
    useState(false);

  const [pointStartIndex, setPointStartIndex] =
    useState<number>(0);

  const isMounted = useRef(true);

  const hasAnimated = useRef(false);

  const timerRef =
    useRef<NodeJS.Timeout | null>(null);

  const timeoutRefs =
    useRef<NodeJS.Timeout[]>([]);

  const onStreamingCompleteRef =
    useRef(onStreamingComplete);

  const onStreamingUpdateRef =
    useRef(onStreamingUpdate);

  onStreamingCompleteRef.current =
    onStreamingComplete;

  onStreamingUpdateRef.current =
    onStreamingUpdate;

  /*
   * Pick a RANDOM starting point for every
   * new response.
   *
   * Unlike the previous implementation,
   * this uses a shuffled pool.
   *
   * Example possible sequence:
   *
   * Response 1 -> PointH
   * Response 2 -> PointC
   * Response 3 -> PointF
   * Response 4 -> PointA
   * Response 5 -> PointG
   * Response 6 -> PointD
   * Response 7 -> PointB
   * Response 8 -> PointE
   *
   * Then a new shuffled cycle begins.
   *
   * This prevents the same starting points from
   * repeatedly appearing in an obvious pattern.
   */
  useEffect(() => {
    setPointStartIndex(
      getRandomStartPoint()
    );
  }, [content]);

  useLayoutEffect(() => {
    onStreamingUpdateRef.current?.();
  }, [text, sections, complete]);

  useEffect(() => {
    if (hasAnimated.current) return;

    isMounted.current = true;

    const clearTimers = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timeoutRefs.current.forEach(
        clearTimeout
      );

      timeoutRefs.current = [];
    };

    if (!isStreaming) {
      hasAnimated.current = true;

      setText(content);

      setSections(
        showReport
          ? reportSections.map(
              (_, index) => index
            )
          : []
      );

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

      reportSections.forEach(
        (_, index) => {
          const timeout = setTimeout(
            () => {
              if (!isMounted.current)
                return;

              setSections((prev) =>
                prev.includes(index)
                  ? prev
                  : [...prev, index]
              );

              if (
                index ===
                reportSections.length - 1
              ) {
                finishResponse();
              }
            },
            index * 600
          );

          timeoutRefs.current.push(
            timeout
          );
        }
      );
    };

    const typeNextChar = () => {
      if (!isMounted.current) return;

      if (charIndex < content.length) {
        setText(
          (prev) =>
            prev +
            content.charAt(charIndex)
        );

        charIndex++;

        timerRef.current =
          setTimeout(
            typeNextChar,
            15
          );
      } else {
        revealSections();
      }
    };

    timerRef.current = setTimeout(
      typeNextChar,
      100
    );

    return () => {
      isMounted.current = false;

      clearTimers();
    };
  }, [
    content,
    isStreaming,
    showReport,
  ]);

  const copy = async () => {
    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      2000
    );

    onCopy?.();
  };

  const isTyping =
    isStreaming &&
    text.length > 0 &&
    !complete;

  /*
   * Assign ONE point to EACH report section.
   *
   * This is calculated against the entire
   * report before sections are revealed.
   *
   * Therefore revealing sections progressively
   * never changes their point.
   */
  const pointAssignments = useMemo(
    () =>
      createPointAssignments(
        reportSections,
        pointStartIndex
      ),
    [pointStartIndex]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'w-full bg-transparent',
        className
      )}
    >
      <div className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
        {text && (
          <>
            <div className="leading-tight">
              {text}
            </div>

            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-neutral-900/60 dark:bg-white/60 animate-pulse ml-0.5" />
            )}
          </>
        )}

        {showReport &&
          sections.length > 0 && (
            <div className="mt-5 w-full bg-white dark:bg-[#22282b] border-2 border-[#E5E5E5] dark:border-neutral-700 rounded-xl shadow-[0_2px_0_#E5E5E5] dark:shadow-[0_2px_0_#3a3a3a] overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#E5E5E5] dark:border-neutral-700">
                <span className="text-xs font-mono text-[#AFAFAF] dark:text-neutral-500 tracking-wider">
                  analysis_report.md
                </span>

                <FiChevronDown
                  size={14}
                  className="text-[#AFAFAF] dark:text-neutral-500"
                />
              </div>

              <div className="p-4 space-y-3">
                {sections.map(
                  (index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                    >
                      <h4 className="text-[13px] font-semibold text-[#4B4B4B] dark:text-neutral-200 mb-1">
                        {
                          reportSections[
                            index
                          ].title
                        }
                      </h4>

                      <div className="text-[11px] font-mono text-[#6B6B6B] dark:text-neutral-400 leading-normal">
                        {renderReportContent(
                          reportSections[
                            index
                          ].content,
                          pointAssignments[
                            index
                          ] ?? 0
                        )}
                      </div>
                    </motion.div>
                  )
                )}
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
            <CopyIcon
              size={18}
              className="text-[#AFAFAF] dark:text-neutral-500"
            />
          </button>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded"
            >
              <RefreshIcon
                size={18}
                className="text-[#AFAFAF] dark:text-neutral-500"
              />
            </button>
          )}

          <DownloadAs
            onClick={() => {}}
          />
        </div>
      )}
    </motion.div>
  );
}