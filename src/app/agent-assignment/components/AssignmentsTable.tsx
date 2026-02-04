'use client';

import React, { useState, useEffect } from 'react';
import { StudentAssignment } from '../types/assignment.types';
import { Agent } from '@/app/agent-management/types/agent.types';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Mail, Phone, Check, ChevronsUpDown, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgentSelector } from '../hooks/use-agent-selector';
import { ConfirmAssignmentDialog } from './ConfirmAssignmentDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface AssignmentsTableProps {
  assignments: StudentAssignment[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  total,
  loading,
  page,
  pageSize,
  onPageChange,
  onRefresh,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);
  const [showAgentList, setShowAgentList] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    agents,
    loading: agentsLoading,
    submitting,
    searchQuery,
    filteredAgents,
    setSearchQuery,
    loadAgents,
    updateAgentAssignment,
    resetSearch,
  } = useAgentSelector(() => {
    setShowConfirmDialog(false);
    setShowAgentList(null);
    setSelectedAssignment(null);
    onRefresh();
  });

  useEffect(() => {
    if (showAgentList) {
      loadAgents();
    }
  }, [showAgentList, loadAgents]);

  const handleAgentClick = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setShowAgentList(assignment.id);
    resetSearch();
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgentId(agentId);
    setShowAgentList(null);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedAssignment || !selectedAgentId) return;
    await updateAgentAssignment(selectedAssignment.studentId, selectedAgentId);
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const columns = [
    {
      header: 'Student',
      Cell: ({ row }: { row: StudentAssignment }) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient flex items-center justify-center text-white font-bold text-lg shadow-md">
            {(row.student.firstName?.[0] || '') + (row.student.lastName?.[0] || '')}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">
              {row.student.firstName} {row.student.lastName}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              {row.student.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      Cell: ({ row }: { row: StudentAssignment }) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gradient" />
          {row.student.phone || 'N/A'}
        </div>
      ),
    },
    {
      header: 'Assigned Agent',
      Cell: ({ row }: { row: StudentAssignment }) => (
        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              'w-full max-w-[280px] justify-between hover:bg-muted',
              !row.agent && 'text-muted-foreground'
            )}
            onClick={() => handleAgentClick(row)}
          >
            {row.agent ? (
              <span className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-full bg-gradient flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {row.agent.firstName[0]}{row.agent.lastName[0]}
                </div>
                <span className="truncate">
                  {row.agent.firstName} {row.agent.lastName}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserX className="w-4 h-4" />
                Not Assigned
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

          {showAgentList === row.id && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-w-[280px] rounded-md border bg-popover shadow-md">
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
                  <CommandList>
                    <CommandEmpty>No agents found.</CommandEmpty>
                    <CommandGroup>
                      {filteredAgents.map((agent) => (
                        <CommandItem
                          key={agent.id}
                          value={agent.id}
                          onSelect={() => handleAgentSelect(agent.id)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              row.agent?.id === agent.id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient flex items-center justify-center text-white text-xs font-semibold">
                              {agent.firstName[0]}{agent.lastName[0]}
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
          )}
        </div>
      ),
    },
    {
      header: 'Last Updated',
      Cell: ({ row }: { row: StudentAssignment }) => (
        <div className="text-sm text-gray-500">
          {row.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
        <Table
          data={assignments}
          columns={columns}
          loading={loading}
          pagination={{
            currentPage: page,
            totalItems: total,
            pageSize: pageSize,
            onPageChange: onPageChange,
          }}
        />
      </div>

      <ConfirmAssignmentDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        studentName={
          selectedAssignment
            ? `${selectedAssignment.student.firstName} ${selectedAssignment.student.lastName}`
            : ''
        }
        currentAgentName={
          selectedAssignment?.agent
            ? `${selectedAssignment.agent.firstName} ${selectedAssignment.agent.lastName}`
            : undefined
        }
        newAgentName={selectedAgent ? `${selectedAgent.firstName} ${selectedAgent.lastName}` : ''}
        onConfirm={handleConfirm}
        loading={submitting}
      />
    </>
  );
};
