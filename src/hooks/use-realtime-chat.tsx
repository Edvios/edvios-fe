'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState, useRef } from 'react'
import {
  getChatMessages,
  sendChatMessage,
  updateMessageStatus,
  type ChatMessage as DbChatMessage,
} from '@/lib/chat-api'

interface UseRealtimeChatProps {
  chatId: string
  userId: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
    id: string
  }
  senderRole: 'STUDENT' | 'AGENT'
  status: 'SENT' | 'DELIVERED' | 'READ'
  createdAt: string
}

const EVENT_MESSAGE_TYPE = 'message'

// Transform database message to chat message format
function transformDbMessage(msg: DbChatMessage, getUserName: (id: string) => string): ChatMessage {
  return {
    id: msg.id,
    content: msg.content,
    user: {
      name: getUserName(msg.senderId),
      id: msg.senderId,
    },
    senderRole: msg.senderRole,
    status: msg.status,
    createdAt: msg.createdAt,
  }
}

export function useRealtimeChat({ chatId, userId, username }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const userNamesRef = useRef<Map<string, string>>(new Map())

  // Helper function to get user name by ID
  const getUserName = useCallback((senderId: string): string => {
    return userNamesRef.current.get(senderId) || 'Unknown'
  }, [])

  // Load initial messages from database
  useEffect(() => {
    if (!chatId) return

    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const response = await getChatMessages(chatId, { page: 1, size: 50 })
        const transformedMessages = response.messages.map((msg) =>
          transformDbMessage(msg, getUserName)
        )
        setMessages(transformedMessages)
        setHasMore(response.hasMore)
        setPage(1)

        // Mark messages as read
        const unreadMessageIds = response.messages
          .filter((msg) => msg.senderId !== userId && msg.status !== 'READ')
          .map((msg) => msg.id)
        
        if (unreadMessageIds.length > 0) {
          await updateMessageStatus(unreadMessageIds, 'READ')
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [chatId, userId, getUserName])

  // Set up realtime subscription
  useEffect(() => {
    if (!chatId) return

    const roomName = `chat:${chatId}`
    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const newMessage = payload.payload as ChatMessage
        // Only add message if it's from another user (sender already sees their message)
        if (newMessage.user.id !== userId) {
          setMessages((current) => {
            // Check if message already exists
            if (current.some((m) => m.id === newMessage.id)) {
              return current
            }
            return [...current, newMessage]
          })

          // Mark as read immediately since user is viewing the chat
          updateMessageStatus([newMessage.id], 'READ').catch(console.error)
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [chatId, userId, supabase])

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!chatId || !hasMore || isLoading) return

    try {
      const nextPage = page + 1
      const response = await getChatMessages(chatId, { page: nextPage, size: 50 })
      const transformedMessages = response.messages.map((msg) =>
        transformDbMessage(msg, getUserName)
      )
      setMessages((current) => [...transformedMessages, ...current])
      setHasMore(response.hasMore)
      setPage(nextPage)
    } catch (error) {
      console.error('Failed to load more messages:', error)
    }
  }, [chatId, hasMore, isLoading, page, getUserName])

  // Send message to database and broadcast
  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected || !chatId) return

      try {
        // Save to database first
        const savedMessage = await sendChatMessage(chatId, content)

        const message: ChatMessage = {
          id: savedMessage.id,
          content: savedMessage.content,
          user: {
            name: username,
            id: userId,
          },
          senderRole: savedMessage.senderRole,
          status: savedMessage.status,
          createdAt: savedMessage.createdAt,
        }

        // Update local state immediately for the sender
        setMessages((current) => [...current, message])

        // Broadcast to other users
        await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        })
      } catch (error) {
        console.error('Failed to send message:', error)
        throw error
      }
    },
    [channel, isConnected, chatId, username, userId]
  )

  // Update user names map (useful when chat info is loaded)
  const setUserName = useCallback((userId: string, name: string) => {
    userNamesRef.current.set(userId, name)
  }, [])

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    hasMore,
    loadMore,
    setUserName,
  }
}
