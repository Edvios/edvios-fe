
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
import { Breadcrumb } from '@/components/ui/breadcrumb';

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
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                    <Breadcrumb items={[{ label: "Program Finder", active: true }]} className="mb-0" />
                    {filteredData && (
                        <div className="flex items-center gap-2 bg-edvios-green/10 px-3 py-1.5 rounded-full border border-edvios-green/20">
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Found:</span>
                            <span className="text-sm font-black text-edvios-green">{filteredData.pagination.total}</span>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <ProgramFiltersSidebar
                        filters={filters}
                        initialData={initialData}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                    />
                </div>

                <main>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Loading programs...</p>
                        </div>
                    ) : filteredData && filteredData.programs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
    );
}
