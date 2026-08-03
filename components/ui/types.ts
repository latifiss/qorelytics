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
}



export interface AnalysisProgressProps {
  className?: string;

  onComplete?: () => void;

  onStreamingUpdate?: () => void;
}