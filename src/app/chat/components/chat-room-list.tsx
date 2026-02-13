"use client";

import { cn } from "@/lib/utils";
import { ChatRoom } from "../types/chat.types";
import { MessageCircle, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
}

export function ChatRoomList({
  rooms,
  selectedRoom,
  onSelectRoom,
}: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm text-center">No conversations yet</p>
        <p className="text-xs text-center mt-1">
          Waiting for students to start chatting
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={cn(
              "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
              "hover:bg-accent",
              selectedRoom?.id === room.id
                ? "bg-accent"
                : "bg-transparent"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-edvios-green flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm truncate">
                  {room.studentName}
                </span>
                {room.lastMessageAt && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTime(room.lastMessageAt)}
                  </span>
                )}
              </div>
              {room.lastMessage && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {room.lastMessage}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
