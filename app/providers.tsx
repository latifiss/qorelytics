"use client";

import { ThemeProvider } from "@/context/themeContext";
import { ChatProvider, useChat } from "@/context/chatContext";
import PostHogAnalytics from "@/components/analytics/PostHogAnalytics";

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
          <PostHogAnalytics />
          {children}
        </ChatResetBoundary>
      </ChatProvider>
    </ThemeProvider>
  );
}
