"use client";

import { useCurrentUser } from "./hooks/use-current-user";
import { useChatRooms } from "./hooks/use-chat-rooms";
import { ChatRoomList } from "./components/chat-room-list";
import { StudentAgentChat } from "./components/student-agent-chat";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ChatPage() {
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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumb items={[{ label: isAgent ? "Inbox" : "Support Chat", active: true }]} className="mb-0" />

          {isAgent && selectedRoom && (
            <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm">
              <div className="w-8 h-8 rounded-full bg-edvios-green/10 text-edvios-green flex items-center justify-center">
                <span className="font-bold text-xs">
                  {selectedRoom.studentName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-black truncate">
                  {selectedRoom.studentName}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Student</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main
          className={cn(
            "w-full overflow-hidden bg-white rounded-lg border border-gray-100",
            "h-[calc(100svh-220px)] md:h-[calc(100vh-225px)]"
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
    </div>
  );
}
