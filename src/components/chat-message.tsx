import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import { Check, CheckCheck } from 'lucide-react'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  // Render message status indicator
  const renderStatus = () => {
    if (!isOwnMessage) return null

    switch (message.status) {
      case 'READ':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      case 'DELIVERED':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case 'SENT':
      default:
        return <Check className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <div className={`flex mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <span className={'font-medium'}>{message.user.name}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            'py-2 px-3 rounded-xl text-sm w-fit',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}
        >
          <div className="flex items-end gap-2">
            <span>{message.content}</span>
            {isOwnMessage && (
              <span className="shrink-0 mb-0.5">{renderStatus()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
