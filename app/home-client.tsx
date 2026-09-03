'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Input from '@/components/ui/input';
import AnalystResponse from '@/components/ui/analystResponse';
import AnalysisProgress from '@/components/ui/analysisProgress';
import SelectionModal from '@/components/ui/selectionModal';
import { useChat } from '@/context/chatContext';
import {
  buildChartDataFromAnalysis,
  buildReportSections,
  getDatasetRows,
} from '@/lib/analysis/buildAnalysisCharts';
import Image from 'next/image';

interface HomeClientProps {
  userName?: string;
}

interface AnalysisMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnalysisChart {
  type:
    | 'bar'
    | 'horizontal-bar'
    | 'grouped-bar'
    | 'stacked-bar'
    | 'line'
    | 'area'
    | 'pie'
    | 'donut'
    | 'scatter'
    | 'histogram'
    | 'box-plot'
    | 'funnel'
    | 'waterfall'
    | 'radar'
    | 'treemap'
    | 'gauge'
    | 'sankey';

  title: string;
  description: string;
  dimensions: string[];
  measures: string[];
  reason: string;
}

interface AnalysisSection {
  title: string;
  content: string;
  importance: 'high' | 'medium' | 'low';
}

interface AnalysisRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  status:
    | 'success'
    | 'partial'
    | 'unsupported'
    | 'insufficient_data';

  response: string;
  summary: string;

  datasetAssessment: {
    isAnalyzable: boolean;
    isStructured: boolean;
    isQuantitative: boolean;
    confidence: number;
    explanation: string;
  };

  sections: AnalysisSection[];
  charts: AnalysisChart[];
  recommendations: AnalysisRecommendation[];
  limitations: string[];
  suggestedFollowUps: string[];
}

interface DatasetProfile {
  fileName: string;
  fileType: string;
  rowCount: number;
  columnCount: number;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    uniqueCount: number;
    missingCount: number;
    missingPercentage: number;
    sampleValues: unknown[];
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
  }>;

  sampleRows: Record<string, unknown>[];
  preview?: Record<string, unknown>[];
  numericColumns?: string[];
  categoricalColumns?: string[];
  dateColumns?: string[];
  [key: string]: unknown;
}

interface UploadedDataset {
  id: string;
  name: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  status: string;
}

interface UploadResponse {
  dataset: UploadedDataset;
  profile: DatasetProfile;
}

interface AnalyzeResponse {
  analysis: {
    id: string;
    datasetId: string;
    provider: string;
    model: string;
    result: AnalysisResult;
    status: string;
    startedAt: string;
    completedAt?: string;
    createdAt: string;
  };
}

interface UserAttachment {
  name: string;
  type: string;
  size: number;
}

interface ChatTurn {
  id: string;
  userMessage: string;
  response: string;
  isFollowUp: boolean;
  isAnalyzing: boolean;
  attachment?: UserAttachment;
  result?: AnalysisResult;
  profile?: DatasetProfile;
}

interface LoadedChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  result: unknown;
  createdAt: string;
}

interface LoadedChat {
  id: string;
  title: string | null;
  datasetId: string;
  dataset: {
    id: string;
    name: string;
    originalFileName: string;
    fileType: string;
    fileSize: number;
    rowCount: number;
    columnCount: number;
    status: string;
    profile: unknown;
  };
  messages: LoadedChatMessage[];
}

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    typeof result.response === 'string' &&
    Array.isArray(result.sections) &&
    Array.isArray(result.charts)
  );
}

function isDatasetProfile(value: unknown): value is DatasetProfile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const profile = value as Record<string, unknown>;

  return (
    typeof profile.fileName === 'string' &&
    typeof profile.fileType === 'string' &&
    Array.isArray(profile.columns) &&
    Array.isArray(profile.sampleRows)
  );
}

