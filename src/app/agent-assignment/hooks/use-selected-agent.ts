import { useState, useCallback, useEffect } from 'react';
import { Agent } from '@/app/agent-management/types/agent.types';
import { updateAgentStatus, fetchSelectedAgent } from '../api/assignment.api';
import { showSuccessToast, showErrorToast } from '@/utils/toast-utils';

export const useSelectedAgent = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAgentList, setShowAgentList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current selected agent on mount
  useEffect(() => {
    const loadSelectedAgent = async () => {
      try {
        setIsLoading(true);
        const agent = await fetchSelectedAgent();
        setSelectedAgent(agent);
      } catch (error) {
        console.error('Error loading selected agent:', error);
        showErrorToast('Failed to load selected agent');
      } finally {
        setIsLoading(false);
      }
    };

    loadSelectedAgent();
  }, []);

  const handleSetAgentClick = useCallback(() => {
    setShowAgentList(true);
  }, []);

  const closeAgentList = useCallback(() => {
    setShowAgentList(false);
  }, []);

  const handleAgentSelect = useCallback(async (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentList(false);
    setIsSubmitting(true);

    try {
      await updateAgentStatus(agent.id, selectedAgent?.id || '');
      showSuccessToast(`Selected agent: ${agent.firstName} ${agent.lastName}`);
    } catch (error) {
      console.error('Error updating agent role:', error);
      showErrorToast('Failed to set selected agent');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedAgent]);

  return {
    selectedAgent,
    showAgentList,
    isSubmitting,
    isLoading,
    handleSetAgentClick,
    closeAgentList,
    handleAgentSelect,
  };
};
