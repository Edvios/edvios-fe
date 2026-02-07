import { useState, useEffect, useCallback } from 'react';
import { fetchAssignments } from '../api/assignment.api';
import { StudentAssignment, AssignmentFilters } from '../types/assignment.types';

interface AssignmentApiResponse {
  id: string;
  student?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  agent?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const useAssignments = (filters: AssignmentFilters) => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { page, search, pageSize } = filters;

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAssignments({
        page,
        search,
        pageSize,
      });
      console.log('Fetched assignments:', response);
      
      const fetchedAssignments = response.map((assignment: AssignmentApiResponse) => ({
        id: assignment.id,
        studentId: assignment.student?.id,
        agentId: assignment.agent?.user?.id || assignment.agent?.id || null,
        student: {
          id: assignment.student?.id,
          firstName: assignment.student?.firstName || '',
          lastName: assignment.student?.lastName || '',
          email: assignment.student?.email || '',
          phone: assignment.student?.phone,
        },
        agent: assignment.agent ? {
          id: assignment.agent.user?.id || assignment.agent.id,
          firstName: assignment.agent.user?.firstName || assignment.agent.firstName || '',
          lastName: assignment.agent.user?.lastName || assignment.agent.lastName || '',
          email: assignment.agent.user?.email || assignment.agent.email || '',
          phone: assignment.agent.user?.phone || assignment.agent.phone,
        } : null,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      }));
      
      setAssignments(fetchedAssignments);
      setTotal(response.length);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setAssignments([]);
      setTotal(0);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const refetch = useCallback(() => {
    loadAssignments();
  }, [loadAssignments]);

  return {
    assignments,
    total,
    loading,
    error,
    refetch,
  };
};
