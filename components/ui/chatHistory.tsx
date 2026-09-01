'use client'

import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { useChat } from '@/context/chatContext'

interface ChatHistoryItem {
  id: string
  title: string | null
  datasetId: string
}

interface ChatHistoryProps {
  type?: 'desktop' | 'mobile'
}

export default function ChatHistory({ type = 'desktop' }: ChatHistoryProps) {
  const { openChat, selectedChatId } = useChat()
  const [chats, setChats] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadChats = async () => {
      try {
        const response = await fetch('/api/chats', { cache: 'no-store' })
        if (!response.ok) return
        const data = (await response.json()) as { chats?: ChatHistoryItem[] }
        if (!cancelled) setChats(data.chats ?? [])
      } catch (error) {
        console.error('[ChatHistory] Failed to load chats:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadChats()
    return () => { cancelled = true }
  }, [])

  const textClass = type === 'mobile'
    ? 'text-[30px] text-black dark:text-white'
    : 'text-[30px] text-neutral-900 dark:text-white'

  if (loading) {
    return <div className="flex justify-center py-5"><ClipLoader color="#7FF86C" size={24} /></div>
  }

  if (chats.length === 0) {
    return <div className={`${textClass} pl-4 py-3 opacity-40`}>No chats yet</div>
  }

  return (
    <div className="space-y-2 pb-3">
      {chats.map((chat) => (
        <button
          key={chat.id}
          type="button"
          onClick={() => openChat(chat.id)}
          className={`block w-full text-left pl-4 pr-2 transition-opacity hover:opacity-70 ${
            selectedChatId === chat.id ? 'opacity-100' : ''
          }`}
        >
          <span className={`${textClass} line-clamp-1`}>
            {chat.title || 'Untitled chat'}
          </span>
        </button>
      ))}
    </div>
  )
}
