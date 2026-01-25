'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface RealtimeChatProps {
  chatId: string
  userId: string
  username: string
  otherUserName?: string
  onMessage?: (messages: ChatMessage[]) => void
}

/**
 * Realtime chat component with database persistence
 * @param chatId - The ID of the chat (from database)
 * @param userId - The ID of the current user
 * @param username - The username of the user
 * @param otherUserName - The name of the other participant (for display)
 * @param onMessage - The callback function to handle the messages
 * @returns The chat component
 */
export const RealtimeChat = ({
  chatId,
  userId,
  username,
  otherUserName,
  onMessage,
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    hasMore,
    loadMore,
    setUserName,
  } = useRealtimeChat({
    chatId,
    userId,
    username,
  })
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Set user names for display
  useEffect(() => {
    setUserName(userId, username)
    if (otherUserName) {
      // We don't have the other user's ID here directly,
      // but messages will have it
    }
  }, [userId, username, otherUserName, setUserName])

  useEffect(() => {
    if (onMessage) {
      onMessage(messages)
    }
  }, [messages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected || isSending) return

      setIsSending(true)
      try {
        await sendMessage(newMessage)
        setNewMessage('')
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        setIsSending(false)
      }
    },
    [newMessage, isConnected, isSending, sendMessage]
  )

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current
      // Load more when scrolled near the top
      if (scrollTop < 100 && hasMore && !isLoading) {
        loadMore()
      }
    }
  }, [containerRef, hasMore, isLoading, loadMore])

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Loading state */}
      {isLoading && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Messages */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {/* Load more indicator */}
        {hasMore && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Load earlier messages
            </Button>
          </div>
        )}

        {!isLoading && messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : null}
        <div className="space-y-1">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null
            const showHeader = !prevMessage || prevMessage.user.id !== message.user.id

            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.id === userId}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4">
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300',
            isConnected && newMessage.trim() ? 'w-[calc(100%-36px)]' : 'w-full'
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected || isSending}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={!isConnected || isSending}
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        )}
      </form>
    </div>
  )
}
