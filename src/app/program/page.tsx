"use client";

import React, { useState, useMemo } from 'react';
import { ProgramFiltersSidebar } from '@/app/program/components/program-filters';
import { ProgramCard } from '@/app/program/components/program-card';
import { ProgramDetailsDialog } from '@/app/program/components/program-details-dialog';
import { Program, ProgramFilters } from '@/app/program/types/program';
import { mockPrograms } from '@/data/mock-programs';
import { SearchX } from 'lucide-react';

const initialFilters: ProgramFilters = {
    institution: "",
    studyLevel: "",
    subject: "",
    scholarship: "all",
    intake: "",
    tuitionFeeMin: "",
    tuitionFeeMax: "",
    englishWaiver: "all",
    searchTerm: ""
};

export default function ProgramFinderPage() {
    const [filters, setFilters] = useState<ProgramFilters>(initialFilters);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleFilterChange = (key: keyof ProgramFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setFilters(initialFilters);
    };

    const handleViewDetails = (program: Program) => {
        setSelectedProgram(program);
        setIsDetailsOpen(true);
    };

    const filteredPrograms = useMemo(() => {
        return mockPrograms.filter(program => {
            // Search Term (matches Title or Subject)
            if (filters.searchTerm && !program.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && !program.subject.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
                return false;
            }

            // Institution
            if (filters.institution && !program.institution.toLowerCase().includes(filters.institution.toLowerCase())) {
                return false;
            }

            // Subject
            if (filters.subject && !program.subject.toLowerCase().includes(filters.subject.toLowerCase())) {
                return false;
            }

            // Study Level
            if (filters.studyLevel && program.level !== filters.studyLevel) {
                return false;
            }

            // Intake
            if (filters.intake && program.intake !== filters.intake) {
                return false;
            }

            // Scholarship
            if (filters.scholarship !== 'all') {
                const wantsScholarship = filters.scholarship === 'yes';
                if (program.scholarship !== wantsScholarship) return false;
            }

            // English Waiver
            if (filters.englishWaiver !== 'all') {
                const wantsWaiver = filters.englishWaiver === 'yes';
                // englishWaiver is optional in Program, treat undefined as false/no
                const hasWaiver = !!program.englishWaiver;
                if (hasWaiver !== wantsWaiver) return false;
            }

            // Tuition Fee Max (basic parsing for mock data which has currency symbols)
            if (filters.tuitionFeeMax) {
                const maxFee = parseInt(filters.tuitionFeeMax);
                // Remove non-numeric chars except .
                const programFeeStr = program.tuitionFee.replace(/[^0-9.]/g, '');
                const programFee = parseInt(programFeeStr);

                if (!isNaN(maxFee) && !isNaN(programFee) && programFee > maxFee) {
                    return false;
                }
            }

            return true;
        });
    }, [filters]);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Find Your Program</h1>
                    <p className="text-muted-foreground mt-1">Discover universities and courses that match your goals.</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-gray-900">{filteredPrograms.length}</span> programs
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-1">
                    <ProgramFiltersSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                    />
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {filteredPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredPrograms.map(program => (
                                <ProgramCard
                                    key={program.id}
                                    program={program}
                                    onDetailClick={handleViewDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-dashed">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <SearchX className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No programs found</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                We could not find any programs matching your filters. Try adjusting your search criteria or clearing some filters.
                            </p>
                            <button
                                onClick={handleReset}
                                className="mt-6 text-primary hover:underline font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <ProgramDetailsDialog
                program={selectedProgram}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </div>
    );
}
