export type AnalysisStage =
  | 'idle'
  | 'thinking'
  | 'streaming'
  | 'complete';



export interface AnalysisStep {
  id: number;
  message: string;
  status?: 'pending' | 'active' | 'complete';
}



export interface ReportSection {
  title: string;
  content: string;
}



export interface AnalystReport {
  summary: string;
  sections: ReportSection[];
  confidence?: number;
}



export interface AnalystChartData {
  config: import('@/components/charts/types/chart.types').ChartConfig;
  data: import('@/components/charts/types/chart.types').ChartDataPoint[];
}

export interface AnalystResponseProps {
  content?: string;

  isStreaming?: boolean;

  className?: string;

  timestamp?: string;

  onCopy?: () => void;

  onRegenerate?: () => void;

  onStreamingComplete?: () => void;

  /**
   * Used to trigger parent auto-scroll
   * while AI response is generating
   */
  onStreamingUpdate?: () => void;


  /**
   * Scroll container reference
   * used by response generation
   */
  scrollRef?: React.RefObject<HTMLDivElement | null>;

  /** When false, skip the analysis report card (follow-up messages). */
  showReport?: boolean;

  /** Dynamic report sections from the analysis API. */
  reportSections?: ReportSection[];

  /** Chart configs and dataset rows for [CHART:n] markers. */
  chartData?: AnalystChartData[];
}



export interface AnalysisProgressProps {
  className?: string;

  onComplete?: () => void;

  onStreamingUpdate?: () => void;
}