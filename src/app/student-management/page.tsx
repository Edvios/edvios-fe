'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, GraduationCap, XCircle, RotateCcw } from 'lucide-react';
import { useStudents } from './hooks/use-students';
import { Student } from './types/student.types';
import { deleteStudent, getStudent } from './api/student.api';
import { StudentsTable } from './components/StudentsTable';
import { StudentProfileDialog } from './components/StudentProfileDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppToast } from '@/utils/toast-utils';

const StudentManagementPage = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dialog states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
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
  const { students, total, loading, error, refetch } = useStudents({
    search: debouncedSearch,
    page: currentPage,
    pageSize,
  });

  // Calculate stats
  const stats = useMemo(() => {
    return [
      { label: 'Total Students', value: total, icon: GraduationCap, color: 'from-green-500 to-green-600' },
    ];
  }, [total]);

  const handleViewProfile = async (student: Student) => {
    try {
      setActionLoading(true);
      const fullStudent = await getStudent(student.id);
      setSelectedStudent(fullStudent);
      setProfileDialogOpen(true);
    } catch {
      AppToast.error(
        'Student not registered successfully, Student data may be incomplete.'
      );
      setSelectedStudent(student);
      setProfileDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Student <span className="text-green-600">Management</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base md:text-lg">Manage and review international student applications and profiles.</p>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${stat.color} p-4 md:p-6 text-white flex items-center justify-between`}>
                    <div>
                      <p className="text-green-100 font-medium mb-1 opacity-90 text-sm md:text-base">{stat.label}</p>
                      <p className="text-3xl md:text-4xl font-bold">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-green-500" />
            <Input
              placeholder="Search by name, email or ID..."
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

        {/* Profile Dialog */}
        <StudentProfileDialog
          student={selectedStudent}
          open={profileDialogOpen}
          onClose={() => { setProfileDialogOpen(false); setSelectedStudent(null); }}
        />
      </div>
    </div>
  );
};

export default StudentManagementPage;