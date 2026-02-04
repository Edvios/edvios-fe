import { useState, useCallback } from 'react';
import { Agent } from '@/app/agent-management/types/agent.types';
import { fetchAgents } from '@/app/agent-management/api/agent.api';
import { updateAssignment } from '../api/assignment.api';
import { AppToast } from '@/utils/toast-utils';

export const useAgentSelector = (onSuccess?: () => void) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAgents({
        filter: 'AGENT',
        pageSize: 100,
      });
      setAgents(response.agents);
    } catch (error) {
      console.error('Failed to load agents:', error);
      AppToast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredAgents = agents.filter((agent) =>
    `${agent.firstName} ${agent.lastName} ${agent.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const updateAgentAssignment = async (studentId: string, agentId: string) => {
    try {
      setSubmitting(true);
      await updateAssignment(studentId, { agentId });
      AppToast.success('Agent assigned successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to assign agent:', error);
      AppToast.error('Failed to assign agent');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const resetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    agents,
    loading,
    submitting,
    searchQuery,
    filteredAgents,
    setSearchQuery,
    loadAgents,
    updateAgentAssignment,
    resetSearch,
  };
};
