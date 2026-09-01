"use client";

import { ThemeProvider } from "@/context/themeContext";
import { ChatProvider, useChat } from "@/context/chatContext";

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
        <ChatResetBoundary>{children}</ChatResetBoundary>
      </ChatProvider>
    </ThemeProvider>
  );
}
