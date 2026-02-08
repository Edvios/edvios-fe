'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, UserCheck, XCircle, RotateCcw } from 'lucide-react';
import { useAssignments } from './hooks/use-assignments';
import { AssignmentsTable } from './components/AssignmentsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Agent <span className="text-green-600">Assignment</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base md:text-lg">
              Manage and assign agents to students
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-500" />
            <Input
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-none shadow-md bg-white rounded-2xl focus-visible:ring-2 focus-visible:ring-green-500 text-base md:text-lg"
            />
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto h-14 px-8 gap-2 rounded-2xl border-none shadow-md bg-white hover:bg-green-50 hover:text-green-600 transition-all font-semibold"
            onClick={resetFilters}
          >
            <RotateCcw className="w-5 h-5" /> Reset
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
