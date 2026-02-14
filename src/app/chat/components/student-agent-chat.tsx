"use client";

import { cn } from "@/lib/utils";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, Loader2, Paperclip, X, File as FileIcon, Image as ImageIcon, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ChatUser, ChatMessageData } from "../types/chat.types";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";
import { useFileUpload } from "../hooks/use-file-upload";
import { useRef } from "react";
import {
  startChat,
  getChatMessages,
  sendChatMessage,
  updateMessageStatus,
  type Chat,
} from "@/lib/chat-api";

interface StudentAgentChatProps {
  roomId: string;
  user: ChatUser;
  onMessageSent?: (message: string) => void;
  onChatInitialized?: (chat: Chat) => void;
}

export function StudentAgentChat({
  roomId,
  user,
  onMessageSent,
  onChatInitialized,
}: StudentAgentChatProps) {
  const supabase = createClient();
  const { containerRef, scrollToBottom } = useChatScroll();
  const { uploadFile, isUploading } = useFileUpload();

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [dbChat, setDbChat] = useState<Chat | null>(null);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);

  const [chatError, setChatError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Initialize or get chat from database
  useEffect(() => {
    const initializeChat = async () => {
      if (user.role === UserTypeEnum.STUDENT) {
        try {
          // Student starts/gets their chat with assigned agent
          const result = await startChat();
          if (result.error) {
            setChatError(result.error);
            console.error("Chat error:", result.error);
          } else if (result.chat) {
            setDbChat(result.chat);
            setChatError(null);
            // Notify parent that chat was initialized with database ID
            onChatInitialized?.(result.chat);
          }
        } catch (error) {
          console.error("Failed to initialize chat:", error);
          setChatError("Failed to connect to chat service. Please try again.");
        }
      } else if (user.role === UserTypeEnum.AGENT || user.role === UserTypeEnum.SELECTED_AGENT) {
        // For agents, roomId should be the actual chat ID from the database
        // Validate it looks like a UUID before using it
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roomId);
        if (isValidUUID) {
          setDbChat({ id: roomId } as Chat);
        } else {
          console.warn("Invalid chat ID for agent:", roomId);
          setChatError("Invalid chat ID. Please select a valid conversation.");
        }
      }
    };

    initializeChat();
  }, [user.role, roomId, onChatInitialized]);

  // Load messages from database
  useEffect(() => {
    const loadMessages = async () => {
      if (!dbChat?.id) {
        setIsLoadingMessages(false);
        return;
      }
      setIsLoadingMessages(true);
      try {
        const response = await getChatMessages(dbChat.id, { page: 1, size: 100 });

        // Transform db messages to chat format
        const transformedMessages: ChatMessageData[] = response.messages.map((msg) => {
          // Determine user name based on sender role
          let senderName = "Unknown";
          if (msg.senderRole === "STUDENT") {
            senderName = dbChat.student?.firstName
              ? `${dbChat.student.firstName} ${dbChat.student.lastName || ''}`.trim()
              : "Student";
          } else {
            senderName = dbChat.agent?.user?.firstName
              ? `${dbChat.agent.user.firstName} ${dbChat.agent.user.lastName || ''}`.trim()
              : "Agent";
          }

          // If we don't have full chat data, use role as name
          if (senderName === "Unknown" || senderName === "") {
            senderName = msg.senderRole === "STUDENT" ? "Student" : "Agent";
          }

          return {
            id: msg.id,
            content: msg.content,
            roomId: dbChat.id,
            user: {
              id: msg.senderId,
              name: senderName,
              role: msg.senderRole === "STUDENT" ? UserTypeEnum.STUDENT : (msg.senderRole === "AGENT" ? UserTypeEnum.AGENT : UserTypeEnum.SELECTED_AGENT),
            },
            createdAt: msg.createdAt,
            attachmentUrl: msg.attachmentUrl,
            attachmentType: msg.attachmentType,
            attachmentName: msg.attachmentName,
            attachmentSize: msg.attachmentSize,
          };
        });

        setMessages(transformedMessages);

        // Mark unread messages as read
        const unreadIds = response.messages
          .filter((msg) => msg.senderId !== user.id && msg.status !== "READ")
          .map((msg) => msg.id);

        if (unreadIds.length > 0) {
          await updateMessageStatus(unreadIds, "READ");
        }
      } catch (error) {
        console.error("Failed to load messages:", error);

        // Type guard for axios error response
        if (
          error &&
          typeof error === 'object' &&
          'response' in error &&
          (error as { response?: { status?: number } }).response?.status === 403
        ) {
          setChatError("You do not have permission to view this conversation.");
        } else {
          // Fall back to localStorage
          const storedMessages = localStorage.getItem(`chat-messages-${roomId}`);
          if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
          }
        }
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [dbChat?.id, dbChat?.student, dbChat?.agent?.user, roomId, user.id]);

  // Setup realtime channel
  useEffect(() => {
    const channelName = dbChat?.id ? `chat:${dbChat.id}` : `chat-${roomId}`;
    const newChannel = supabase.channel(channelName);

    newChannel
      .on("broadcast", { event: "message" }, (payload) => {
        const incomingMessage = payload.payload as ChatMessageData;
        setMessages((current) => {
          // Avoid duplicates
          if (current.find((m) => m.id === incomingMessage.id)) {
            return current;
          }
          const updated = [...current, incomingMessage];
          // Only use localStorage as fallback
          if (!dbChat?.id) {
            localStorage.setItem(
              `chat-messages-${roomId}`,
              JSON.stringify(updated)
            );
          }
          return updated;
        });

        // Mark as read if from other user
        if (incomingMessage.user.id !== user.id && dbChat?.id) {
          updateMessageStatus([incomingMessage.id], "READ").catch(console.error);
        }
      })
      .subscribe(async (status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomId, dbChat?.id, supabase, user.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const hasContent = newMessage.trim().length > 0;
      const hasFile = !!selectedFile;

      if ((!hasContent && !hasFile) || !isConnected || !channel || isSending || isUploading) return;

      setIsSending(true);

      try {
        let uploadedAttachment = undefined;

        if (selectedFile) {
          const result = await uploadFile(selectedFile);
          if (result) {
            uploadedAttachment = result;
          } else {
            console.error("File upload failed");
            // Optionally show error to user
            return;
          }
        }

        let messageId = crypto.randomUUID();
        const messageContent = newMessage.trim();

        // Save to database if we have a db chat
        if (dbChat?.id) {
          const savedMessage = await sendChatMessage(dbChat.id, messageContent, uploadedAttachment);
          messageId = savedMessage.id;
        }

        const message: ChatMessageData = {
          id: messageId,
          content: messageContent,
          roomId: dbChat?.id || roomId,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
          },
          createdAt: new Date().toISOString(),
          attachmentUrl: uploadedAttachment?.url,
          attachmentType: uploadedAttachment?.type,
          attachmentName: uploadedAttachment?.name,
          attachmentSize: uploadedAttachment?.size,
        };

        // Update local state immediately
        setMessages((current) => {
          const updated = [...current, message];
          // Only use localStorage as fallback
          if (!dbChat?.id) {
            localStorage.setItem(
              `chat-messages-${roomId}`,
              JSON.stringify(updated)
            );
          }
          return updated;
        });

        // Broadcast to others
        await channel.send({
          type: "broadcast",
          event: "message",
          payload: message,
        });

        onMessageSent?.(messageContent);
        setNewMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    },
    [newMessage, isConnected, channel, isSending, isUploading, selectedFile, dbChat?.id, roomId, user, onMessageSent, uploadFile]
  );

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  }, [messages]);

  // Show error state if chat couldn't be initialized
  if (chatError) {
    return (
      <div className="flex flex-col h-full w-full bg-background items-center justify-center p-8">
        <div className="text-center max-w-md">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Unable to Start Chat</h3>
          <p className="text-muted-foreground text-sm mb-4">{chatError}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const isAgent = user.role === UserTypeEnum.AGENT || user.role === UserTypeEnum.SELECTED_AGENT;

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Messages area */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-y-auto space-y-4 px-4 pb-4",
          isAgent ? "pt-0" : "pt-4"
        )}
      >
        {isLoadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-8 h-8 mb-4 animate-spin" />
            <p className="text-sm">Loading messages...</p>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-sm text-center">No messages yet</p>
            <p className="text-xs text-center mt-1">
              {user.role === UserTypeEnum.STUDENT
                ? "Ask your question to get help from an agent"
                : "Waiting for the student to send a message"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedMessages.map((message, index) => {
              const prevMessage =
                index > 0 ? sortedMessages[index - 1] : null;
              const showHeader =
                !prevMessage || prevMessage.user.id !== message.user.id;
              const isOwnMessage = message.user.id === user.id;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <ChatMessageBubble
                    message={message}
                    isOwnMessage={isOwnMessage}
                    showHeader={showHeader}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 pt-4 pb-2 md:p-4">
        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded-md w-fit animate-in fade-in slide-in-from-bottom-2">
            {selectedFile.type.startsWith('image/') ? (
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <FileIcon className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs truncate max-w-[200px]">{selectedFile.name}</span>
            <button
              onClick={handleRemoveFile}
              className="ml-1 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 items-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.zip,.doc,.docx,.txt"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            disabled={!isConnected || isSending || isUploading || !!selectedFile}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Input
            className="rounded-full bg-background text-sm transition-all duration-300 flex-1"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              user.role === UserTypeEnum.STUDENT
                ? "Type your question..."
                : "Type your reply..."
            }
            disabled={!isConnected || isSending || isUploading}
          />

          {isConnected && (newMessage.trim() || selectedFile) && (
            <Button
              className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300 shrink-0 bg-edvios-green text-white hover:opacity-90"
              type="submit"
              disabled={!isConnected || isSending || isUploading}
              size="icon"
            >
              {isSending || isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

interface ChatMessageBubbleProps {
  message: ChatMessageData;
  isOwnMessage: boolean;
  showHeader: boolean;
}

function ChatMessageBubble({
  message,
  isOwnMessage,
  showHeader,
}: ChatMessageBubbleProps) {
  const roleLabel =
    message.user.role === UserTypeEnum.STUDENT ? "Student" : "Agent";
  const roleColor =
    message.user.role === UserTypeEnum.STUDENT
      ? "text-blue-600 dark:text-blue-400"
      : "text-green-600 dark:text-green-400";
  const displayName = message.user.name.includes("@")
    ? message.user.name.split("@")[0]
    : message.user.name;
  const hasImageAttachment = Boolean(
    message.attachmentUrl && message.attachmentType?.startsWith("image/")
  );
  const hasOnlyImageAttachment = hasImageAttachment && !message.content;

  const renderAttachment = () => {
    if (!message.attachmentUrl) return null;

    // Check for image types
    if (message.attachmentType?.startsWith("image/")) {
      return (
        <div className="mb-2 relative rounded-md overflow-hidden max-w-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={message.attachmentUrl}
            alt={message.attachmentName || "Attachment"}
            className="w-full h-auto object-cover max-h-[300px]"
            loading="lazy"
          />
        </div>
      );
    }

    // Generic file attachment
    return (
      <a
        href={message.attachmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 mb-2 p-2 rounded-md transition-colors",
          isOwnMessage
            ? "bg-primary/10 hover:bg-primary/20"
            : "bg-muted/60 hover:bg-muted/80"
        )}
      >
        <FileIcon className="w-5 h-5 shrink-0" />
        <div className="flex flex-col overflow-hidden text-left min-w-0">
          <span className="text-xs font-semibold truncate max-w-[150px]">{message.attachmentName || "File"}</span>
          <span className="text-[10px] opacity-80">
            {message.attachmentSize ? `${(message.attachmentSize / 1024).toFixed(1)} KB` : "Download"}
          </span>
        </div>
        <Download className="w-4 h-4 ml-1 opacity-70 shrink-0" />
      </a>
    );
  };

  return (
    <div
      className={`flex mt-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={cn("max-w-[75%] w-fit flex flex-col gap-1", {
          "items-end": isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 text-xs px-3", {
              "justify-end flex-row-reverse": isOwnMessage,
            })}
          >
            <span className="font-medium">{displayName}</span>
            <span className={cn("text-xs font-medium", roleColor)}>
              ({roleLabel})
            </span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            "text-sm w-fit relative",
            hasOnlyImageAttachment ? "p-0 bg-transparent" : "py-2 px-3",
            hasOnlyImageAttachment
              ? "rounded-xl"
              : "rounded-xl",
            isOwnMessage
              ? hasOnlyImageAttachment
                ? "text-foreground"
                : "bg-edvios-green text-white"
              : "bg-muted text-foreground"
          )}
        >
          {renderAttachment()}
          {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
        </div>
      </div>
    </div>
  );
}
