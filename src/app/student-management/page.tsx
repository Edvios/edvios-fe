'use client';

import { useState, useEffect } from 'react';
import { Search, GraduationCap, XCircle, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStudents } from './hooks/use-students';
import { Student } from './types/student.types';
import { deleteStudent } from './api/student.api';
import { StudentsTable } from './components/StudentsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppToast } from '@/utils/toast-utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { StatsCard } from '@/components/shared/stats-card';

const StudentManagementPage = () => {
  const router = useRouter();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
  const { students, total, loading, error, refetch } = useStudents({
    search: debouncedSearch,
    page: currentPage,
    pageSize,
  });


  const handleViewProfile = (student: Student) => {
    router.push(`/student-management/${student.id}`);
  };

  const handleDeleteStudent = async (userId: string) => {
    try {
      setActionLoading(true);
      await deleteStudent(userId);
      AppToast.success('Student deleted successfully');
      refetch();
    } catch {
      AppToast.error('Failed to delete student');
    } finally {
      setActionLoading(false);
    }
  };


  const resetFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto min-w-[200px]">
            <StatsCard
              label="Total Registered Students"
              value={total}
              icon={GraduationCap}
              loading={loading}
              valueColor="text-edvios-green"
            />
          </div>
          <Breadcrumb items={[{ label: "Student Management", active: true }]} className="mb-0" />
        </div>

        {/* Search & Action Bar - Highly Compact */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-edvios-green" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border border-gray-200 bg-white rounded-md focus-visible:ring-1 focus-visible:ring-edvios-green transition-all text-sm font-medium"
            />
          </div>
          <Button
            variant="outline"
            className="h-10 px-4 gap-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-widest transition-all"
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
        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
              <div className="w-10 h-10 border-4 border-edvios-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <StudentsTable
            students={students}
            total={total}
            loading={loading}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onViewProfile={handleViewProfile}
            onDelete={handleDeleteStudent}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentManagementPage;