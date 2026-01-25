import { useState, useEffect, useCallback } from "react";
import { fetchAgents } from "../api/agent.api";
import { Agent, AgentFilters } from "../types/agent.types";

export const useAgents = (filters: AgentFilters) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    search = "",
    filter,
    page = 1,
    pageSize = 10,
  } = filters;

  const loadAgents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAgents({
        search,
        filter,
        page,
        pageSize,
      });

      setAgents(response?.agents ?? []);
      setTotal(response?.total ?? 0);
    } catch (err) {
      setAgents([]);
      setTotal(0);
      setError("Failed to load agents");
    } finally {
      setLoading(false);
    }
  }, [search, filter, page, pageSize]);

  // Added `refetch` method to reload agents
  const refetch = useCallback(() => {
    loadAgents();
  }, [loadAgents]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return { agents, total, loading, error, refetch };
};
