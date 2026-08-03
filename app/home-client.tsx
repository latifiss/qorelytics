"use client";

import { useCallback, useRef, useState } from "react";

import Input from "@/components/ui/input";
import AnalystChat from "@/components/ui/analystChat";
import SelectionModal from "@/components/ui/selectionModal";


interface HomeClientProps {
  userName?: string;
}



const sampleResponse = `
I analyzed your customer sales dataset.

The analysis shows strong growth, but there are opportunities to improve customer retention.

Below is the generated analysis report.
`;



export default function Home({
  userName,
}: HomeClientProps) {


  const scrollRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userMessage, setUserMessage] = useState("");

  const [started, setStarted] = useState(false);

  const scrollToBottom = useCallback((instant = true) => {
    const el = scrollRef.current;
    if (!el || userScrolledUpRef.current) return;

    const maxScrollTop = el.scrollHeight - el.clientHeight;

    el.scrollTo({
      top: maxScrollTop,
      behavior: instant ? "auto" : "smooth",
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
    requestAnimationFrame(() => {
      scrollToBottom(true);
    });
  }, [scrollToBottom]);

  const handleSubmit = (
    text: string,
    mode: string,
    file?: File
  ) => {


    if (!text && !file) return;


    setUserMessage(
      text || `Analyze ${file?.name}`
    );


    setStarted(true);


    userScrolledUpRef.current = false;

    requestAnimationFrame(() => {
      scrollToBottom(true);
    });
  };







  return (

    <div className="
      fixed
      top-[78px]
      lg:top-0
      right-0
      bottom-0
      left-0
      lg:left-80
      flex
      flex-col
      overflow-hidden
      bg-background
    ">



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
          scrollbar-thumb-muted
          hover:scrollbar-thumb-foreground
        "

      >


        <div className="
          max-w-2xl
          mx-auto
          w-full
        ">


        {!started && (

          <div className="
            mb-12
            mt-20
            text-center
          ">


            <h1 className="
              text-3xl
              md:text-4xl
              font-display
              font-bold
              text-foreground
            ">


              {
                userName ? (

                  <>

                    <span className="rainbow-text">

                      Hey {userName.split(" ")[0]}

                    </span>


                    <br />


                    <span className="text-2xl">

                      What are you analyzing today?

                    </span>

                  </>


                )

                :

                (

                  <>
                    What are you analyzing today?
                  </>

                )

              }


            </h1>





            <p className="
              mt-2
              text-muted
              text-sm
            ">

              Upload your data and let Qorelytics uncover insights.

            </p>


          </div>

        )}







        {
          started && (

            <>

              {/* USER MESSAGE */}

              <div className="
                mb-6
                w-full
                flex
                justify-end
              ">


                <div

                  className="
                    max-w-[80%]
                    px-4
                    py-3
                    border
                    border-subtle
                    rounded-none
                    text-sm
                    text-foreground
                    leading-relaxed
                    whitespace-pre-wrap
                  "

                  style={{
                    backgroundColor:
                      "var(--fill-alpha-subtle)",
                  }}

                >

                  {userMessage}

                </div>


              </div>








              {/* AI RESPONSE */}

              <AnalystChat

                content={sampleResponse}

                isStreaming={true}

                scrollRef={scrollRef}


                onStreamingUpdate={
                  handleStreamingUpdate
                }


                onCopy={()=>{
                  console.log("copied");
                }}


                onRegenerate={()=>{}}


              />


              <div
                className="h-[220px] shrink-0"
                aria-hidden
              />


            </>

          )
        }


        </div>


      </div>








      <div className="
        fixed
        bottom-0
        left-0
        right-0
        lg:left-80
        bg-gradient-to-t
        from-background
        via-background/95
        to-transparent
        pt-8
        pb-4
        px-4
        z-40
      ">


        <div className="
          max-w-2xl
          mx-auto
        ">


          <Input

            onSubmit={handleSubmit}

          />


        </div>


      </div>









      <SelectionModal

        isOpen={isModalOpen}

        onClose={() =>
          setIsModalOpen(false)
        }

        onSelect={()=>{}}

      />



    </div>

  );

}