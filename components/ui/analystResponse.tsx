'use client';

import React, {
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

import {
  ChartConfig,
  ChartDataPoint,
} from '@/components/charts/types/chart.types';

import { DownloadAs } from './downloadAs';

/* -------------------------------------------------------------------------- */
/*                                  POINTS                                    */
/* -------------------------------------------------------------------------- */

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
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [pool[i], pool[randomIndex]] = [
      pool[randomIndex],
      pool[i],
    ];
  }

  if (
    previousStartPoint !== null &&
    pool.length > 1 &&
    pool[0] === previousStartPoint
  ) {
    const swapIndex =
      1 +
      Math.floor(
        Math.random() * (pool.length - 1)
      );

    [pool[0], pool[swapIndex]] = [
      pool[swapIndex],
      pool[0],
    ];
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

/* -------------------------------------------------------------------------- */
/*                              LIST HELPERS                                  */
/* -------------------------------------------------------------------------- */

const isListItem = (line: string) => {
  return /^\s*(?:[-*•✓]|\d+[.)])\s+/.test(line);
};

const removeListBullet = (line: string) => {
  return line.replace(
    /^\s*(?:[-*•✓]|\d+[.)])\s+/,
    ''
  );
};

/* -------------------------------------------------------------------------- */
/*                           POINT ASSIGNMENTS                                */
/* -------------------------------------------------------------------------- */

function createPointAssignments(
  sections: typeof reportSections,
  startIndex: number
) {
  const assignments: Record<number, number> = {};

  let currentIndex = startIndex;
  let usedIndices: number[] = [];

  sections.forEach((_, sectionIndex) => {
    if (usedIndices.length >= pointIcons.length) {
      usedIndices = [];
    }

    let pointIndex = currentIndex;
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

    assignments[sectionIndex] = pointIndex;

    usedIndices.push(pointIndex);

    currentIndex =
      (pointIndex + 1) %
      pointIcons.length;
  });

  return assignments;
}

/* -------------------------------------------------------------------------- */
/*                                  CHARTS                                    */
/* -------------------------------------------------------------------------- */

interface ChartData {
  config: ChartConfig;
  data: ChartDataPoint[];
}

interface ExtendedAnalystResponseProps
  extends AnalystResponseProps {
  chartData?: ChartData[];
}

/* -------------------------------------------------------------------------- */
/*                           CHART MARKER PARSER                              */
/* -------------------------------------------------------------------------- */

