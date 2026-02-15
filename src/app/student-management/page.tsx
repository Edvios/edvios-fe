'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, GraduationCap, XCircle, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStudents } from './hooks/use-students';
import { Student } from './types/student.types';
import { deleteStudent } from './api/student.api';
import { StudentsTable } from './components/StudentsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppToast } from '@/utils/toast-utils';

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

  // Calculate stats
  const stats = useMemo(() => {
    return [
      { label: 'Total Students', value: total, icon: GraduationCap, color: 'bg-edvios-green' },
    ];
  }, [total]);

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
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-edvios-blue">
              Student Management
            </h1>
            <p className="text-gray-500 text-sm md:text-lg font-medium max-w-2xl">
              Efficiently track and manage international student applications, academic records, and documentation.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-0">
                  <div className={`bg-white p-6 flex items-center justify-between border-l-4 ${index === 0 ? 'border-edvios-green' : 'border-edvios-blue'}`}>
                    <div>
                      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-gray-900">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-edvios-green/20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-edvios-green" />
            <Input
              placeholder="Search by name, email, or student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-none shadow-lg bg-white rounded-2xl focus-visible:ring-2 focus-visible:ring-edvios-green transition-all text-sm md:text-base font-medium"
            />
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 gap-2 rounded-2xl border-2 border-gray-100 bg-white hover:bg-edvios-green hover:text-white hover:border-edvios-green transition-all font-bold shadow-md"
            onClick={resetFilters}
          >
            <RotateCcw className="w-5 h-5" /> Reset Filters
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
        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
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