const fileTypeIcons: Record<string, string> = {
  pdf: '/images/file-types/pdf.svg',
  word: '/images/file-types/word.svg',
  csv: '/images/file-types/csv.svg',
  excel: '/images/file-types/excel.svg',
};

function getFileIcon(fileName: string, fileType: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  const normalizedType = fileType.toLowerCase();

  if (fileTypeIcons[extension]) {
    return fileTypeIcons[extension];
  }

  if (fileTypeIcons[normalizedType]) {
    return fileTypeIcons[normalizedType];
  }

  if (normalizedType.includes('pdf')) {
    return fileTypeIcons.pdf;
  }

  if (
    normalizedType.includes('word') ||
    normalizedType.includes('document')
  ) {
    return fileTypeIcons.word;
  }

  if (normalizedType.includes('excel') || normalizedType.includes('sheet')) {
    return fileTypeIcons.excel;
  }

  if (normalizedType.includes('csv')) {
    return fileTypeIcons.csv;
  }

  return '/images/file-icons/default.svg';
}

function UserMessage({
  message,
  attachment,
}: {
  message: string;
  attachment?: UserAttachment;
}) {
  const displayMessage =
    attachment && message === `Analyze ${attachment.name}` ? '' : message;

  return (
    <div className="w-full flex flex-col items-end gap-2">
      {attachment && (
        <div className="flex max-w-[80%] min-w-0 items-center gap-2">
          <Image
            src={getFileIcon(attachment.name, attachment.type)}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain"
          />
          <span className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {attachment.name}
          </span>
        </div>
      )}

      <div className="max-w-[80%] rounded-xl border border-emerald-500 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-neutral-900 shadow-[0_2px_0_rgba(16,185,129,0.28),0_3px_8px_rgba(16,185,129,0.12)] dark:border-emerald-500/70 dark:bg-emerald-950/20 dark:text-white dark:shadow-[0_2px_0_rgba(52,211,153,0.22),0_3px_8px_rgba(52,211,153,0.10)]">
        <div className="whitespace-pre-wrap">{displayMessage}</div>
      </div>
    </div>
  );
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    const text = await response.text();

    throw new Error(
      text || `Request failed with status ${response.status}.`,
    );
  }

  const body = (await response.json()) as T;

  if (!response.ok) {
    const errorBody = body as {
      error?: string;
      message?: string;
    };

    throw new Error(
      errorBody.error ||
        errorBody.message ||
        `Request failed with status ${response.status}.`,
    );
  }

  return body;
}

