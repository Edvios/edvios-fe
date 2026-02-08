"use client";

import { useState, useEffect, startTransition } from 'react';
import { Search, Loader2, X, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import ProgramCard from './components/program-card';
import CreateProgramForm from './components/CreateProgramForm';
import { usePrograms } from './hooks/use-programs';
import type { Institution, Intake, Subject, Program } from './types';
import { StudyLevel, Country, ProgramStatus } from './enums';

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
    total,
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
    <div className="min-h-screen bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
            <p className="text-gray-600 mt-1">Manage university degree programs and offerings</p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-gradient hover:from-orange-600 hover:to-green-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            Add New Program
          </Button>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full max-w-3xl pl-12 pr-4 h-12 rounded-md bg-white text-gray-900 border border-gray-200"
            />
            {searchInput && (
              <X
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                size={18}
                onClick={() => setSearchInput('')}
              />
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedInstitutionId}
              onChange={e => setSelectedInstitutionId(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[200px]"
            >
              <option value="">All Institutions</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[150px]"
            >
              <option value="">All Countries</option>
              {Object.values(Country).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[150px]"
            >
              <option value="">All Levels</option>
              {Object.entries(StudyLevel).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            <select
              value={selectedIntake}
              onChange={e => setSelectedIntake(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[150px]"
            >
              <option value="">All Intakes</option>
              {intakes.map(intake => (
                <option key={intake.id} value={intake.id}>{intake.name}</option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[150px]"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>

            <select
              value={selectedScholarship}
              onChange={e => setSelectedScholarship(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[150px]"
            >
              <option value="">Scholarship: Any</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>

            <select
              value={selectedEnglishWaiver}
              onChange={e => setSelectedEnglishWaiver(e.target.value)}
              className="h-10 px-4 rounded-md bg-white text-sm border border-gray-200 min-w-[150px]"
            >
              <option value="">English Waiver: Any</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="h-10"
              >
                <X size={16} />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Main content */}
        <section className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Loading programs...</p>
              </div>
            </div>
          )}
          
          {programs.length === 0 && !loading ? (
            <div className="text-center py-16 text-gray-500">
              No programs found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Pagination */}
        {!loading && programs.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={previousPage}
              disabled={!hasPreviousPage}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages} ({total} total)
            </span>
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={!hasNextPage}
            >
              Next
            </Button>
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