function getChartIndex(
  line: string
): number | null {
  let normalized = line.trim();

  if (!normalized) {
    return null;
  }

  normalized = normalized
    .replace(/^```+/, '')
    .replace(/```+$/, '')
    .trim();

  normalized = normalized
    .replace(/^\*\*(.*?)\*\*$/s, '$1')
    .replace(/^__(.*?)__$/s, '$1')
    .replace(/^`(.*?)`$/s, '$1')
    .trim();

  const match = normalized.match(
    /^\[CHART:(\d+)\]$/i
  );

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

/* -------------------------------------------------------------------------- */
/*                        REPORT INLINE MARKDOWN                              */
/* -------------------------------------------------------------------------- */

function renderInlineMarkdown(
  text: string
): React.ReactNode {
  const parts: React.ReactNode[] = [];

  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const match = remaining.match(
      /(\*\*(.+?)\*\*|__(.+?)__|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/
    );

    if (
      !match ||
      match.index === undefined
    ) {
      parts.push(
        <React.Fragment key={key++}>
          {remaining}
        </React.Fragment>
      );

      break;
    }

    if (match.index > 0) {
      parts.push(
        <React.Fragment key={key++}>
          {remaining.slice(
            0,
            match.index
          )}
        </React.Fragment>
      );
    }

    /* Bold */

    if (match[2] || match[3]) {
      parts.push(
        <strong
          key={key++}
          className="font-semibold"
        >
          {match[2] ?? match[3]}
        </strong>
      );
    }

    /* Inline code */

    else if (match[4]) {
      parts.push(
        <code
          key={key++}
          className="
            rounded
            bg-neutral-100
            px-1
            py-0.5
            text-[0.95em]
            dark:bg-neutral-800
          "
        >
          {match[4]}
        </code>
      );
    }

    /* Markdown link */

    else if (match[5]) {
      parts.push(
        <span
          key={key++}
          className="underline underline-offset-2"
        >
          {match[5]}
        </span>
      );
    }

    remaining = remaining.slice(
      match.index + match[0].length
    );
  }

  return parts;
}

/* -------------------------------------------------------------------------- */
/*                           REPORT UI RENDERER                               */
/* -------------------------------------------------------------------------- */

function renderReportContent(
  content: string,
  pointIndex: number,
  chartData: ChartData[] | undefined,
  chartRefs: React.MutableRefObject<
    Record<number, HTMLDivElement | null>
  >
) {
  const lines = content.split('\n');

  const PointIcon =
    pointIcons[pointIndex] ?? PointA;

  const result: React.ReactNode[] = [];

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const line = lines[i];
    const trimmedLine = line.trim();

    /* ---------------------------------------------------------------------- */
    /*                                  CHART                                 */
    /* ---------------------------------------------------------------------- */

    const chartIndex =
      getChartIndex(trimmedLine);

    if (chartIndex !== null) {
      const chart =
        chartData?.[chartIndex];

      if (!chart) {
        console.warn(
          `[AnalystResponse] Chart marker [CHART:${chartIndex}] was found, but chartData[${chartIndex}] is unavailable.`,
          {
            chartIndex,
            chartData,
          }
        );

        continue;
      }

      result.push(
        <div
          key={`chart-${i}-${chartIndex}`}
          ref={(element) => {
            chartRefs.current[chartIndex] =
              element;
          }}
          data-chart-index={chartIndex}
          data-chart-container="true"
          data-pdf-hide-border="true"
          className="
            my-5
            w-full
            rounded-xl
            bg-white
            dark:bg-[#171b1d]
            border
            border-[#E5E5E5]
            dark:border-[#3a3a3a]
            p-3
            shadow-[0_1px_0_#E5E5E5]
            dark:shadow-[0_1px_0_#3a3a3a]
          "
        >
          <ChartEngine
            data={chart.data}
            config={chart.config}
            height={280}
            autoDetect={false}
            className="
              w-full
              !border-0
              !outline-0
              !shadow-none
            "
          />
        </div>
      );

      continue;
    }

    /* ---------------------------------------------------------------------- */
    /*                                   LIST                                 */
    /* ---------------------------------------------------------------------- */

    if (isListItem(line)) {
      const remaining =
        removeListBullet(line);

      result.push(
        <div
          key={`line-${i}`}
          className="flex items-start gap-2 py-0.5"
        >
          <PointIcon
            size={POINT_SIZE}
            className="mt-[2px] shrink-0"
          />

          <span className="min-w-0 flex-1">
            {renderInlineMarkdown(
              remaining
            )}
          </span>
        </div>
      );

      continue;
    }

    /* ---------------------------------------------------------------------- */
    /*                                  EMPTY                                 */
    /* ---------------------------------------------------------------------- */

    if (trimmedLine === '') {
      result.push(
        <div
          key={`empty-${i}`}
          className="h-1"
        />
      );

      continue;
    }

    /* ---------------------------------------------------------------------- */
    /*                               PARAGRAPH                                */
    /* ---------------------------------------------------------------------- */

    result.push(
      <div
        key={`line-${i}`}
        className="py-0.5"
      >
        {renderInlineMarkdown(line)}
      </div>
    );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                       REPORT MARKDOWN GENERATOR                            */
/* -------------------------------------------------------------------------- */

/**
 * This is intentionally generated from reportSections only.
 *
 * The response text, report card header, buttons, etc. are NOT included.
 *
 * This is the actual analysis_report.md content that becomes the PDF.
 */

function buildReportMarkdown() {
  return reportSections
    .map((section) => {
      const title =
        section.title.trim();

      const content =
        section.content.trim();

      return `# ${title}\n\n${content}`;
    })
    .join('\n\n');
}

/* -------------------------------------------------------------------------- */
/*                         MARKDOWN TEXT CLEANING                             */
/* -------------------------------------------------------------------------- */

function cleanMarkdownText(
  text: string
) {
  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      '$1'
    )
    .replace(
      /__(.*?)__/g,
      '$1'
    )
    .replace(
      /`([^`]+)`/g,
      '$1'
    )
    .replace(
      /~~(.*?)~~/g,
      '$1'
    )
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      '$1'
    )
    .trim();
}

/* -------------------------------------------------------------------------- */
/*                              MARKDOWN PARSER                               */
/* -------------------------------------------------------------------------- */

type ParsedMarkdownLine =
  | {
      type: 'empty';
      text: '';
    }
  | {
      type: 'chart';
      text: '';
      chartIndex?: number;
    }
  | {
      type: 'h1';
      text: string;
    }
  | {
      type: 'h2';
      text: string;
    }
  | {
      type: 'h3';
      text: string;
    }
  | {
      type: 'bullet';
      text: string;
    }
  | {
      type: 'number';
      number: string;
      text: string;
    }
  | {
      type: 'paragraph';
      text: string;
    };

function parseMarkdownLine(
  line: string
): ParsedMarkdownLine {
  const trimmed = line.trim();

  if (!trimmed) {
    return {
      type: 'empty',
      text: '',
    };
  }

  const chartIndex =
    getChartIndex(trimmed);

  if (chartIndex !== null) {
    return {
      type: 'chart',
      text: '',
      chartIndex,
    };
  }

  if (/^#\s+/.test(trimmed)) {
    return {
      type: 'h1',
      text: cleanMarkdownText(
        trimmed.replace(
          /^#\s+/,
          ''
        )
      ),
    };
  }

  if (/^##\s+/.test(trimmed)) {
    return {
      type: 'h2',
      text: cleanMarkdownText(
        trimmed.replace(
          /^##\s+/,
          ''
        )
      ),
    };
  }

  if (/^###\s+/.test(trimmed)) {
    return {
      type: 'h3',
      text: cleanMarkdownText(
        trimmed.replace(
          /^###\s+/,
          ''
        )
      ),
    };
  }

  if (/^[-*•✓]\s+/.test(trimmed)) {
    return {
      type: 'bullet',
      text: cleanMarkdownText(
        trimmed.replace(
          /^[-*•✓]\s+/,
          ''
        )
      ),
    };
  }

  if (/^\d+[.)]\s+/.test(trimmed)) {
    const match =
      trimmed.match(
        /^(\d+)[.)]\s+(.*)$/
      );

    return {
      type: 'number',
      number:
        match?.[1] ?? '',
      text: cleanMarkdownText(
        match?.[2] ??
          trimmed
      ),
    };
  }

  return {
    type: 'paragraph',
    text: cleanMarkdownText(
      trimmed
    ),
  };
}

/* -------------------------------------------------------------------------- */
/*                     COLOR SANITIZER FOR CHART CAPTURE                      */
/* -------------------------------------------------------------------------- */

function sanitizeCloneForPDF(
  clone: HTMLElement
) {
  const allElements = [
    clone,
    ...Array.from(
      clone.querySelectorAll<HTMLElement>(
        '*'
      )
    ),
  ];

  /* ------------------------------------------------------------------------ */
  /*                         PRESERVE CHART COLORS                            */
  /* ------------------------------------------------------------------------ */

  allElements.forEach(
    (element) => {
      const computed =
        window.getComputedStyle(
          element
        );

      const properties = [
        'color',
        'backgroundColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
        'outlineColor',
        'textDecorationColor',
        'fill',
        'stroke',
      ];

      properties.forEach(
        (property) => {
          const value =
            computed.getPropertyValue(
              property
            );

          if (
            !value ||
            value ===
              'transparent' ||
            value ===
              'rgba(0, 0, 0, 0)'
          ) {
            return;
          }

          if (
            value.includes('lab(') ||
            value.includes('lch(') ||
            value.includes('oklab(') ||
            value.includes('oklch(')
          ) {
            return;
          }

          element.style.setProperty(
            property,
            value,
            'important'
          );
        }
      );
    }
  );

  /* ------------------------------------------------------------------------ */
  /*                        REMOVE ONLY WEB BORDER                            */
  /* ------------------------------------------------------------------------ */

  const chartContainers =
    clone.querySelectorAll<HTMLElement>(
      '[data-pdf-hide-border="true"]'
    );

  chartContainers.forEach(
    (chartContainer) => {
      chartContainer.style.setProperty(
        'border',
        'none',
        'important'
      );

      chartContainer.style.setProperty(
        'border-width',
        '0',
        'important'
      );

      chartContainer.style.setProperty(
        'border-style',
        'none',
        'important'
      );

      chartContainer.style.setProperty(
        'border-color',
        'transparent',
        'important'
      );

      chartContainer.style.setProperty(
        'box-shadow',
        'none',
        'important'
      );
    }
  );

  /* ------------------------------------------------------------------------ */
  /*                              ROOT ELEMENT                                */
  /* ------------------------------------------------------------------------ */

  if (
    clone.matches(
      '[data-pdf-hide-border="true"]'
    )
  ) {
    clone.style.setProperty(
      'border',
      'none',
      'important'
    );

    clone.style.setProperty(
      'border-width',
      '0',
      'important'
    );

    clone.style.setProperty(
      'border-style',
      'none',
      'important'
    );

    clone.style.setProperty(
      'border-color',
      'transparent',
      'important'
    );

    clone.style.setProperty(
      'box-shadow',
      'none',
      'important'
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                            PDF BACKGROUND                                */
  /* ------------------------------------------------------------------------ */

  clone.style.setProperty(
    'background-color',
    '#ffffff',
    'important'
  );

  clone.style.setProperty(
    'color',
    '#1f1f1f',
    'important'
  );
}

/* -------------------------------------------------------------------------- */
/*                              CAPTURE CHART                                 */
/* -------------------------------------------------------------------------- */

async function captureChart(
  element: HTMLElement
) {
  const {
    toPng,
  } = await import(
    'html-to-image'
  );

  return await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',

    onClone: (
      clonedNode
    ) => {
      if (
        clonedNode instanceof
        HTMLElement
      ) {
        sanitizeCloneForPDF(
          clonedNode
        );
      }
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              PDF EXPORTER                                  */
/* -------------------------------------------------------------------------- */

async function exportReportMarkdownToPDF(
  markdown: string,
  chartElements: Record<
    number,
    HTMLDivElement | null
  >
) {
  const { jsPDF } =
    await import('jspdf');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  /* ---------------------------------------------------------------------- */
  /*                            PAGE SETUP                                  */
  /* ---------------------------------------------------------------------- */

  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 20;
  const marginBottom = 18;

  const contentWidth =
    pageWidth -
    marginLeft -
    marginRight;

  const bottomLimit =
    pageHeight -
    marginBottom;

  let y = marginTop;

  const addPage = () => {
    pdf.addPage();
    y = marginTop;
  };

  const ensureSpace = (
    height: number
  ) => {
    if (
      y + height >
      bottomLimit
    ) {
      addPage();
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                           TEXT RENDERER                                */
  /* ---------------------------------------------------------------------- */

  const writeWrappedText = (
    text: string,
    options: {
      fontSize: number;
      fontStyle?:
        | 'normal'
        | 'bold';
      lineHeight?: number;
      indent?: number;
      bullet?: string;
      color?: [
        number,
        number,
        number
      ];
      after?: number;
    }
  ) => {
    const {
      fontSize,
      fontStyle = 'normal',
      lineHeight = 4.8,
      indent = 0,
      bullet,
      color = [
        55,
        55,
        55,
      ],
      after = 0,
    } = options;

    pdf.setFont(
      'helvetica',
      fontStyle
    );

    pdf.setFontSize(
      fontSize
    );

    pdf.setTextColor(
      color[0],
      color[1],
      color[2]
    );

    const availableWidth =
      contentWidth -
      indent;

    const lines =
      pdf.splitTextToSize(
        text,
        availableWidth
      );

    for (
      let index = 0;
      index < lines.length;
      index++
    ) {
      ensureSpace(
        lineHeight
      );

      if (
        bullet &&
        index === 0
      ) {
        pdf.text(
          bullet,
          marginLeft +
            indent -
            4,
          y
        );
      }

      pdf.text(
        lines[index],
        marginLeft +
          indent,
        y
      );

      y += lineHeight;
    }

    y += after;
  };

  /* ---------------------------------------------------------------------- */
  /*                                  CHART                                 */
  /* ---------------------------------------------------------------------- */

  const writeChartToPDF =
    async (
      chartIndex: number
    ) => {
      const element =
        chartElements[
          chartIndex
        ];

      if (!element) {
        console.warn(
          `[PDF] Chart ${chartIndex} could not be found in the DOM.`
        );

        return;
      }

      try {
        const dataUrl =
          await captureChart(
            element
          );

        const sourceWidth =
          element.offsetWidth ||
          700;

        const sourceHeight =
          element.offsetHeight ||
          320;

        const maxWidth =
          contentWidth;

        const maxHeight = 88;

        let chartWidth =
          maxWidth;

        let chartHeight =
          (sourceHeight /
            sourceWidth) *
          chartWidth;

        if (
          chartHeight >
          maxHeight
        ) {
          chartHeight =
            maxHeight;

          chartWidth =
            (sourceWidth /
              sourceHeight) *
            chartHeight;
        }

        ensureSpace(
          chartHeight + 10
        );

        const x =
          marginLeft +
          (contentWidth -
            chartWidth) /
            2;

        y += 2;

        pdf.addImage(
          dataUrl,
          'PNG',
          x,
          y,
          chartWidth,
          chartHeight,
          undefined,
          'FAST'
        );

        y +=
          chartHeight + 7;
      } catch (error) {
        console.error(
          `[PDF] Failed to capture chart ${chartIndex}:`,
          error
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /*                            REPORT CONTENT                              */
  /* ---------------------------------------------------------------------- */

  const parsedLines =
    markdown
      .split(/\r?\n/)
      .map(
        parseMarkdownLine
      );

  for (
    let i = 0;
    i < parsedLines.length;
    i++
  ) {
    const line =
      parsedLines[i];

    /* EMPTY */

    if (
      line.type ===
      'empty'
    ) {
      y += 2.5;
      continue;
    }

    /* CHART */

    if (
      line.type ===
      'chart'
    ) {
      if (
        line.chartIndex !==
        undefined
      ) {
        await writeChartToPDF(
          line.chartIndex
        );
      }

      continue;
    }

    /* H1 */

    if (
      line.type ===
      'h1'
    ) {
      ensureSpace(18);

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        20
      );

      pdf.setTextColor(
        25,
        25,
        25
      );

      const titleLines =
        pdf.splitTextToSize(
          line.text,
          contentWidth
        );

      for (
        const titleLine of
          titleLines
      ) {
        ensureSpace(10);

        pdf.text(
          titleLine,
          marginLeft,
          y
        );

        y += 8;
      }

      y += 4;

      continue;
    }

    /* H2 */

    if (
      line.type ===
      'h2'
    ) {
      ensureSpace(13);

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        14
      );

      pdf.setTextColor(
        45,
        45,
        45
      );

      const headingLines =
        pdf.splitTextToSize(
          line.text,
          contentWidth
        );

      for (
        const headingLine of
          headingLines
      ) {
        ensureSpace(7);

        pdf.text(
          headingLine,
          marginLeft,
          y
        );

        y += 6.5;
      }

      y += 2;

      continue;
    }

    /* H3 */

    if (
      line.type ===
      'h3'
    ) {
      ensureSpace(11);

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        11.5
      );

      pdf.setTextColor(
        55,
        55,
        55
      );

      const headingLines =
        pdf.splitTextToSize(
          line.text,
          contentWidth
        );

      for (
        const headingLine of
          headingLines
      ) {
        ensureSpace(6);

        pdf.text(
          headingLine,
          marginLeft,
          y
        );

        y += 5.5;
      }

      y += 1.5;

      continue;
    }

    /* BULLET */

    if (
      line.type ===
      'bullet'
    ) {
      ensureSpace(7);

      writeWrappedText(
        line.text,
        {
          fontSize: 10,
          fontStyle:
            'normal',
          lineHeight: 4.8,
          indent: 6,
          bullet: '•',
          color: [
            55,
            55,
            55,
          ],
          after: 1,
        }
      );

      continue;
    }

    /* NUMBER */

    if (
      line.type ===
      'number'
    ) {
      ensureSpace(7);

      writeWrappedText(
        line.text,
        {
          fontSize: 10,
          fontStyle:
            'normal',
          lineHeight: 4.8,
          indent: 7,
          bullet: `${line.number}.`,
          color: [
            55,
            55,
            55,
          ],
          after: 1,
        }
      );

      continue;
    }

    /* PARAGRAPH */

    if (
      line.type ===
      'paragraph'
    ) {
      writeWrappedText(
        line.text,
        {
          fontSize: 10,
          fontStyle:
            'normal',
          lineHeight: 4.8,
          color: [
            55,
            55,
            55,
          ],
          after: 2,
        }
      );

      continue;
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                                  FOOTER                                */
  /* ---------------------------------------------------------------------- */

  const totalPages =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pdf.setPage(page);

    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(8);

    pdf.setTextColor(
      150,
      150,
      150
    );

    pdf.text(
      'Qorelytics • Analysis Report',
      marginLeft,
      pageHeight - 9
    );

    pdf.text(
      `${page} / ${totalPages}`,
      pageWidth -
        marginRight,
      pageHeight - 9,
      {
        align: 'right',
      }
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                                   SAVE                                 */
  /* ---------------------------------------------------------------------- */

  const now =
    new Date();

  const dateStr =
    now
      .toISOString()
      .split('T')[0];

  const timestamp =
    now.getTime();

  const filename =
    `qorelytics-${dateStr}-${timestamp}.pdf`;

  pdf.save(filename);
}

/* -------------------------------------------------------------------------- */
/*                             MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

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
  const [text, setText] =
    useState('');

  const [sections, setSections] =
    useState<number[]>([]);

  const [copied, setCopied] =
    useState(false);

  const [complete, setComplete] =
    useState(false);

  const [
    pointStartIndex,
    setPointStartIndex,
  ] = useState<number>(0);

  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  /*
   * Forces a complete replay of the response animation.
   */
  const [
    animationKey,
    setAnimationKey,
  ] = useState(0);

  /*
   * IMPORTANT:
   *
   * After the first response has completed, the parent will normally have
   * isStreaming=false.
   *
   * Regenerate therefore needs its own streaming state so that the response
   * does NOT immediately render when the regenerate button is pressed.
   */
  const [
    isRegenerating,
    setIsRegenerating,
  ] = useState(false);

  const isMounted =
    useRef(true);

  const timerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const timeoutRefs =
    useRef<
      ReturnType<
        typeof setTimeout
      >[]
    >([]);

  const chartRefs =
    useRef<
      Record<
        number,
        HTMLDivElement | null
      >
    >({});

  const onStreamingCompleteRef =
    useRef(
      onStreamingComplete
    );

  const onStreamingUpdateRef =
    useRef(
      onStreamingUpdate
    );

  const responseRef =
    useRef<HTMLDivElement>(
      null
    );

  onStreamingCompleteRef.current =
    onStreamingComplete;

  onStreamingUpdateRef.current =
    onStreamingUpdate;

  /* ---------------------------------------------------------------------- */
  /*                           RANDOM POINT                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setPointStartIndex(
      getRandomStartPoint()
    );
  }, [
    content,
    animationKey,
  ]);

  /* ---------------------------------------------------------------------- */
  /*                         STREAMING UPDATE                               */
  /* ---------------------------------------------------------------------- */

  useLayoutEffect(() => {
    onStreamingUpdateRef.current?.();
  }, [
    text,
    sections,
    complete,
  ]);

  /* ---------------------------------------------------------------------- */
  /*                              STREAMING                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    isMounted.current = true;

    const clearTimers = () => {
      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );

        timerRef.current =
          null;
      }

      timeoutRefs.current.forEach(
        (timeout) => {
          clearTimeout(
            timeout
          );
        }
      );

      timeoutRefs.current =
        [];
    };

    /*
     * Every time the response content changes OR animationKey changes,
     * completely restart the animation.
     */
    clearTimers();

    setText('');
    setSections([]);
    setComplete(false);

    /*
     * ---------------------------------------------------------------
     * IMPORTANT REGENERATE FIX
     * ---------------------------------------------------------------
     *
     * Normally, when the original response has completed:
     *
     *     isStreaming === false
     *
     * But after clicking Regenerate we want to stream again.
     *
     * Therefore:
     *
     *     isStreaming || isRegenerating
     *
     * determines whether this run should animate.
     */
    const shouldStream =
      isStreaming ||
      isRegenerating;

    /* -------------------------------------------------------------------- */
    /*                         NON STREAMING                                 */
    /* -------------------------------------------------------------------- */

    if (!shouldStream) {
      setText(content);

      setSections(
        showReport
          ? reportSections.map(
              (_, index) =>
                index
            )
          : []
      );

      setComplete(true);

      return () => {
        isMounted.current =
          false;

        clearTimers();
      };
    }

    let charIndex = 0;

    /* -------------------------------------------------------------------- */
    /*                               FINISH                                 */
    /* -------------------------------------------------------------------- */

    const finishResponse =
      () => {
        if (
          !isMounted.current
        ) {
          return;
        }

        setComplete(true);

        /*
         * The replay is finished.
         *
         * Reset this AFTER the animation has completed.
         *
         * We intentionally do not include isRegenerating in the effect
         * dependency list, so changing it here does NOT cause the response
         * to instantly reset/render again.
         */
        if (isRegenerating) {
          setIsRegenerating(false);
        }

        onStreamingCompleteRef.current?.();
      };

    /* -------------------------------------------------------------------- */
    /*                              SECTIONS                                */
    /* -------------------------------------------------------------------- */

    const revealSections =
      () => {
        if (!showReport) {
          finishResponse();
          return;
        }

        reportSections.forEach(
          (_, index) => {
            const timeout =
              setTimeout(
                () => {
                  if (
                    !isMounted.current
                  ) {
                    return;
                  }

                  setSections(
                    (prev) =>
                      prev.includes(
                        index
                      )
                        ? prev
                        : [
                            ...prev,
                            index,
                          ]
                  );

                  if (
                    index ===
                    reportSections.length -
                      1
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

    /* -------------------------------------------------------------------- */
    /*                               TYPING                                 */
    /* -------------------------------------------------------------------- */

    const typeNextChar =
      () => {
        if (
          !isMounted.current
        ) {
          return;
        }

        if (
          charIndex <
          content.length
        ) {
          const nextCharacter =
            content.charAt(
              charIndex
            );

          setText(
            (prev) =>
              prev +
              nextCharacter
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

    /*
     * Same initial delay as the original response.
     */
    timerRef.current =
      setTimeout(
        typeNextChar,
        100
      );

    return () => {
      isMounted.current =
        false;

      clearTimers();
    };
  }, [
    content,
    isStreaming,
    showReport,
    animationKey,
  ]);

  /* ---------------------------------------------------------------------- */
  /*                                COPY                                    */
  /* ---------------------------------------------------------------------- */

  const copy = async () => {
    if (
      !text &&
      !showReport
    ) {
      return;
    }

    const reportMarkdown =
      showReport
        ? buildReportMarkdown()
        : '';

    const parts: string[] = [];

    if (text.trim()) {
      parts.push(
        text.trim()
      );
    }

    if (
      reportMarkdown.trim()
    ) {
      parts.push(
        reportMarkdown.trim()
      );
    }

    const fullText =
      parts.join(
        '\n\n'
      );

    if (!fullText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        fullText
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        2000
      );

      onCopy?.();
    } catch (error) {
      console.error(
        '[Copy] Failed to copy response:',
        error
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                             REGENERATE                                 */
  /* ---------------------------------------------------------------------- */

  const handleRegenerate =
    () => {
      if (
        !onRegenerate ||
        isDownloading ||
        isRegenerating
      ) {
        return;
      }

      /*
       * ---------------------------------------------------------------
       * STOP CURRENT ANIMATION
       * ---------------------------------------------------------------
       */

      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );

        timerRef.current =
          null;
      }

      timeoutRefs.current.forEach(
        (timeout) => {
          clearTimeout(
            timeout
          );
        }
      );

      timeoutRefs.current =
        [];

      /*
       * ---------------------------------------------------------------
       * CLEAR OLD RESPONSE
       * ---------------------------------------------------------------
       */

      setText('');
      setSections([]);
      setComplete(false);
      setCopied(false);

      /*
       * ---------------------------------------------------------------
       * CLEAR OLD CHART REFERENCES
       * ---------------------------------------------------------------
       */

      chartRefs.current = {};

      /*
       * ---------------------------------------------------------------
       * FORCE REPLAY MODE
       * ---------------------------------------------------------------
       *
       * This is the important part.
       *
       * Even though the original response has already completed and
       * isStreaming is probably false, this state tells the streaming
       * effect that the regenerated response MUST be animated.
       */
      setIsRegenerating(true);

      /*
       * ---------------------------------------------------------------
       * FORCE THE EFFECT TO RUN AGAIN
       * ---------------------------------------------------------------
       *
       * This also handles the case where the regenerated content is
       * identical to the previous content.
       */
      setAnimationKey(
        (previous) =>
          previous + 1
      );

      /*
       * ---------------------------------------------------------------
       * ASK PARENT FOR NEW RESPONSE
       * ---------------------------------------------------------------
       */
      onRegenerate();
    };

  /* ---------------------------------------------------------------------- */
  /*                              DOWNLOAD                                  */
  /* ---------------------------------------------------------------------- */

  const handleDownloadPDF =
    async () => {
      if (isDownloading) {
        return;
      }

      if (!complete) {
        return;
      }

      if (!showReport) {
        return;
      }

      /*
       * Wait for the final charts to actually exist in the DOM before
       * capturing them.
       */
      await new Promise<void>(
        (resolve) => {
          requestAnimationFrame(
            () => {
              requestAnimationFrame(
                () => resolve()
              );
            }
          );
        }
      );

      setIsDownloading(true);

      try {
        /*
         * PDF is generated only from reportSections -> markdown.
         *
         * The streamed response/header/buttons are NOT included.
         */
        const reportMarkdown =
          buildReportMarkdown();

        await exportReportMarkdownToPDF(
          reportMarkdown,
          chartRefs.current
        );
      } catch (error) {
        console.error(
          '[PDF] Download failed:',
          error
        );
      } finally {
        setIsDownloading(
          false
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /*                                STATE                                   */
  /* ---------------------------------------------------------------------- */

  const isTyping =
    (isStreaming ||
      isRegenerating) &&
    text.length > 0 &&
    !complete;

  const pointAssignments =
    useMemo(
      () =>
        createPointAssignments(
          reportSections,
          pointStartIndex
        ),
      [pointStartIndex]
    );

  /* ---------------------------------------------------------------------- */
  /*                                RENDER                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <motion.div
      ref={responseRef}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className={cn(
        'w-full bg-transparent',
        className
      )}
    >
      {/* ---------------------------------------------------------------- */}
      {/* RESPONSE TEXT                                                    */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="
          text-sm
          text-neutral-900
          dark:text-white
          whitespace-pre-wrap
        "
      >
        {text && (
          <>
            <div className="leading-tight">
              {text}
            </div>

            {isTyping && (
              <span
                className="
                  inline-block
                  w-0.5
                  h-4
                  bg-neutral-900/60
                  dark:bg-white/60
                  animate-pulse
                  ml-0.5
                "
              />
            )}
          </>
        )}

        {/* -------------------------------------------------------------- */}
        {/* REPORT                                                         */}
        {/* -------------------------------------------------------------- */}

        {showReport &&
          sections.length > 0 && (
            <div
              className="
                mt-5
                w-full
                bg-white
                dark:bg-[#22282b]
                border-2
                border-[#E5E5E5]
                dark:border-neutral-700
                rounded-xl
                shadow-[0_2px_0_#E5E5E5]
                dark:shadow-[0_2px_0_#3a3a3a]
                overflow-hidden
              "
            >
              {/* -------------------------------------------------------- */}
              {/* HEADER                                                     */}
              {/* -------------------------------------------------------- */}

              <div
                className="
                  flex
                  justify-between
                  items-center
                  px-4
                  py-2.5
                  border-b
                  border-[#E5E5E5]
                  dark:border-neutral-700
                "
              >
                <span
                  className="
                    text-xs
                    font-mono
                    text-[#AFAFAF]
                    dark:text-neutral-500
                    tracking-wider
                  "
                >
                  analysis_report.md
                </span>

                <FiChevronDown
                  size={14}
                  className="
                    text-[#AFAFAF]
                    dark:text-neutral-500
                  "
                />
              </div>

              {/* -------------------------------------------------------- */}
              {/* CONTENT                                                    */}
              {/* -------------------------------------------------------- */}

              <div className="p-4 space-y-3">
                {sections.map(
                  (index) => (
                    <motion.div
                      key={`${animationKey}-${index}`}
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
                      <h4
                        className="
                          text-[13px]
                          font-semibold
                          text-[#4B4B4B]
                          dark:text-neutral-200
                          mb-1
                        "
                      >
                        {
                          reportSections[
                            index
                          ].title
                        }
                      </h4>

                      <div
                        className="
                          text-[11px]
                          font-mono
                          text-[#6B6B6B]
                          dark:text-neutral-400
                          leading-normal
                        "
                      >
                        {renderReportContent(
                          reportSections[
                            index
                          ].content,
                          pointAssignments[
                            index
                          ] ?? 0,
                          chartData,
                          chartRefs
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* ACTIONS                                                          */}
      {/* ---------------------------------------------------------------- */}

      {complete && (
        <div className="mt-3 flex items-center gap-0">
          {/* ------------------------------------------------------------ */}
          {/* COPY                                                          */}
          {/* ------------------------------------------------------------ */}

          <button
            type="button"
            onClick={copy}
            disabled={
              !text &&
              !showReport
            }
            aria-label="Copy response"
            title={
              copied
                ? 'Copied'
                : 'Copy response'
            }
            className="
              p-1.5
              hover:bg-neutral-100
              dark:hover:bg-neutral-800
              transition-colors
              disabled:opacity-50
              rounded
            "
          >
            <CopyIcon
              size={18}
              className="
                text-[#AFAFAF]
                dark:text-neutral-500
              "
            />
          </button>

          {/* ------------------------------------------------------------ */}
          {/* REGENERATE                                                    */}
          {/* ------------------------------------------------------------ */}

          {onRegenerate && (
            <button
              type="button"
              onClick={
                handleRegenerate
              }
              disabled={
                isDownloading ||
                isRegenerating
              }
              aria-label="Regenerate response"
              title="Regenerate response"
              className="
                p-1.5
                hover:bg-neutral-100
                dark:hover:bg-neutral-800
                transition-colors
                rounded
                disabled:opacity-50
              "
            >
              <RefreshIcon
                size={18}
                className="
                  text-[#AFAFAF]
                  dark:text-neutral-500
                "
              />
            </button>
          )}

          {/* ------------------------------------------------------------ */}
          {/* DOWNLOAD                                                      */}
          {/* ------------------------------------------------------------ */}

          <DownloadAs
            onClick={
              handleDownloadPDF
            }
          />
        </div>
      )}
    </motion.div>
  );
}