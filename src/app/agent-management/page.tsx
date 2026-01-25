'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShieldCheck, Users, Clock, RotateCcw, XCircle, Filter } from 'lucide-react';
import { useAgents } from './hooks/use-agents';
import { Agent, AgentStatus } from './types/agent.types';
import { approveAgent, deleteAgent } from './api/agent.api';
import { AgentsTable } from './components/AgentsTable';
import { AgentProfileDialog } from './components/AgentProfileDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppToast } from '@/utils/toast-utils';

const AgentManagementPage = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dialog states
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
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

  // Calculate stats - in a real app these might come from a separate endpoint
  const stats = useMemo(() => {
    return [
      { label: 'Total Agents', value: total, icon: Users, color: 'from-orange-500 to-orange-600' },
      { label: 'Pending Review', value: agents.filter(a => a.role === 'PENDING_AGENT').length, icon: Clock, color: 'from-yellow-400 to-yellow-600' },
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

  const handleDelete = async (agentId: string) => {
    try {
      setActionLoading(true);
      await deleteAgent(agentId);
      AppToast.success('Agent deleted successfully');
      refetch();
    } catch {
      AppToast.error('Failed to delete agent');
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Agent <span className="text-orange-600">Portal Control</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Approve, manage, and monitor educational consultants.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-700 uppercase tracking-wider">Admin Verified</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-xl overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                <CardContent className="p-0">
                  <div className={`bg-linear-to-br ${stat.color} p-6 text-white flex items-center justify-between`}>
                    <div>
                      <p className="text-white/80 font-medium mb-1 uppercase tracking-wider text-xs">{stat.label}</p>
                      <p className="text-4xl font-bold">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-visible">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by agent name, email or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-none bg-gray-50/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-orange-500 text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as AgentStatus); setCurrentPage(1); }}>
                  <SelectTrigger className="h-14 w-full sm:w-45 border-none bg-gray-50/50 rounded-2xl font-semibold focus:ring-2 focus:ring-orange-500">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-orange-500" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="AGENT">Approved</SelectItem>
                    <SelectItem value="PENDING_AGENT">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="h-14 px-6 gap-2 rounded-2xl border-none bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all font-bold"
                  onClick={resetFilters}
                >
                  <RotateCcw className="w-5 h-5" /> Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg" />
            </div>
          )}
          <AgentsTable
            agents={agents}
            total={total}
            loading={loading}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onViewProfile={(agent) => { setSelectedAgent(agent); setProfileDialogOpen(true); }}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        </div>

        {/* Dialog */}
        <AgentProfileDialog
          agent={selectedAgent}
          open={profileDialogOpen}
          onClose={() => { setProfileDialogOpen(false); setSelectedAgent(null); }}
          onApprove={handleApprove}
        />
      </div>
    </div>
  );
};

export default AgentManagementPage;