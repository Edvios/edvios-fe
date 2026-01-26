'use client'

import { useState } from 'react'
import { RealtimeChat } from '@/components/realtime-chat'
import { useChatManager } from '@/hooks/use-chat-manager'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, ArrowLeft, Loader2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatPageProps {
  userId: string
  userRole: 'STUDENT' | 'AGENT' | 'ADMIN'
}

export function ChatPage({ userId, userRole }: ChatPageProps) {
  const {
    chats,
    activeChat,
    isLoading,
    error,
    initializeChat,
    selectChat,
    closeChat,
    getChatParticipantName,
    getCurrentUserName,
  } = useChatManager({ userId, userRole })

  const [isStartingChat, setIsStartingChat] = useState(false)

  // For students: automatically start a chat if none exists
  const handleStartChat = async () => {
    setIsStartingChat(true)
    await initializeChat()
    setIsStartingChat(false)
  }

  // Get the other participant's name in the active chat
  const getOtherParticipantName = (): string => {
    if (!activeChat) return ''
    return getChatParticipantName(activeChat)
  }

  if (isLoading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  // Show active chat
  if (activeChat) {
    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center gap-4 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={closeChat}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{getOtherParticipantName()}</h3>
              <p className="text-xs text-muted-foreground">
                {userRole === 'STUDENT' ? 'Your Agent' : 'Student'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1">
          <RealtimeChat
            chatId={activeChat.id}
            userId={userId}
            username={getCurrentUserName()}
            otherUserName={getOtherParticipantName()}
          />
        </div>
      </div>
    )
  }

  // Show chat list or start chat prompt
  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      {chats.length === 0 ? (
        <Card className="flex-1 flex flex-col items-center justify-center">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              {userRole === 'STUDENT'
                ? 'Start a conversation with your assigned agent'
                : 'Wait for students to reach out to you'}
            </p>
            {userRole === 'STUDENT' && (
              <Button onClick={handleStartChat} disabled={isStartingChat}>
                {isStartingChat ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting chat...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => {
            const participantName = getChatParticipantName(chat)
            const lastMessage = chat.messages[0]
            const unread = chat.unreadCount || 0

            return (
              <Card
                key={chat.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-accent',
                  unread > 0 && 'border-primary'
                )}
                onClick={() => selectChat(chat.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold truncate">{participantName}</h4>
                        {unread > 0 && (
                          <Badge variant="default" className="shrink-0">
                            {unread}
                          </Badge>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
