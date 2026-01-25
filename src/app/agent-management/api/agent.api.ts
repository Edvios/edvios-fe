import axiosInstance from '@/lib/axios';
import { Agent, AgentFilters, AgentResponse } from '../types/agent.types';

// Fetch all agents with optional filters
export const fetchAgents = async (filters: AgentFilters): Promise<AgentResponse> => {
  try {
    const params: Record<string, string | number> = {};

    if (filters.search) params.search = filters.search;
    if (filters.filter && filters.filter !== 'ALL') params.filter = filters.filter;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.size = filters.pageSize;

    const response = await axiosInstance.get<AgentResponse>('/agents', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

// Get single agent by ID
export const getAgent = async (agentId: string): Promise<Agent> => {
  try {
    const response = await axiosInstance.get<Agent>(`/agents/${agentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching agent ${agentId}:`, error);
    throw error;
  }
};

// Approve an agent (Change role from PENDING_AGENT to AGENT)
export const approveAgent = async (agentId: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/auth/change-role/${agentId}`, { role: 'AGENT' });
  } catch (error) {
    console.error(`Error approving agent ${agentId}:`, error);
    throw error;
  }
};

// Reject/Delete an agent
export const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/auth/delete-user/${agentId}`);
  } catch (error) {
    console.error(`Error deleting agent ${agentId}:`, error);
    throw error;
  }
};

// Update agent role manually (if needed)
export const updateAgentStatus = async (agentId: string, role: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/auth/change-role/${agentId}`, { role });
  } catch (error) {
    console.error(`Error updating agent status ${agentId}:`, error);
    throw error;
  }
};