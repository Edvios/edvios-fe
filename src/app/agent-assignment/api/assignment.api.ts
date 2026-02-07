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
