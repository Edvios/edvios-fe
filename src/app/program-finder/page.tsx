
"use client";

import React, { useState } from 'react';
import { ProgramFiltersSidebar } from '@/app/program-finder/components/program-filters';
import { ProgramCard } from '@/app/program-finder/components/program-card';
import { ProgramDetailsDialog } from '@/app/program-finder/components/program-details-dialog';
import { ProgramApplyDialog } from '@/app/program-finder/components/program-apply-dialog';
import { ProgramPagination } from '@/app/program-finder/components/program-pagination';
import { Program } from '@/app/program-finder/types/program';
import { ProgramApplicationRequest } from '@/app/program-finder/dtos/program.dto';
import { ProgramService } from '@/app/program-finder/services/program.service';
import { usePrograms } from '@/app/program-finder/hooks/use-programs';
import { SearchX, Loader2 } from 'lucide-react';

export default function ProgramFinderPage() {
    const { initialData, filteredData, filters, loading, updateFilter, resetFilters, changePage } = usePrograms();
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [programToApply, setProgramToApply] = useState<Program | null>(null);

    const handleViewDetails = (program: Program) => {
        setSelectedProgram(program);
        setIsDetailsOpen(true);
    };

    const handleApplyClick = (program: Program) => {
        setIsDetailsOpen(false);
        setProgramToApply(program);
        setIsApplyOpen(true);
    };

    const handleApplySubmit = async (data: ProgramApplicationRequest) => {
        await ProgramService.applyToProgram(data);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <p className="text-3xl font-bold tracking-tight text-edvios-blue">Find Your Program</p>
                    <p className="text-muted-foreground mt-1">Discover universities and courses that match your goals.</p>
                </div>
                {filteredData && (
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-gray-900">{filteredData.programs.length}</span> of{' '}
                        <span className="font-semibold text-gray-900">{filteredData.pagination.total}</span> programs
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-1">
                    <ProgramFiltersSidebar
                        filters={filters}
                        initialData={initialData}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                    />
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Loading programs...</p>
                        </div>
                    ) : filteredData && filteredData.programs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredData.programs.map(program => (
                                    <ProgramCard
                                        key={program.id}
                                        program={program}
                                        onDetailClick={handleViewDetails}
                                        onApplyClick={handleApplyClick}
                                    />
                                ))}
                            </div>
                            <ProgramPagination
                                pagination={filteredData.pagination}
                                onPageChange={changePage}
                            />
                        </>
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
                                onClick={resetFilters}
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
                onApplyClick={handleApplyClick}
            />

            <ProgramApplyDialog
                program={programToApply}
                open={isApplyOpen}
                onOpenChange={setIsApplyOpen}
                onSubmit={handleApplySubmit}
                intakes={initialData?.intakes ?? []}
            />
        </div>
    );
}
