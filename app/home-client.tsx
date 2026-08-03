'use client';

import { useCallback, useRef, useState } from 'react';
import Input from '@/components/ui/input';
import AnalystChat from '@/components/ui/analystChat';
import SelectionModal from '@/components/ui/selectionModal';

interface HomeClientProps {
  userName?: string;
}

interface ChatTurn {
  id: string;
  userMessage: string;
  response: string;
  isFollowUp: boolean;
}

const sampleResponse = `
I analyzed your customer sales dataset.

The analysis shows strong growth, but there are opportunities to improve customer retention.

Below is the generated analysis report.
`;

const getFollowUpResponse = () => `
Thanks for your follow-up.

Based on the analysis so far, retention dips correlate with onboarding friction in weeks 2–3. I'd recommend A/B testing a simplified checkout flow and segmenting cohorts by acquisition channel to isolate the drop-off.

Happy to dig deeper into any segment or metric.
`;

export default function Home({ userName }: HomeClientProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);

  const started = turns.length > 0;

  const scrollToBottom = useCallback(() => {
    if (userScrolledUpRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight - el.clientHeight;
        }
        bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    userScrolledUpRef.current = distanceFromBottom > 120;
  }, []);

  const handleStreamingUpdate = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleTurnComplete = useCallback(() => {
    setActiveTurnId(null);
    setIsGenerating(false);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = (text: string, _mode: string, file?: File) => {
    if ((!text && !file) || isGenerating) return;

    const message = text || `Analyze ${file?.name}`;
    const isFollowUp = turns.length > 0;
    const newTurnId = crypto.randomUUID();

    setActiveTurnId(newTurnId);

    setTurns((prev) => [
      ...prev,
      {
        id: newTurnId,
        userMessage: message,
        response: isFollowUp ? getFollowUpResponse() : sampleResponse,
        isFollowUp,
      },
    ]);

    setIsGenerating(true);
    userScrolledUpRef.current = false;
    scrollToBottom();
  };

  return (
    <div className="fixed top-[78px] lg:top-0 right-0 bottom-0 left-0 lg:left-80 flex flex-col overflow-hidden bg-background">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto pt-8 px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-foreground"
      >
        <div className="max-w-2xl mx-auto w-full">
          {!started && (
            <div className="mb-12 mt-20 text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
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
              <p className="mt-2 text-muted text-sm">
                Upload your data and let Qorelytics uncover insights.
              </p>
            </div>
          )}

          {started && (
            <div className="space-y-8">
              {turns.map((turn) => {
                const isActiveTurn =
                  isGenerating && turn.id === activeTurnId;

                return (
                  <div key={turn.id} className="space-y-6">
                    <div className="w-full flex justify-end">
                      <div
                        className="max-w-[80%] px-4 py-3 border border-subtle rounded-none text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                        style={{ backgroundColor: 'var(--fill-alpha-subtle)' }}
                      >
                        {turn.userMessage}
                      </div>
                    </div>

                    <AnalystChat
                      content={turn.response}
                      isStreaming
                      showReport={true}
                      scrollRef={scrollRef}
                      onStreamingUpdate={handleStreamingUpdate}
                      onStreamingComplete={
                        isActiveTurn ? handleTurnComplete : undefined
                      }
                      onCopy={() => {
                        console.log('copied');
                      }}
                      onRegenerate={() => {}}
                    />
                  </div>
                );
              })}

              <div ref={bottomRef} className="h-[240px] shrink-0" aria-hidden />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-4 px-4 z-40">
        <div className="max-w-2xl mx-auto">
          <Input
            onSubmit={handleSubmit}
            disabled={isGenerating}
            placeholder={started ? 'Ask a follow-up...' : 'Ask anything...'}
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
