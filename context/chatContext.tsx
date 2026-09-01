'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface ChatContextValue {
  newChatVersion: number
  startNewChat: () => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [newChatVersion, setNewChatVersion] = useState(0)

  const startNewChat = useCallback(() => {
    setNewChatVersion((version) => version + 1)
  }, [])

  return (
    <ChatContext.Provider value={{ newChatVersion, startNewChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }

  return context
}
