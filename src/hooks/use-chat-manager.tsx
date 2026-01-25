'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getUserChats,
  startChat,
  getChatById,
  getUnreadCount,
  type Chat,
  type ChatAgent,
} from '@/lib/chat-api'

interface UseChatManagerProps {
  userId: string
  userRole: 'STUDENT' | 'AGENT' | 'ADMIN'
}

export function useChatManager({ userId, userRole }: UseChatManagerProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [assignedAgent, setAssignedAgent] = useState<ChatAgent | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all chats for the user
  const loadChats = useCallback(async () => {
    try {
      setIsLoading(true)
      const userChats = await getUserChats()
      setChats(userChats)
      setError(null)
    } catch (err) {
      setError('Failed to load chats')
      console.error('Failed to load chats:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadCount()
      setUnreadCount(result.unreadCount)
    } catch (err) {
      console.error('Failed to load unread count:', err)
    }
  }, [])

  // Start a new chat (for students)
  const initializeChat = useCallback(async () => {
    if (userRole !== 'STUDENT') return null

    try {
      setIsLoading(true)
      const result = await startChat()
      if (result.chat) {
        setActiveChat(result.chat)
        setAssignedAgent(result.agent)
        // Refresh chats list
        await loadChats()
        return result.chat
      }
      return null
    } catch (err) {
      setError('Failed to start chat')
      console.error('Failed to start chat:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [userRole, loadChats])

  // Select a chat by ID
  const selectChat = useCallback(async (chatId: string) => {
    try {
      const chat = await getChatById(chatId)
      setActiveChat(chat)
      // Update unread count after viewing a chat
      await loadUnreadCount()
      return chat
    } catch (err) {
      setError('Failed to load chat')
      console.error('Failed to load chat:', err)
      return null
    }
  }, [loadUnreadCount])

  // Close active chat
  const closeChat = useCallback(() => {
    setActiveChat(null)
  }, [])

  // Initial load
  useEffect(() => {
    if (userId) {
      loadChats()
      loadUnreadCount()
    }
  }, [userId, loadChats, loadUnreadCount])

  // Get the display name for a chat participant
  const getChatParticipantName = useCallback((chat: Chat): string => {
    if (userRole === 'STUDENT') {
      // Show agent name to student
      const agent = chat.agent
      return agent.user.firstName && agent.user.lastName
        ? `${agent.user.firstName} ${agent.user.lastName}`
        : agent.user.email
    } else {
      // Show student name to agent
      const student = chat.student
      return student.firstName && student.lastName
        ? `${student.firstName} ${student.lastName}`
        : student.email || 'Unknown Student'
    }
  }, [userRole])

  // Get current user display name
  const getCurrentUserName = useCallback((): string => {
    if (!activeChat) return 'You'
    
    if (userRole === 'STUDENT') {
      const student = activeChat.student
      return student.firstName && student.lastName
        ? `${student.firstName} ${student.lastName}`
        : student.email || 'You'
    } else {
      const agent = activeChat.agent
      return agent.user.firstName && agent.user.lastName
        ? `${agent.user.firstName} ${agent.user.lastName}`
        : agent.user.email
    }
  }, [activeChat, userRole])

  return {
    chats,
    activeChat,
    assignedAgent,
    unreadCount,
    isLoading,
    error,
    loadChats,
    loadUnreadCount,
    initializeChat,
    selectChat,
    closeChat,
    getChatParticipantName,
    getCurrentUserName,
  }
}
