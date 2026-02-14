import { useState, useEffect, useCallback } from 'react';
import { fetchAssignments } from '../api/assignment.api';
import { StudentAssignment, AssignmentFilters } from '../types/assignment.types';

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


      setAssignments(response);
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
