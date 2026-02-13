"use client";
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
import { InitialProgramDataResponse, ProgramFilterRequest } from '../dtos/program.dto';
import { RotateCcw, Search } from 'lucide-react';

interface ProgramFiltersProps {
    filters: ProgramFilterRequest;
    initialData: InitialProgramDataResponse | null;
    onFilterChange: (key: keyof ProgramFilterRequest, value: string | undefined) => void;
    onReset: () => void;
}

export const ProgramFiltersSidebar: React.FC<ProgramFiltersProps> = ({
    filters,
    initialData,
    onFilterChange,
    onReset
}) => {

    return (
        <div className="bg-white p-5 rounded-lg  shadow-sm space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-4">Filters</h3>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search programs..."
                        className="pl-9"
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Institution</Label>
                    <Select
                        value={filters.institutionId || ''}
                        onValueChange={(val) => onFilterChange('institutionId', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Institutions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">All Institutions</SelectItem>
                            {initialData?.institutions.map((institution) => (
                                <SelectItem key={institution.id} value={institution.id}>
                                    {institution.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Country</Label>
                    <Select
                        value={filters.country || ''}
                        onValueChange={(val) => onFilterChange('country', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">All Countries</SelectItem>
                            {initialData?.countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                    {country}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Study Level</Label>
                    <Select
                        value={filters.level || ''}
                        onValueChange={(val) => onFilterChange('level', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Levels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">All Levels</SelectItem>
                            {initialData?.levels.map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Intake</Label>
                    <Select
                        value={filters.intakeId || ''}
                        onValueChange={(val) => onFilterChange('intakeId', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any Intake" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Intake</SelectItem>
                            {initialData?.intakes.map((intake) => (
                                <SelectItem key={intake.id} value={intake.id}>
                                    {intake.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Subject Area</Label>
                    <Select
                        value={filters.subjectId || ''}
                        onValueChange={(val) => onFilterChange('subjectId', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">All Subjects</SelectItem>
                            {initialData?.subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Scholarship Available</Label>
                    <Select
                        value={filters.scholarshipAvailable === true ? 'yes' : filters.scholarshipAvailable === false ? 'no' : 'any'}
                        onValueChange={(val) => onFilterChange('scholarshipAvailable', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>English Waiver</Label>
                    <Select
                        value={filters.englishWaiver === true ? 'yes' : filters.englishWaiver === false ? 'no' : 'any'}
                        onValueChange={(val) => onFilterChange('englishWaiver', val === 'any' ? undefined : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button variant="outline" className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-edvios-green" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
                Reset Filters
            </Button>
        </div>
    );
};
