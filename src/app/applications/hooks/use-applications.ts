'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Application } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';
import { applicationsApi } from '@/app/applications/api/applications.api';
import { AppToast } from '@/utils/toast-utils';

export const useApplications = (status?: ApplicationStatus) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ [key in ApplicationStatus]?: number }>({});
  const [countsLoading, setCountsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsApi.getByStatus(status);
      setApplications(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load applications';
      setError(message);
      AppToast.error(message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const fetchCounts = useCallback(async () => {
    try {
      setCountsLoading(true);
      const response = await applicationsApi.getCount();
      console.log('Count API response:', response);
      setCounts(response.count);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load counts';
      console.error('Count fetch error:', err);
      AppToast.error(message);
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

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(id, status);
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      AppToast.success(`Application status updated to ${status.toLowerCase()}`);
      // Refetch counts after status update
      fetchCounts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      AppToast.error(message);
      throw err;
    }
  };

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
  };
};
