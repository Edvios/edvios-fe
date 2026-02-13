'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { UserCheck, ChevronsUpDown, Check, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgentSelector } from '../hooks/use-agent-selector';
import { useSelectedAgent } from '../hooks/use-selected-agent';
import { Skeleton } from '@/components/ui/skeleton';

export const SelectedAgentCard: React.FC = () => {
  const {
    selectedAgent,
    showAgentList,
    isSubmitting,
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
      <Card className="border-none shadow-md bg-white rounded-3xl">
        <CardContent className="p-6">
            <p className="text-xl font-bold text-gradient mb-4">Default Agent</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
                
              <div className="w-12 h-12 rounded-2xl bg-edvios-green flex items-center justify-center text-white shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : selectedAgent ? (
                  <div className="flex items-center gap-2 mt-1">
                    
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedAgent.firstName} {selectedAgent.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{selectedAgent.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1 text-gray-400">
                    <UserX className="w-5 h-5" />
                    <p className="text-base font-medium">No agent selected</p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <Button
                onClick={() => {
                  handleSetAgentClick();
                  resetSearch();
                }}
                disabled={isSubmitting || isLoading}
                className="bg-edvios-green text-white px-6 py-3 rounded-2xl shadow-md transition-all font-semibold"
                data-agent-selector
              >
                <ChevronsUpDown className="w-4 h-4 mr-2" />
                Set Default Agent
              </Button>

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
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] max-w-[90vw] rounded-xl bg-white shadow-2xl"
                    data-agent-selector
                  >
                    {agentsLoading ? (
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <Command>
                        <CommandInput
                          placeholder="Search agents..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList className="max-h-[300px]">
                          <CommandEmpty>No agents found.</CommandEmpty>
                          <CommandGroup>
                            {filteredAgents.map((agent) => (
                              <CommandItem
                                key={agent.id}
                                value={`${agent.firstName} ${agent.lastName} ${agent.email}`}
                                onSelect={() => handleAgentSelect(agent)}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    selectedAgent?.id === agent.id ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-edvios-green flex items-center justify-center text-white text-xs font-semibold">
                                    {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {agent.firstName} {agent.lastName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
