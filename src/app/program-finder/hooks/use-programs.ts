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


    const lastAppliedFiltersRef = useRef<string>(JSON.stringify(initialFilters));


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

    useEffect(() => {
        if (!initialData) return;

        const currentFiltersStr = JSON.stringify(filters);
        if (currentFiltersStr === lastAppliedFiltersRef.current) {
            return;
        }

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }



        debounceTimer.current = setTimeout(() => {

            lastAppliedFiltersRef.current = currentFiltersStr;
            debouncedFetchFilteredPrograms(filters);
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [filters, initialData, debouncedFetchFilteredPrograms]);




    const updateFilter = useCallback((key: keyof ProgramFilterRequest, value: string | number | undefined) => {

        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            if (key !== 'page' && key !== 'size') {
                newFilters.page = 1;
            }

            if (key === 'scholarshipAvailable' || key === 'englishWaiver') {
                if (value === 'yes') newFilters[key] = true;
                else if (value === 'no') newFilters[key] = false;
                else newFilters[key] = undefined;
            }

            if (typeof value === 'string' && value === '') {
                newFilters[key] = undefined;
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