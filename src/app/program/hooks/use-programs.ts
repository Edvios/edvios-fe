import { useState, useEffect, useCallback } from 'react';
import { ProgramService } from '../services/program.service';
import { InitialProgramDataResponse, FilteredProgramDataResponse, ProgramFilterRequest } from '../dtos/program.dto';

const initialFilters: ProgramFilterRequest = {
    search: '',
    institutionId: '',
    country: '',
    level: '',
    intake: '',
    subjectArea: '',
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
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

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

        // Clear existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new timer for debounced search
        const timer = setTimeout(() => {
            debouncedFetchFilteredPrograms(filters);
        }, 500);

        setDebounceTimer(timer);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [filters, initialData, debouncedFetchFilteredPrograms]);

    const updateFilter = useCallback((key: keyof ProgramFilterRequest, value: string | number | undefined) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Reset to page 1 when filters change (except page and size)
            if (key !== 'page' && key !== 'size') {
                newFilters.page = 1;
            }

            // Convert boolean strings to proper values
            if (key === 'scholarshipAvailable' || key === 'englishWaiver') {
                if (value === 'yes') newFilters[key] = 'yes' as const;
                else if (value === 'no') newFilters[key] = 'no' as const;
                else newFilters[key] = undefined;
            }

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