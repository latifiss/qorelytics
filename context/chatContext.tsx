'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface ChatContextValue {
  newChatVersion: number
  selectedChatId: string | null
  startNewChat: () => void
  openChat: (chatId: string) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [newChatVersion, setNewChatVersion] = useState(0)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  const startNewChat = useCallback(() => {
    setSelectedChatId(null)
    setNewChatVersion((version) => version + 1)
  }, [])

  const openChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId)
  }, [])

  return (
    <ChatContext.Provider value={{ newChatVersion, selectedChatId, startNewChat, openChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used within a ChatProvider')
  return context
}
