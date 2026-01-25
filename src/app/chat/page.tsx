"use client";

import { useCurrentUser } from "./hooks/use-current-user";
import { useChatRooms } from "./hooks/use-chat-rooms";
import { ChatRoomList } from "./components/chat-room-list";
import { StudentAgentChat } from "./components/student-agent-chat";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useCurrentUser();
  const {
    rooms,
    selectedRoom,
    isLoading: roomsLoading,
    selectRoom,
    updateRoomLastMessage,
    updateRoomFromDb,
  } = useChatRooms(user);

  const handleBack = () => {
    if (user?.role === UserTypeEnum.STUDENT) {
      router.push("/dashboard/student");
    } else if (user?.role === UserTypeEnum.AGENT) {
      router.push("/dashboard/agent");
    } else {
      router.push("/");
    }
  };

  const handleMessageSent = (message: string) => {
    if (selectedRoom) {
      updateRoomLastMessage(selectedRoom.id, message);
    }
  };

  if (userLoading || roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAgent = user.role === UserTypeEnum.AGENT;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isAgent ? "bg-green-500" : "bg-blue-500"
                  )}
                >
                  {isAgent ? (
                    <Users className="w-5 h-5 text-white" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    {isAgent ? "Support Inbox" : "Chat with Agent"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {isAgent
                      ? `${rooms.length} conversation${rooms.length !== 1 ? "s" : ""}`
                      : "Ask your questions here"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  isAgent
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                )}
              >
                {user.role}
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {isAgent ? (
          // Agent view: Room list + Chat
          <div className="flex h-[calc(100vh-65px)]">
            {/* Room list sidebar */}
            <div className="w-80 border-r shrink-0 hidden md:block">
              <div className="p-3 border-b">
                <h2 className="font-medium text-sm text-muted-foreground">
                  Student Conversations
                </h2>
              </div>
              <ChatRoomList
                rooms={rooms}
                selectedRoom={selectedRoom}
                onSelectRoom={selectRoom}
              />
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Mobile room selector */}
                  <div className="md:hidden p-2 border-b">
                    <select
                      className="w-full p-2 border rounded-lg bg-background"
                      value={selectedRoom.id}
                      onChange={(e) => {
                        const room = rooms.find((r) => r.id === e.target.value);
                        if (room) selectRoom(room);
                      }}
                    >
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.studentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected room header */}
                  <div className="p-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {selectedRoom.studentName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {selectedRoom.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">Student</p>
                      </div>
                    </div>
                  </div>

                  <StudentAgentChat
                    roomId={selectedRoom.id}
                    user={user}
                    onMessageSent={handleMessageSent}
                    onChatInitialized={updateRoomFromDb}
                  />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg">No conversation selected</p>
                  <p className="text-sm mt-1">
                    Select a student from the list to start helping
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Student view: Direct chat
          <div className="h-[calc(100vh-65px)]">
            {selectedRoom && (
              <StudentAgentChat
                roomId={selectedRoom.id}
                user={user}
                onMessageSent={handleMessageSent}
                onChatInitialized={updateRoomFromDb}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