export default function Home({ userName }: HomeClientProps) {
  const { selectedChatId } = useChat();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);
  const chatLoadVersionRef = useRef(0);

  const datasetIdRef = useRef<string | null>(null);
  const datasetProfileRef = useRef<DatasetProfile | null>(null);
  const conversationRef = useRef<AnalysisMessage[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const started = turns.length > 0;

  const scrollToBottom = useCallback(() => {
    if (userScrolledUpRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = scrollRef.current;

        if (el) {
          el.scrollTop = el.scrollHeight - el.clientHeight;
        }

        bottomRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'end',
        });
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;

    if (!el) {
      return;
    }

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    userScrolledUpRef.current = distanceFromBottom > 120;
  }, []);

  const handleStreamingUpdate = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const uploadDataset = useCallback(
    async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'name',
        file.name.replace(/\.[^/.]+$/, ''),
      );

      const response = await fetch('/api/datasets/upload', {
        method: 'POST',
        body: formData,
      });

      return readJsonResponse<UploadResponse>(response);
    },
    [],
  );

  const runDatasetAnalysis = useCallback(
    async ({
      datasetId,
      userQuestion,
      messages,
    }: {
      datasetId: string;
      userQuestion?: string;
      messages: AnalysisMessage[];
    }): Promise<AnalyzeResponse> => {
      const response = await fetch(
        `/api/datasets/${encodeURIComponent(datasetId)}/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'openrouter',
            model: 'deepseek/deepseek-chat',
            userQuestion,
            messages,
          }),
        },
      );

      return readJsonResponse<AnalyzeResponse>(response);
    },
    [],
  );

  const updateTurn = useCallback(
    (turnId: string, updates: Partial<ChatTurn>) => {
      setTurns((previous) =>
        previous.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                ...updates,
              }
            : turn,
        ),
      );
    },
    [],
  );

  const loadChat = useCallback(
    async (chatId: string) => {
      const loadVersion = chatLoadVersionRef.current + 1;
      chatLoadVersionRef.current = loadVersion;

      try {
        setError(null);
        setIsGenerating(false);
        setActiveTurnId(null);

        const response = await fetch(
          `/api/chats/${encodeURIComponent(chatId)}`,
          { cache: 'no-store' },
        );

        const data = await readJsonResponse<{ chat: LoadedChat }>(response);

        if (loadVersion !== chatLoadVersionRef.current) {
          return;
        }

        const chat = data.chat;
        const profile = isDatasetProfile(chat.dataset.profile)
          ? chat.dataset.profile
          : undefined;

        datasetIdRef.current = chat.datasetId;
        datasetProfileRef.current = profile ?? null;

        const loadedTurns: ChatTurn[] = [];
        const loadedMessages: AnalysisMessage[] = [];

        for (const message of chat.messages) {
          const role = message.role === 'USER' ? 'user' : 'assistant';

          loadedMessages.push({
            role,
            content: message.content,
          });

          if (message.role === 'USER') {
            loadedTurns.push({
              id: message.id,
              userMessage: message.content,
              response: '',
              isFollowUp: loadedTurns.length > 0,
              isAnalyzing: false,
              attachment:
                loadedTurns.length === 0
                  ? {
                      name: chat.dataset.originalFileName,
                      type: chat.dataset.fileType,
                      size: chat.dataset.fileSize,
                    }
                  : undefined,
            });
            continue;
          }

          const turn = loadedTurns[loadedTurns.length - 1];

          if (turn) {
            turn.response = message.content;
            turn.result = isAnalysisResult(message.result)
              ? message.result
              : undefined;
            turn.profile = profile;
          }
        }

        conversationRef.current = loadedMessages;
        userScrolledUpRef.current = false;
        setTurns(loadedTurns);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (loadVersion !== chatLoadVersionRef.current) {
              return;
            }

            if (scrollRef.current) {
              scrollRef.current.scrollTop = 0;
            }
          });
        });
      } catch (loadError) {
        if (loadVersion !== chatLoadVersionRef.current) {
          return;
        }

        console.error('[HomeClient] Failed to load chat:', loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load this chat.',
        );
      }
    },
    [],
  );

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }

    void loadChat(selectedChatId);
  }, [loadChat, selectedChatId]);

  const analyzeTurn = useCallback(
    async ({
      turnId,
      datasetId,
      question,
      messages,
      profile,
    }: {
      turnId: string;
      datasetId: string;
      question: string;
      messages: AnalysisMessage[];
      profile?: DatasetProfile;
    }) => {
      try {
        setError(null);
        setIsGenerating(true);
        setActiveTurnId(turnId);

        updateTurn(turnId, {
          isAnalyzing: true,
        });

        scrollToBottom();

        const result = await runDatasetAnalysis({
          datasetId,
          userQuestion: question,
          messages,
        });

        const analysis = result.analysis?.result;

        if (!isAnalysisResult(analysis)) {
          throw new Error('The analysis response was invalid.');
        }

        conversationRef.current = [
          ...conversationRef.current,
          {
            role: 'assistant',
            content: analysis.response,
          },
        ];

        updateTurn(turnId, {
          response: analysis.response,
          result: analysis,
          profile,
          isAnalyzing: false,
        });

        setActiveTurnId(turnId);
        setIsGenerating(true);
        scrollToBottom();
      } catch (analysisError) {
        console.error('[HomeClient] Analysis failed:', analysisError);

        const message =
          analysisError instanceof Error
            ? analysisError.message
            : 'Failed to analyze the dataset.';

        setError(message);

        updateTurn(turnId, {
          response: 'I could not complete the analysis.',
          isAnalyzing: false,
        });

        setActiveTurnId(null);
        setIsGenerating(false);
      }
    },
    [runDatasetAnalysis, scrollToBottom, updateTurn],
  );

  const handleSubmit = useCallback(
    async (text: string, _mode: string, file?: File) => {
      if (isGenerating || (!text.trim() && !file)) {
        return;
      }

      setError(null);

      if (!datasetIdRef.current && !file) {
        setError(
          'Upload a CSV, Excel, or JSON dataset to start an analysis.',
        );
        return;
      }

      const question =
        text.trim() || `Analyze ${file?.name ?? 'this dataset'}`;

      const isFollowUp = Boolean(datasetIdRef.current);
      const turnId = crypto.randomUUID();
      const attachment = file
        ? {
            name: file.name,
            type: file.type || 'File',
            size: file.size,
          }
        : undefined;

      setTurns((previous) => [
        ...previous,
        {
          id: turnId,
          userMessage: question,
          response: '',
          isFollowUp,
          isAnalyzing: true,
          attachment,
        },
      ]);

      setActiveTurnId(turnId);
      setIsGenerating(true);
      userScrolledUpRef.current = false;
      scrollToBottom();

      try {
        let datasetId = datasetIdRef.current;
        let profile = datasetProfileRef.current;

        if (!datasetId) {
          if (!file) {
            throw new Error('A dataset file is required.');
          }

          const upload = await uploadDataset(file);
          datasetId = upload.dataset.id;
          profile = upload.profile;

          datasetIdRef.current = datasetId;
          datasetProfileRef.current = profile;
        }

        const nextMessages = [
          ...conversationRef.current,
          {
            role: 'user' as const,
            content: question,
          },
        ];

        conversationRef.current = nextMessages;

        await analyzeTurn({
          turnId,
          datasetId,
          question,
          messages: nextMessages,
          profile: profile ?? undefined,
        });
      } catch (submitError) {
        console.error('[HomeClient] Submit failed:', submitError);

        const message =
          submitError instanceof Error
            ? submitError.message
            : 'Something went wrong while submitting your request.';

        setError(message);

        updateTurn(turnId, {
          response: 'I could not process that request.',
          isAnalyzing: false,
        });

        setActiveTurnId(null);
        setIsGenerating(false);
      }
    },
    [
      analyzeTurn,
      isGenerating,
      scrollToBottom,
      updateTurn,
      uploadDataset,
    ],
  );

  const handleRegenerate = useCallback(
    async (turnId: string) => {
      if (isGenerating || !datasetIdRef.current) {
        return;
      }

      const turn = turns.find((item) => item.id === turnId);

      if (!turn) {
        return;
      }

      const question = turn.userMessage;

      const previousMessages = conversationRef.current.filter(
        (_, index) =>
          index < conversationRef.current.length - 1,
      );

      const regenerationMessages = [
        ...previousMessages,
        {
          role: 'user' as const,
          content: question,
        },
      ];

      conversationRef.current = regenerationMessages;
      setError(null);
      setIsGenerating(true);
      setActiveTurnId(turnId);

      updateTurn(turnId, {
        response: '',
        isAnalyzing: true,
        result: undefined,
      });

      userScrolledUpRef.current = false;
      scrollToBottom();

      await analyzeTurn({
        turnId,
        datasetId: datasetIdRef.current,
        question,
        messages: regenerationMessages,
        profile: datasetProfileRef.current ?? undefined,
      });
    },
    [
      analyzeTurn,
      isGenerating,
      scrollToBottom,
      turns,
      updateTurn,
    ],
  );

  const handleTurnComplete = useCallback(
    (turnId: string) => {
      setActiveTurnId(null);
      setIsGenerating(false);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const resetConversation = useCallback(() => {
    chatLoadVersionRef.current += 1;
    datasetIdRef.current = null;
    datasetProfileRef.current = null;
    conversationRef.current = [];
    setTurns([]);
    setActiveTurnId(null);
    setIsGenerating(false);
    setError(null);
  }, []);

  void resetConversation;

  return (
    <div
      className="
        fixed
        top-19.5
        lg:top-0
        right-0
        bottom-0
        left-0
        lg:left-80
        flex
        flex-col
        overflow-hidden
        bg-white
        dark:bg-[#171b1d]
      "
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex-1
          min-h-0
          overflow-y-auto
          pt-8
          px-4
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-neutral-300
          dark:scrollbar-thumb-neutral-700
          hover:scrollbar-thumb-neutral-500
          dark:hover:scrollbar-thumb-neutral-500
        "
      >
        <div className="max-w-2xl mx-auto w-full">
          {!started && (
            <div className="mb-12 mt-20 text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 dark:text-white">
                {userName ? (
                  <>
                    <span className="rainbow-text">
                      Hey {userName.split(' ')[0]}
                    </span>
                    <br />
                    <span className="text-2xl">
                      What are you analyzing today?
                    </span>
                  </>
                ) : (
                  <>What are you analyzing today?</>
                )}
              </h1>

              <p className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm">
                Upload your data and let Qorelytics uncover insights.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 px-4 py-3 text-sm border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
              {error}
            </div>
          )}

          {started && (
            <div className="space-y-8">
              {turns.map((turn) => {
                const isActiveTurn =
                  isGenerating && turn.id === activeTurnId;

                const datasetRows = getDatasetRows(turn.profile);

                const chartData = turn.result
                  ? buildChartDataFromAnalysis(
                      turn.result.charts,
                      datasetRows,
                    )
                  : [];

                const reportSections = turn.result
                  ? buildReportSections({
                      sections: turn.result.sections,
                      charts: turn.result.charts,
                      recommendations: turn.result.recommendations,
                      limitations: turn.result.limitations,
                    })
                  : [];

                return (
                  <div key={turn.id} className="space-y-6">
                    <UserMessage
                      message={turn.userMessage}
                      attachment={turn.attachment}
                    />

                    {turn.isAnalyzing ? (
                      <div className="w-full max-w-[80%]">
                        <AnalysisProgress
                          mode={
                            turn.isFollowUp
                              ? 'follow-up'
                              : 'initial'
                          }
                          onComplete={() => {
                            scrollToBottom();
                          }}
                          onStreamingUpdate={handleStreamingUpdate}
                        />
                      </div>
                    ) : (
                      <AnalystResponse
                        key={`${turn.id}-${turn.result?.response ?? ''}`}
                        content={turn.response}
                        isStreaming={isActiveTurn}
                        showReport={Boolean(turn.result)}
                        reportSections={reportSections}
                        chartData={chartData}
                        onCopy={() => console.log('copied')}
                        onRegenerate={() => handleRegenerate(turn.id)}
                        onStreamingUpdate={handleStreamingUpdate}
                        onStreamingComplete={
                          isActiveTurn
                            ? () => handleTurnComplete(turn.id)
                            : undefined
                        }
                      />
                    )}
                  </div>
                );
              })}

              <div
                ref={bottomRef}
                className="h-60 shrink-0"
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-linear-to-t from-white dark:from-[#171b1d] via-white/95 dark:via-[#171b1d]/95 to-transparent pt-8 pb-4 px-4 z-40">
        <div className="max-w-2xl mx-auto">
          <Input
            onSubmit={handleSubmit}
            disabled={isGenerating}
            placeholder={
              started
                ? 'Ask a follow-up...'
                : 'Upload a dataset and ask anything...'
            }
          />
        </div>
      </div>

      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={() => {}}
      />
    </div>
  );
}
