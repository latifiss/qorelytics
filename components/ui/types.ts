export type AnalysisStage = 'idle' | 'thinking' | 'streaming' | 'complete';

export interface AnalysisStep { id: number; message: string; status?: 'pending' | 'active' | 'complete'; }
export interface ReportSection { title: string; content: string; }
export interface AnalystReport { summary: string; sections: ReportSection[]; confidence?: number; }
export interface AnalystChartData { config: import('@/components/charts/types/chart.types').ChartConfig; data: import('@/components/charts/types/chart.types').ChartDataPoint[]; }
export interface AnalystResponseProps { content?: string; isStreaming?: boolean; className?: string; timestamp?: string; onCopy?: () => void; onRegenerate?: () => void; onStreamingComplete?: () => void; onStreamingUpdate?: () => void; scrollRef?: React.RefObject<HTMLDivElement | null>; showReport?: boolean; reportSections?: ReportSection[]; chartData?: AnalystChartData[]; }
export interface AnalysisProgressProps { className?: string; onComplete?: () => void; onStreamingUpdate?: () => void; mode?: 'initial' | 'follow-up'; }
