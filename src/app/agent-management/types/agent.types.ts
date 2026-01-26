export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'AGENT' | 'PENDING_AGENT';
  phone?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from the Agent profile (if any, but backend shows User objects)
  address?: string;
  city?: string;
  country?: string;
  organization?: string;
}

export type AgentStatus = 'ALL' | 'AGENT' | 'PENDING_AGENT';

export interface AgentFilters {
  search?: string;
  filter?: AgentStatus;
  page?: number;
  pageSize?: number;
}

export interface AgentResponse {
  agents: Agent[];
  total: number;
  page: number;
  size: number;
}