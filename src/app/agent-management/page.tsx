'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, Clock, RotateCcw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAgents } from './hooks/use-agents';
import { Agent, AgentStatus } from './types/agent.types';
import { approveAgent, deleteAgent } from './api/agent.api';
import { AgentsTable } from './components/AgentsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppToast } from '@/utils/toast-utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { StatsCard } from '@/components/shared/stats-card';

const AgentManagementPage = () => {
  const router = useRouter();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dialog states
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  const { agents, total, loading, error, refetch } = useAgents({
    search: debouncedSearch,
    filter: statusFilter,
    page: currentPage,
    pageSize,
  });

  // Calculate stats
  const stats = useMemo(() => {
    return [
      { label: 'Total Agents', value: total, icon: Users, color: 'bg-edvios-green' },
      { label: 'Pending Review', value: agents.filter(a => a.role === 'PENDING_AGENT').length, icon: Clock, color: 'from-blue-400 to-blue-600' },
    ];
  }, [agents, total]);

  const handleApprove = async (agentId: string) => {
    try {
      setActionLoading(true);
      await approveAgent(agentId);
      AppToast.success('Agent approved successfully');
      refetch();
    } catch {
      AppToast.error('Failed to approve agent');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      setActionLoading(true);
      await deleteAgent(userId);
      AppToast.success('Agent deleted successfully');
      refetch();
    } catch {
      AppToast.error('Failed to delete agent');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewProfile = (agent: Agent) => {
    router.push(`/agent-management/${agent.id}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full space-y-6">
        <Breadcrumb items={[{ label: "Agent Management", active: true }]} />

        {/* Stats - More professional and themed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              loading={loading}
            />
          ))}
        </div>

        {/* Filters - Compact Toolstrip */}
        <div className="flex flex-col lg:flex-row gap-3 pt-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-edvios-green" />
            <Input
              placeholder="Search by agent name, email or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border border-gray-100 bg-white rounded-md focus-visible:ring-1 focus-visible:ring-edvios-green text-sm font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as AgentStatus); setCurrentPage(1); }}>
              <SelectTrigger className="h-10 w-full sm:w-40 border border-gray-100 bg-white rounded-md font-bold text-[10px] uppercase tracking-widest focus:ring-1 focus:ring-edvios-green">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="AGENT">Approved</SelectItem>
                <SelectItem value="PENDING_AGENT">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 gap-2 rounded-md border border-gray-100 bg-gray-50 text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all"
              onClick={resetFilters}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center gap-3 transition-opacity duration-200">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl md:rounded-3xl">
              <div className="w-10 md:w-12 h-10 md:h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin shadow-lg" />
            </div>
          )}
          <AgentsTable
            agents={agents}
            total={total}
            loading={loading}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onViewProfile={handleViewProfile}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentManagementPage;
