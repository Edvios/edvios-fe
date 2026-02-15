"use client";

import { useCurrentUser } from "./hooks/use-current-user";
import { useChatRooms } from "./hooks/use-chat-rooms";
import { ChatRoomList } from "./components/chat-room-list";
import { StudentAgentChat } from "./components/student-agent-chat";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, MessageSquare, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
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
    } else if (user?.role === UserTypeEnum.AGENT || user?.role === UserTypeEnum.SELECTED_AGENT) {
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

  const isAgent = user.role === UserTypeEnum.AGENT || user.role === UserTypeEnum.SELECTED_AGENT;

  return (
    <div
      className={cn(
        "overflow-hidden bg-background min-h-[100svh]",
        isAgent
          ? "h-[calc(100svh-0px)] md:h-[calc(100vh-0px)]"
          : "h-[calc(100svh-12px)] md:h-[calc(100vh-12px)]"
      )}
    >
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full h-12 w-12 hover:bg-gray-100 shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="w-12 h-12 rounded-2xl bg-edvios-blue flex items-center justify-center shadow-lg shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              {isAgent ? (
                <Users className="w-7 h-7 text-white" />
              ) : (
                <MessageSquare className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="font-heading min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-edvios-blue truncate">
                {isAgent ? "Inbox" : "Chat with Agent"}
              </h2>
              <p className="text-gray-600 truncate">
                {isAgent
                  ? `${rooms.length} active conversations`
                  : "How can we help you today?"}
              </p>
            </div>
          </div>

          {isAgent && selectedRoom && (
            <div className="flex items-center gap-3 md:pl-4 border-l md:border-l-gray-200">
              <div className="w-10 h-10 rounded-full bg-edvios-green flex items-center justify-center shrink-0">
                <span className="text-white font-medium">
                  {selectedRoom.studentName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {selectedRoom.studentName}
                </p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "w-full max-w-7xl mx-auto overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100",
          "h-[calc(100svh-220px)] md:h-[calc(100vh-220px)]"
        )}
      >
        {isAgent ? (
          // Agent view: Room list + Chat
          <div className="flex h-full">
            {/* Room list sidebar */}
            <div className="w-80 shrink-0 hidden md:block">
              <div className="p-3">
                <h2 className="font-medium text-sm text-muted-foreground">
                  Chats
                </h2>
              </div>
              <ChatRoomList
                rooms={rooms}
                selectedRoom={selectedRoom}
                onSelectRoom={selectRoom}
              />
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col bg-sidebar">
              {selectedRoom ? (
                <>
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

              {/* Mobile rooms drawer */}
              <Sheet open={isRoomsOpen} onOpenChange={setIsRoomsOpen}>
                <SheetContent side="left" className="p-0 w-80">
                  <SheetHeader className="px-4 py-3">
                    <SheetTitle>Chats</SheetTitle>
                  </SheetHeader>
                  <ChatRoomList
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={(room) => {
                      selectRoom(room);
                      setIsRoomsOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        ) : (
          // Student view: Direct chat
          <div className="h-full bg-sidebar">
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
