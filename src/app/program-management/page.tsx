"use client";

import { useState, useEffect, startTransition } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import ProgramCard from './components/program-card';
import CreateProgramForm from './components/CreateProgramForm';
import { usePrograms } from './hooks/use-programs';
import type { Institution, Intake, Subject, Program } from './types';
import { StudyLevel, Country, ProgramStatus } from './enums';
import { LogoLoading } from '@/components/ui/logo-loading';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProgramManagementPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedIntake, setSelectedIntake] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedScholarship, setSelectedScholarship] = useState<string>('');
  const [selectedEnglishWaiver, setSelectedEnglishWaiver] = useState<string>('');

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Lists for dropdowns
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const {
    programs,
    totalPages,
    loading,
    page,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    updateFilters,
    clearFilters,
    createProgram,
    updateProgram,
    deleteProgram,
    loadInitialData,
    initialData,
  } = usePrograms({ page: 0, size: 12 });

  // Load initial data (institutions, intakes, subjects)
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Parse initial data
  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      const data = initialData as Record<string, unknown>;

      // Batch state updates to avoid cascading renders
      const updates: {
        institutes?: Institution[];
        intakes?: Intake[];
        subjects?: Subject[];
      } = {};

      if (data.institutes && Array.isArray(data.institutes)) {
        updates.institutes = data.institutes;
      }

      if (data.intakes && Array.isArray(data.intakes)) {
        updates.intakes = data.intakes;
      }

      if (data.subjects && Array.isArray(data.subjects)) {
        updates.subjects = data.subjects;
      }

      // Batch state updates to prevent cascading renders
      startTransition(() => {
        if (updates.institutes) setInstitutions(updates.institutes);
        if (updates.intakes) setIntakes(updates.intakes);
        if (updates.subjects) setSubjects(updates.subjects);
      });
    }
  }, [initialData]);

  // Update filters when debounced search changes
  useEffect(() => {
    const filters: Record<string, unknown> = {};

    if (debouncedSearch) filters.search = debouncedSearch;
    if (selectedInstitutionId) filters.institutionId = selectedInstitutionId;
    if (selectedCountry) filters.country = selectedCountry;
    if (selectedLevel) filters.level = selectedLevel;
    if (selectedIntake) filters.intake = selectedIntake;
    if (selectedSubject) filters.subjectArea = selectedSubject;
    if (selectedScholarship && selectedScholarship !== 'any') {
      filters.scholarshipAvailable = selectedScholarship === 'true';
    }
    if (selectedEnglishWaiver && selectedEnglishWaiver !== 'any') {
      filters.englishWaiver = selectedEnglishWaiver === 'true';
    }

    updateFilters(filters);
  }, [
    debouncedSearch,
    selectedInstitutionId,
    selectedCountry,
    selectedLevel,
    selectedIntake,
    selectedSubject,
    selectedScholarship,
    selectedEnglishWaiver,
    updateFilters,
  ]);

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedInstitutionId('');
    setSelectedCountry('');
    setSelectedLevel('');
    setSelectedIntake('');
    setSelectedSubject('');
    setSelectedScholarship('');
    setSelectedEnglishWaiver('');
    clearFilters();
  };

  const hasActiveFilters = Boolean(
    searchInput ||
    selectedInstitutionId ||
    selectedCountry ||
    selectedLevel ||
    selectedIntake ||
    selectedSubject ||
    (selectedScholarship && selectedScholarship !== 'any') ||
    (selectedEnglishWaiver && selectedEnglishWaiver !== 'any')
  );

  const handleDelete = async (id: string) => {
    await deleteProgram(id);
  };

  const handleAddNew = () => {
    setEditingProgram(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (formData: {
    id?: string;
    title: string;
    level: string;
    intakeId: string;
    duration: string;
    tuitionFee: string;
    applicationFee: string;
    englishTestScore: string;
    subjectId: string;
    scholarship: boolean;
    applicationDeadline: string;
    ucasCode: string;
    englishWaiver: boolean;
    popularityRank: number;
    institutionId: string;
    status: string;
  }) => {
    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, formData);
      } else {
        await createProgram(formData);
      }
      setIsDialogOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumb items={[{ label: "Program Management", active: true }]} className="mb-0" />
          <Button
            onClick={handleAddNew}
            className="bg-edvios-green hover:bg-edvios-green/90 text-white font-bold text-xs uppercase tracking-widest h-10 px-6 rounded-md shadow-none"
          >
            <Plus size={16} className="mr-2" />
            Add New Program
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 pt-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-edvios-green" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-10 h-10 border border-gray-100 bg-white rounded-md focus-visible:ring-1 focus-visible:ring-edvios-green text-sm font-medium outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Select value={selectedInstitutionId} onValueChange={setSelectedInstitutionId}>
            <SelectTrigger className="w-[140px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="Institutions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutions</SelectItem>
              {institutions.map(inst => (
                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[120px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {Object.values(Country).map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[120px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {Object.entries(StudyLevel).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedIntake} onValueChange={setSelectedIntake}>
            <SelectTrigger className="w-[120px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="Intakes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intakes</SelectItem>
              {intakes.map(intake => (
                <SelectItem key={intake.id} value={intake.id}>{intake.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[120px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedScholarship} onValueChange={setSelectedScholarship}>
            <SelectTrigger className="w-[120px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="Scholarship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Scholarship</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Not Available</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedEnglishWaiver} onValueChange={setSelectedEnglishWaiver}>
            <SelectTrigger className="w-[130px] h-9 text-[10px] uppercase font-bold tracking-wider">
              <SelectValue placeholder="English Waiver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Waiver</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Not Available</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="h-9 px-3 gap-2 rounded-md border border-gray-100 bg-gray-50 text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          )}
        </div>
        {/* Main content */}
        <section className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <LogoLoading size="sm" />
            </div>
          )}

          {programs.length === 0 && !loading ? (
            <div className="text-center py-16 text-gray-500">
              No programs found. Try adjusting your filters.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {programs.map(program => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Pagination - Round buttons */}
        {!loading && programs.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between py-6 border-t border-gray-50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Page {page + 1} <span className="mx-1">/</span> {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full border-gray-100 hover:border-edvios-green hover:text-edvios-green transition-all"
                onClick={previousPage}
                disabled={!hasPreviousPage}
              >
                <span className="text-xs">{"<"}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full border-gray-100 hover:border-edvios-green hover:text-edvios-green transition-all"
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                <span className="text-xs">{">"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Create/Edit Program Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </DialogTitle>
            </DialogHeader>
            <CreateProgramForm
              isEdit={!!editingProgram}
              initialData={editingProgram ? {
                id: editingProgram.id,
                title: editingProgram.title,
                institutionId: editingProgram.institution?.id || editingProgram.institutionId || '',
                university: editingProgram.institution?.name || editingProgram.university || '',
                location: editingProgram.institution?.country || editingProgram.location || '',
                tuition: editingProgram.tuition || editingProgram.tuitionFee || '',
                applicationFee: editingProgram.applicationFee || '',
                duration: editingProgram.duration || '',
                intakeId: typeof editingProgram.intake === 'string' ? '' : (editingProgram.intake?.id || editingProgram.intakeId || ''),
                intake: typeof editingProgram.intake === 'string' ? editingProgram.intake : (editingProgram.intake?.name || ''),
                level: editingProgram.level as StudyLevel | undefined,
                englishTestScore: editingProgram.englishTestScore || '',
                scholarship: editingProgram.scholarshipAvailable || editingProgram.scholarship || false,
                applicationDeadline: editingProgram.applicationDeadline ?
                  new Date(editingProgram.applicationDeadline).toISOString().slice(0, 16) : '',
                subjectId: editingProgram.subject?.id || editingProgram.subjectId || '',
                subjectName: editingProgram.subject?.name || editingProgram.subjectName || '',
                ucasCode: editingProgram.ucasCode || '',
                popularityRank: editingProgram.popularityRank || 0,
                englishWaiver: editingProgram.englishWaiver || false,
                status: editingProgram.status as ProgramStatus | undefined,
              } : undefined}
              institutions={institutions}
              locations={Object.values(Country)}
              intakes={intakes}
              subjectsList={subjects}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
