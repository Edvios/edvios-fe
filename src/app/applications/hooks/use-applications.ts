'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';
import { applicationsApi } from '@/app/applications/api/applications.api';
import { AppToast } from '@/utils/toast-utils';

export const useApplications = (status?: ApplicationStatus) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = status ? await applicationsApi.getByStatus(status) : await applicationsApi.getAll();
      setApplications(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load applications';
      setError(message);
      AppToast.error(message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(id, status);
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      AppToast.success(`Application status updated to ${status.toLowerCase()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      AppToast.error(message);
      throw err;
    }
  };


  return {
    applications,
    loading,
    error,
    updateApplicationStatus,
    refetch: fetchApplications,
  };
};
