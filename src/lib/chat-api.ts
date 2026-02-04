import axiosInstance from './axios';

export interface ChatUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface ChatAgent {
  id: string;
  user: ChatUser;
}

export interface ChatStudent {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  user: ChatUser;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: 'STUDENT' | 'AGENT';
  content: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  attachmentName?: string | null;
  attachmentSize?: number | null;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  studentId: string;
  agentId: string;
  student: ChatStudent;
  agent: ChatAgent;
  messages: ChatMessage[];
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

export interface StartChatResponse {
  chat: Chat | null;
  agent: ChatAgent | null;
  error?: string;
}

// Get all chats for current user
export const getUserChats = async (): Promise<Chat[]> => {
  const response = await axiosInstance.get<Chat[]>('/chat');
  return response.data;
};

// Get unread message count
export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const response = await axiosInstance.get<{ unreadCount: number }>('/chat/unread-count');
  return response.data;
};

// Get assigned agent for student
export const getAssignedAgent = async (): Promise<ChatAgent | null> => {
  const response = await axiosInstance.get<ChatAgent | null>('/chat/assigned-agent');
  return response.data;
};

// Start a chat (for students - creates or gets existing chat with assigned agent)
export const startChat = async (): Promise<StartChatResponse> => {
  const response = await axiosInstance.post<StartChatResponse>('/chat/start');
  return response.data;
};

// Get a specific chat by ID
export const getChatById = async (chatId: string): Promise<Chat> => {
  const response = await axiosInstance.get<Chat>(`/chat/${chatId}`);
  return response.data;
};

// Get messages for a chat
export const getChatMessages = async (
  chatId: string,
  options?: { page?: number; size?: number; before?: string }
): Promise<MessagesResponse> => {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', options.page.toString());
  if (options?.size) params.append('size', options.size.toString());
  if (options?.before) params.append('before', options.before);

  const response = await axiosInstance.get<MessagesResponse>(
    `/chat/${chatId}/messages?${params.toString()}`
  );
  return response.data;
};

// Send a message
export const sendChatMessage = async (
  chatId: string,
  content: string,
  attachment?: { url: string; type: string; name: string; size: number }
): Promise<ChatMessage> => {
  const response = await axiosInstance.post<ChatMessage>(`/chat/${chatId}/messages`, {
    content,
    attachmentUrl: attachment?.url,
    attachmentType: attachment?.type,
    attachmentName: attachment?.name,
    attachmentSize: attachment?.size,
  });
  return response.data;
};

// Update message status (mark as read/delivered)
export const updateMessageStatus = async (
  messageIds: string[],
  status: 'DELIVERED' | 'READ'
): Promise<{ updated: number }> => {
  const response = await axiosInstance.patch<{ updated: number }>('/chat/messages/status', {
    messageIds,
    status,
  });
  return response.data;
};


