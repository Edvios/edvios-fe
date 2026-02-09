import axiosInstance from '@/lib/axios';
import { AssignmentFilters, AssignmentResponse, UpdateAssignmentRequest } from '../types/assignment.types';

/**
 * Fetch all student-agent assignments with optional filters
 */
export const fetchAssignments = async (filters: AssignmentFilters)=> {
  try {
    const params: Record<string, string | number> = {};

    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.size = filters.pageSize;

    const response = await axiosInstance.get('agents/agent-assignments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

/**
 * Update agent assignment for a student
 */
export const updateAssignment = async (assignmentId: string, agentId: string): Promise<void> => {
  try {
    await axiosInstance.patch(`agents/change-assignment/${assignmentId}/agent/${agentId}`);
  } catch (error) {
    console.error(`Error updating assignment:`, error);
    throw error;
  }
};

/**
 * Get current selected agent
 */
export const fetchSelectedAgent = async () => {
  try {
    const response = await axiosInstance.get('agents', { 
      params: { filter: 'SELECTED_AGENT', size: 1 } 
    });
    const agents = response.data.agents || [];
    return agents.length > 0 ? agents[0] : null;
  } catch (error) {
    console.error('Error fetching selected agent:', error);
    throw error;
  }
};

/**
 * Set selected agent
 */
export const updateAgentStatus = async (agentId: string, selectedAgentId: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/auth/change-role/${agentId}`, { role: 'SELECTED_AGENT' });
    await axiosInstance.patch(`/auth/change-role/${selectedAgentId}`, { role: 'AGENT' });
  } catch (error) {
    console.error(`Error setting agent`, error);
    throw error;
  }
};
