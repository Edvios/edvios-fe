'use client';

import { useState, useEffect } from 'react';
import { Search, XCircle, RotateCcw } from 'lucide-react';
import { useAssignments } from './hooks/use-assignments';
import { AssignmentsTable } from './components/AssignmentsTable';
import { SelectedAgentCard } from './components/SelectedAgentCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCFB] via-white to-green-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div className="font-heading">
            <h2 className="text-3xl sm:text-4xl font-bold text-edvios-blue">Agent Assignment</h2>
            <p className="mt-1 text-gray-600">Assign students to recruitment agents</p>
          </div>
        </div>

        {/* Selected Agent Card */}
        <SelectedAgentCard />

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-green-500" />
            <Input
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-none shadow-md bg-white rounded-2xl focus-visible:ring-2 focus-visible:ring-green-500 text-sm"
            />
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto h-11 px-6 gap-2 rounded-2xl border-none shadow-md bg-white hover:bg-green-50 hover:text-green-600 transition-all font-semibold text-sm"
            onClick={resetFilters}
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
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
