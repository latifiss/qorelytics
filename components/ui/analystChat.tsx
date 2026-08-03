"use client";

import { RefObject, useState } from "react";

import AnalysisProgress from "./analysisProgress";
import AnalystResponse from "./analystResponse";


interface AnalystChatProps {
  content: string;
  isStreaming?: boolean;
  onCopy?: () => void;
  onRegenerate?: () => void;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onStreamingUpdate?: () => void;
  onStreamingComplete?: () => void;
}



export default function AnalystChat({
  content,
  isStreaming = true,
  onCopy,
  onRegenerate,
  scrollRef,
  onStreamingUpdate,
  onStreamingComplete,
}: AnalystChatProps) {


  const [phase, setPhase] = useState<
    "thinking" | "response"
  >("thinking");



  return (

    <div className="w-full">


      {
        phase === "thinking" && (

          <AnalysisProgress

            onComplete={() => {

              setPhase("response");

            }}

            onStreamingUpdate={onStreamingUpdate}

          />

        )
      }






      {
        phase === "response" && (

          <AnalystResponse


            content={content}


            isStreaming={isStreaming}



            scrollRef={scrollRef}


            onStreamingUpdate={
              onStreamingUpdate
            }



            onCopy={onCopy}


            onRegenerate={onRegenerate}

            onStreamingComplete={onStreamingComplete}

          />

        )
      }



    </div>

  );

}