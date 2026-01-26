import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: UserTypeEnum;
}

export interface ChatRoom {
  id: string;
  studentId: string;
  studentName: string;
  agentId?: string;
  agentName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  unreadCount?: number;
}

export interface ChatMessageData {
  id: string;
  content: string;
  roomId: string;
  user: {
    id: string;
    name: string;
    role: UserTypeEnum;
  };
  createdAt: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  attachmentName?: string | null;
  attachmentSize?: number | null;
}
