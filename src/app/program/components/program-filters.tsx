import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProgramFilters } from '@/app/program/types/program';
import { RotateCcw, Search } from 'lucide-react';

interface ProgramFiltersProps {
    filters: ProgramFilters;
    onFilterChange: (key: keyof ProgramFilters, value: string) => void;
    onReset: () => void;
}

export const ProgramFiltersSidebar: React.FC<ProgramFiltersProps> = ({ filters, onFilterChange, onReset }) => {
    return (
        <div className="bg-white p-5 rounded-lg border shadow-sm space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-4">Filters</h3>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search programs..."
                        className="pl-9"
                        value={filters.searchTerm}
                        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {/* Subject */}
                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                        value={filters.subject}
                        onValueChange={(val) => onFilterChange('subject', val === 'all' ? '' : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Data Science">Data Science</SelectItem>
                            <SelectItem value="Health Science">Health Science</SelectItem>
                            <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                            <SelectItem value="Law">Law</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Study Level */}
                <div className="space-y-2">
                    <Label>Study Level</Label>
                    <Select
                        value={filters.studyLevel}
                        onValueChange={(val) => onFilterChange('studyLevel', val === 'all' ? '' : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Levels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Bachelor's Degree">Bachelor Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master Degree</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Institution */}
                <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                        placeholder="e.g. Oxford"
                        value={filters.institution}
                        onChange={(e) => onFilterChange('institution', e.target.value)}
                    />
                </div>

                {/* Intake */}
                <div className="space-y-2">
                    <Label>Intake</Label>
                    <Select
                        value={filters.intake}
                        onValueChange={(val) => onFilterChange('intake', val === 'all' ? '' : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any Intake" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Intake</SelectItem>
                            <SelectItem value="September 2025">September 2025</SelectItem>
                            <SelectItem value="January 2026">January 2026</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tuition Fee Max */}
                <div className="space-y-2">
                    <Label>Max Tuition Fee</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 30000"
                        value={filters.tuitionFeeMax}
                        onChange={(e) => onFilterChange('tuitionFeeMax', e.target.value)}
                    />
                </div>

                {/* Scholarship */}
                <div className="space-y-2">
                    <Label>Scholarship Available</Label>
                    <Select
                        value={filters.scholarship}
                        onValueChange={(val) => onFilterChange('scholarship', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* English Waiver */}
                <div className="space-y-2">
                    <Label>English Waiver</Label>
                    <Select
                        value={filters.englishWaiver}
                        onValueChange={(val) => onFilterChange('englishWaiver', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            <Button variant="outline" className="w-full  text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-orange-gradient" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
                Reset Filters
            </Button>
        </div>
    );
};
