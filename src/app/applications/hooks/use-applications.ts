'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Application, PaginationParams } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';
import { applicationsApi } from '@/app/applications/api/applications.api';
import { AppToast } from '@/utils/toast-utils';

export const useApplications = (status?: ApplicationStatus) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ [key in ApplicationStatus]?: number }>({});
  const [countsLoading, setCountsLoading] = useState(true);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
      page: 1,
      size: 10,
      status: status,
    })
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Update paginationParams when status filter changes
  useEffect(() => {
    setPaginationParams(prev => ({
      ...prev,
      page: 1, // Reset to first page when status changes
      status: status
    }));
  }, [status]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = sessionStorage.getItem("user-session");
      if (!user) {
        throw new Error("User not found");
      }

      const userRole = JSON.parse(user).role;
      let response;

      if (userRole === "ADMIN") {
        response = await applicationsApi.getAdminApplications(paginationParams);
      } else if (userRole === "AGENT") {
        response = await applicationsApi.getAgentApplications(paginationParams);
      } else {
        throw new Error("Invalid user role");
      }

      if (response) {
        setApplications(response.data);
        setTotalItems(response.total);
        setTotalPages(Math.ceil(response.total / (paginationParams.size || 10)));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load applications';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [paginationParams]);

  const fetchCounts = useCallback(async () => {
    try {
      setCountsLoading(true);
      const response = await applicationsApi.getCount();
      console.log('Count API response:', response);
      setCounts(response.count);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load counts';
      console.error('Count fetch error:', err);
    } finally {
      setCountsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const updateApplicationStatus = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(id, newStatus);
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
      AppToast.success(`Application status updated to ${newStatus.toLowerCase()}`);
      // Refetch counts after status update
      fetchCounts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      throw err;
    }
  };

  // Pagination actions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPaginationParams(prev => ({ ...prev, page }));
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if ((paginationParams.page ?? 1) < totalPages) {
      setPaginationParams(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }));
    }
  }, [paginationParams.page, totalPages]);

  const previousPage = useCallback(() => {
    if ((paginationParams.page ?? 1) > 1) {
      setPaginationParams(prev => ({ ...prev, page: (prev.page ?? 1) - 1 }));
    }
  }, [paginationParams.page]);

  const changePageSize = useCallback((size: number) => {
    setPaginationParams({ page: 1, size, status });
  }, [status]);

  const metrics = useMemo(() => {
    const total = Object.values(counts).reduce((sum, count) => sum + (count || 0), 0);
    const pending = counts[ApplicationStatus.SUBMITTED] || 0;
    const approved = counts[ApplicationStatus.ACCEPTED] || 0;
    const rejected = counts[ApplicationStatus.REJECTED] || 0;
    
    return { total, pending, approved, rejected };
  }, [counts]);

  return {
    applications,
    loading,
    error,
    counts,
    countsLoading,
    metrics,
    updateApplicationStatus,
    refetch: fetchApplications,
    refetchCounts: fetchCounts,
    paginationParams,
    totalItems,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
  };
};
