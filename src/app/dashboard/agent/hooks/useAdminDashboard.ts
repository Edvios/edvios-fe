'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppToast } from '@/utils/toast-utils';
import { adminDashboardApi } from '../api/dashboard.api';
import { AgentApplication, DashboardStats } from '../types/dashboard.types';

export const useApplications = () => {
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<DashboardStats | null>(null);
  const [countsLoading, setCountsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminDashboardApi.getAllWithPaginationAndFilters();
      setApplications(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load applications';
      setError(message);
      AppToast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      setCountsLoading(true);
      const data = await adminDashboardApi.getStats();
      console.log('Count API response:', data);
      setCounts(data);
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

  return {
    applications,
    loading,
    error,
    counts,
    countsLoading,
    refetch: fetchApplications,
    refetchCounts: fetchCounts,
  };
};
