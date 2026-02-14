"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";
import { ChatRoom, ChatUser } from "../types/chat.types";
import { getUserChats, type Chat } from "@/lib/chat-api";

const ROOM_CHANNEL = "global-chat-rooms";

// Convert database chat to ChatRoom format
function dbChatToRoom(chat: Chat): ChatRoom {
  const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[0] : undefined;

  // Safe access helper for student name
  const studentName = chat.student
    ? (chat.student.firstName
      ? `${chat.student.firstName} ${chat.student.lastName || ''}`.trim()
      : chat.student.email)
    : 'Unknown Student';

  // Safe access helper for agent name
  const agentName = chat.agent && chat.agent.user
    ? (chat.agent.user.firstName
      ? `${chat.agent.user.firstName} ${chat.agent.user.lastName || ''}`.trim()
      : chat.agent.user.email)
    : 'Unknown Agent';

  return {
    id: chat.id,
    studentId: chat.studentId,
    studentName: studentName || 'Student',
    agentId: chat.agentId,
    agentName: agentName || 'Agent',
    lastMessage: lastMsg?.content,
    lastMessageAt: lastMsg?.createdAt,
    createdAt: chat.createdAt,
    unreadCount: chat.unreadCount,
  };
}

export function useChatRooms(user: ChatUser | null) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const studentRoomRef = useRef<ChatRoom | null>(null);

  // Load chats from database on mount
  useEffect(() => {
    const loadDbChats = async () => {
      if (!user) return;

      try {
        const dbChats = await getUserChats();

        if (dbChats.length > 0) {
          const chatRooms = dbChats.map(chat => dbChatToRoom(chat));
          setRooms(chatRooms);

          // For students, auto-select their chat
          if (user.role === UserTypeEnum.STUDENT && chatRooms.length > 0) {
            setSelectedRoom(chatRooms[0]);
            studentRoomRef.current = chatRooms[0];
          }
        }
      } catch (error) {
        console.error("Failed to load chats from database:", error);
      }
    };

    loadDbChats();
  }, [user]);

  // Initialize the realtime channel and handle room discovery
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(ROOM_CHANNEL);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "room-announce" }, (payload) => {
        // When a student announces their room, agents add it to their list
        // But only if it has a valid UUID (from database) AND the agent is assigned to this chat
        if (user.role === UserTypeEnum.AGENT) {
          const announcedRoom = payload.payload as ChatRoom;

          // Verify this chat belongs to the current agent (Strict check)
          if (!announcedRoom.agentId || announcedRoom.agentId !== user.id) {
            return;
          }

          // Only accept rooms with valid UUID format (from database)
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(announcedRoom.id);
          if (!isValidUUID) {
            return;
          }
          setRooms((current) => {
            const exists = current.find((r) => r.id === announcedRoom.id);
            if (exists) {
              // Update existing room
              return current.map((r) =>
                r.id === announcedRoom.id ? announcedRoom : r
              );
            }
            // Add new room
            return [...current, announcedRoom].sort(
              (a, b) =>
                new Date(b.lastMessageAt || b.createdAt).getTime() -
                new Date(a.lastMessageAt || a.createdAt).getTime()
            );
          });
        }
      })
      .on("broadcast", { event: "room-update" }, (payload) => {
        // When a room is updated (new message), update the room in the list
        const updatedRoom = payload.payload as ChatRoom;

        // Only accept rooms with valid UUID format (from database)
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updatedRoom.id);

        if (user.role === UserTypeEnum.AGENT) {
          if (!isValidUUID) {
            return;
          }

          // Verify this chat belongs to the current agent (Strict check)
          if (!updatedRoom.agentId || updatedRoom.agentId !== user.id) {

            return;
          }

          setRooms((current) => {
            const exists = current.find((r) => r.id === updatedRoom.id);
            if (!exists) {
              // Room doesn't exist, add it
              return [...current, updatedRoom].sort(
                (a, b) =>
                  new Date(b.lastMessageAt || b.createdAt).getTime() -
                  new Date(a.lastMessageAt || a.createdAt).getTime()
              );
            }
            // Update existing room
            return current
              .map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
              .sort(
                (a, b) =>
                  new Date(b.lastMessageAt || b.createdAt).getTime() -
                  new Date(a.lastMessageAt || a.createdAt).getTime()
              );
          });

          // Update selected room if it's the one being updated
          setSelectedRoom((current) =>
            current?.id === updatedRoom.id ? updatedRoom : current
          );
        } else if (
          user.role === UserTypeEnum.STUDENT &&
          updatedRoom.studentId === user.id
        ) {
          // Student's own room was updated
          setSelectedRoom(updatedRoom);
          studentRoomRef.current = updatedRoom;
        }
      })
      .on("broadcast", { event: "request-rooms" }, async () => {
        // When an agent requests rooms, students announce their rooms
        if (user.role === UserTypeEnum.STUDENT && studentRoomRef.current) {
          // Small delay to prevent message collision
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 500)
          );
          await channel.send({
            type: "broadcast",
            event: "room-announce",
            payload: studentRoomRef.current,
          });
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          if (user.role === UserTypeEnum.STUDENT) {
            // For students, use the room from database if already loaded
            // The room should have been loaded in the earlier useEffect
            // If not, create a temporary one (will be replaced when chat starts)
            if (!studentRoomRef.current) {
              // This is a fallback - the actual room should come from startChat API
              const tempRoom: ChatRoom = {
                id: `temp-${user.id}`, // Temporary ID, will be replaced with DB ID
                studentId: user.id,
                studentName: user.name,
                createdAt: new Date().toISOString(),
              };
              studentRoomRef.current = tempRoom;
              setRooms([tempRoom]);
              setSelectedRoom(tempRoom);
            }

            // Only announce if we have a valid UUID (from database)
            if (studentRoomRef.current && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentRoomRef.current.id)) {
              await channel.send({
                type: "broadcast",
                event: "room-announce",
                payload: studentRoomRef.current,
              });
            }
          } else if (user.role === UserTypeEnum.AGENT) {
            // Request all active rooms from students
            await channel.send({
              type: "broadcast",
              event: "request-rooms",
              payload: { agentId: user.id },
            });
          }
          setIsLoading(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const selectRoom = useCallback((room: ChatRoom) => {
    setSelectedRoom(room);
  }, []);

  const updateRoomLastMessage = useCallback(
    async (roomId: string, message: string) => {
      const updatedData: Partial<ChatRoom> = {
        lastMessage: message,
        lastMessageAt: new Date().toISOString(),
      };

      // Update local state
      if (user?.role === UserTypeEnum.STUDENT && studentRoomRef.current) {
        const updated = {
          ...studentRoomRef.current,
          ...updatedData,
        };
        studentRoomRef.current = updated;
        setSelectedRoom(updated);
        setRooms([updated]);
      } else {
        setRooms((current) =>
          current.map((room) =>
            room.id === roomId ? { ...room, ...updatedData } : room
          )
        );
      }

      // Broadcast the update to all connected clients
      if (channelRef.current) {
        const fullRoom =
          user?.role === UserTypeEnum.STUDENT
            ? studentRoomRef.current
            : rooms.find((r) => r.id === roomId);

        if (fullRoom) {
          await channelRef.current.send({
            type: "broadcast",
            event: "room-update",
            payload: { ...fullRoom, ...updatedData },
          });
        }
      }
    },
    [user, rooms]
  );

  const announceRoom = useCallback(async () => {
    if (
      user?.role === UserTypeEnum.STUDENT &&
      studentRoomRef.current &&
      channelRef.current
    ) {
      await channelRef.current.send({
        type: "broadcast",
        event: "room-announce",
        payload: studentRoomRef.current,
      });
    }
  }, [user]);

  // Update the room with data from the database (called when chat is initialized)
  const updateRoomFromDb = useCallback(async (chat: Chat) => {
    if (!user) return;

    const chatRoom = dbChatToRoom(chat);

    if (user.role === UserTypeEnum.STUDENT) {
      studentRoomRef.current = chatRoom;
      setRooms([chatRoom]);
      setSelectedRoom(chatRoom);

      // Announce the room with valid database ID to agents
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "room-announce",
          payload: chatRoom,
        });
      }
    } else {
      // For agents, update the room in the list
      setRooms((current) => {
        const exists = current.find((r) => r.id === chatRoom.id);
        if (exists) {
          return current.map((r) => (r.id === chatRoom.id ? chatRoom : r));
        }
        return [...current, chatRoom];
      });
      setSelectedRoom(chatRoom);
    }
  }, [user]);

  return {
    rooms,
    selectedRoom,
    isLoading,
    selectRoom,
    updateRoomLastMessage,
    announceRoom,
    updateRoomFromDb,
  };
}
