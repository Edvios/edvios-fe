'use client';

import { useState, useEffect } from 'react';
import { Search, XCircle, RotateCcw } from 'lucide-react';
import { useAssignments } from './hooks/use-assignments';
import { AssignmentsTable } from './components/AssignmentsTable';
import { SelectedAgentCard } from './components/SelectedAgentCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';

const AgentAssignmentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  const { assignments, total, loading, error, refetch } = useAssignments({
    search: debouncedSearch,
    page: currentPage,
    pageSize,
  });


  const resetFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Breadcrumb items={[{ label: "Agent Assignment", active: true }]} />
          <div className="w-full md:w-auto">
            <SelectedAgentCard />
          </div>
        </div>

        {/* Search Bar - Compact toolstrip look */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-green-500" />
            <Input
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border border-gray-100 bg-white rounded-md focus-visible:ring-1 focus-visible:ring-green-500 text-sm"
            />
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto h-10 px-4 gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold text-xs uppercase transition-all"
            onClick={resetFilters}
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center gap-3 transition-opacity duration-200">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Table */}
        <AssignmentsTable
          assignments={assignments}
          total={total}
          loading={loading}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onRefresh={refetch}
        />
      </div>
    </div>
  );
};

export default AgentAssignmentPage;
