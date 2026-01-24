import { useState, useEffect, useCallback, useRef } from 'react';
import { ProgramService } from '../services/program.service';
import { InitialProgramDataResponse, FilteredProgramDataResponse, ProgramFilterRequest } from '../dtos/program.dto';


const initialFilters: ProgramFilterRequest = {
    search: undefined,
    institutionId: undefined,
    country: undefined,
    level: undefined,
    intakeId: undefined,
    subjectId: undefined,
    scholarshipAvailable: undefined,
    englishWaiver: undefined,
    page: 1,
    size: 12,
};

export const usePrograms = () => {
    const [initialData, setInitialData] = useState<InitialProgramDataResponse | null>(null);
    const [filteredData, setFilteredData] = useState<FilteredProgramDataResponse | null>(null);
    const [filters, setFilters] = useState<ProgramFilterRequest>(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);


    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const data = await ProgramService.fetchInitialData();
                setInitialData(data);
                setFilteredData({ programs: data.programs, pagination: data.pagination });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load programs');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Debounced search and filter function
    const debouncedFetchFilteredPrograms = useCallback(async (currentFilters: ProgramFilterRequest) => {
        try {
            setLoading(true);
            const data = await ProgramService.fetchFilteredPrograms(currentFilters);
            setFilteredData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to filter programs');
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to handle filter changes with debouncing
    useEffect(() => {
        if (!initialData) return;

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        console.log('Filters changed:', filters);

        debounceTimer.current = setTimeout(() => {
            console.log('Fetching filtered programs with filters:', filters);
            debouncedFetchFilteredPrograms(filters);
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [filters, initialData, debouncedFetchFilteredPrograms]);




    const updateFilter = useCallback((key: keyof ProgramFilterRequest, value: string | number | undefined) => {
        console.log(`Updating filter: ${key} = ${value}`);
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Reset to page 1 when filters change (except page and size)
            if (key !== 'page' && key !== 'size') {
                newFilters.page = 1;
            }

            // Convert boolean filter values
            if (key === 'scholarshipAvailable' || key === 'englishWaiver') {
                if (value === 'yes') newFilters[key] = true;
                else if (value === 'no') newFilters[key] = false;
                else newFilters[key] = undefined;
            }

            // Convert empty strings to undefined for other filters
            if (typeof value === 'string' && value === '') {
                newFilters[key] = undefined;
            }

            console.log('New filters state:', newFilters);
            return newFilters;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const changePage = useCallback((page: number) => {
        updateFilter('page', page);
    }, [updateFilter]);

    return {
        initialData,
        filteredData,
        filters,
        loading,
        error,
        updateFilter,
        resetFilters,
        changePage,
    };
};