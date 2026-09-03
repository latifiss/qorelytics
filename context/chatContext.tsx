'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface ChatContextValue {
  newChatVersion: number
  selectedChatId: string | null
  startNewChat: () => void
  openChat: (chatId: string) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

const SELECTED_CHAT_STORAGE_KEY = 'qorelytics-selected-chat-id'

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [newChatVersion, setNewChatVersion] = useState(0)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(SELECTED_CHAT_STORAGE_KEY)
  })

  const startNewChat = useCallback(() => {
    setSelectedChatId(null)
    sessionStorage.removeItem(SELECTED_CHAT_STORAGE_KEY)
    setNewChatVersion((version) => version + 1)
  }, [])

  const openChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId)
    sessionStorage.setItem(SELECTED_CHAT_STORAGE_KEY, chatId)
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
