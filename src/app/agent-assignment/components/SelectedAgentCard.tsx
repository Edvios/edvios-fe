'use client';

import React, { useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgentSelector } from '../hooks/use-agent-selector';
import { useSelectedAgent } from '../hooks/use-selected-agent';
import { Skeleton } from '@/components/ui/skeleton';

export const SelectedAgentCard: React.FC = () => {
  const {
    selectedAgent,
    showAgentList,
    isLoading,
    handleSetAgentClick,
    closeAgentList,
    handleAgentSelect,
  } = useSelectedAgent();

  const {
    loading: agentsLoading,
    searchQuery,
    filteredAgents,
    setSearchQuery,
    loadAgents,
    resetSearch,
  } = useAgentSelector();

  // Load agents when dropdown opens
  useEffect(() => {
    if (showAgentList) {
      loadAgents();
    }
  }, [showAgentList, loadAgents]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showAgentList) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAgentList]);

  // Close agent list when clicking outside
  useEffect(() => {
    if (!showAgentList) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-agent-selector]')) {
        closeAgentList();
        resetSearch();
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAgentList, resetSearch, closeAgentList]);

  return (
    <>
      <div
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:border-edvios-green transition-all group min-w-[200px]"
        onClick={() => {
          handleSetAgentClick();
          resetSearch();
        }}
        data-agent-selector
      >
        <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded font-bold uppercase tracking-wider">Default Agent</span>

        <div className="flex-1 flex items-center justify-end gap-2">
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : selectedAgent ? (
            <>
              <div className="w-6 h-6 rounded-full bg-edvios-green flex items-center justify-center text-white text-[10px] font-bold">
                {(selectedAgent.firstName?.[0] || '') + (selectedAgent.lastName?.[0] || '')}
              </div>
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {selectedAgent.firstName} {selectedAgent.lastName}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400 font-medium italic">Click to set</span>
          )}
          <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-edvios-green ml-1" />
        </div>
      </div>

      {showAgentList && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => {
              closeAgentList();
              resetSearch();
            }}
          />

          {/* Agent List Popup */}
          <div
            className="fixed top-[20%] right-4 z-50 w-[350px] rounded-xl bg-white shadow-xl overflow-hidden border border-gray-100 p-4"
            data-agent-selector
          >
            {agentsLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Command className="border-none">
                <div className="px-2 mb-2">
                  <CommandInput
                    placeholder="Search agents..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="border-none bg-gray-50 rounded-lg px-4 h-10 text-sm"
                  />
                </div>
                <CommandList className="max-h-[300px]">
                  <CommandEmpty>No agents found.</CommandEmpty>
                  <CommandGroup>
                    {filteredAgents.map((agent) => (
                      <CommandItem
                        key={agent.id}
                        value={`${agent.firstName} ${agent.lastName} ${agent.email}`}
                        onSelect={() => handleAgentSelect(agent)}
                        className="rounded-lg py-2 px-3 aria-selected:bg-green-50 transition-colors cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 text-edvios-green',
                            selectedAgent?.id === agent.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-edvios-green flex items-center justify-center text-white text-[10px] font-semibold">
                            {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {agent.firstName} {agent.lastName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {agent.email}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </div>
        </>
      )}
    </>
  );
};
