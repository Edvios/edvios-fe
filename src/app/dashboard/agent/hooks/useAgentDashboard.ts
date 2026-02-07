"use client";

import { useState, useEffect, useCallback } from "react";
import { AppToast } from "@/utils/toast-utils";
import { agentDashboardApi } from "../api/dashboard.api";
import { AgentApplication, DashboardStats } from "../types/dashboard.types";
import { applicationsApi } from "@/app/applications/api/applications.api";

export const useApplications = () => {
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<DashboardStats | null>(null);
  const [countsLoading, setCountsLoading] = useState(true);

  const user = sessionStorage.getItem("user-session");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) {
        throw new Error("User not found");
      }
      if (JSON.parse(user).role === "ADMIN") {
        const response = await applicationsApi.getAdminApplications({ page: 1, size: 3 });
        setApplications(response.data);
      } else if (JSON.parse(user).role === "AGENT") {
        const response = await applicationsApi.getAgentApplications({ page: 1, size: 3 });
        setApplications(response.data);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load applications";
      setError(message);
      AppToast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      setCountsLoading(true);
      const data = await agentDashboardApi.getStats();
      console.log("Count API response:", data);
      setCounts(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load counts";
      console.error("Count fetch error:", err);
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
