"use client";

import { useContext } from "react";
import { ThemeProvider } from "@/context/themeContext";
import { ChatProvider, useChat } from "@/context/chatContext";
import LayoutWrapper from "@/components/layout/layoutWrapper";

function ChatResetBoundary({ children }: { children: React.ReactNode }) {
  const { newChatVersion } = useChat();

  return <div key={newChatVersion} className="contents">{children}</div>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ChatProvider>
        <ChatResetBoundary>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ChatResetBoundary>
      </ChatProvider>
    </ThemeProvider>
  );
}
