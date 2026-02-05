import { useState, useEffect, useCallback } from 'react';
import { programApi } from '../api/program.api';
import type { Program } from '../types';
import type { ProgramsResopnseDto } from '../dtos/program.dto';
import { AppToast } from '@/utils/toast-utils';

export interface ProgramFilters {
  search?: string;
  institutionId?: string;
  subjectId?: string;
  intakeId?: string;
  level?: string;
  country?: string;
  status?: string;
  availability?: string;
  page?: number;
  size?: number;
}

export function usePrograms(initialFilters: ProgramFilters = {}) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(initialFilters.page ?? 0);
  const [size, setSize] = useState<number>(initialFilters.size ?? 10);

  const [filters, setFilters] = useState<Record<string, unknown>>(() => {
    const { page: _, size: __, ...rest } = initialFilters;
    return rest;
  });

  const [initialData, setInitialData] = useState<unknown>(null);
  const [initialDataLoading, setInitialDataLoading] = useState<boolean>(false);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ProgramsResopnseDto = await programApi.fetchPrograms(filters, { page, size });
      
      setPrograms((response.data ?? []) as unknown as Program[]);
      setTotal(response.total ?? 0);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
      setPrograms([]);
      setTotal(0);
      const errorMessage = 'Failed to load programs. Please try again.';
      setError(errorMessage);
      AppToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, page, size]);

  const loadInitialData = useCallback(async () => {
    setInitialDataLoading(true);
    try {
      const data = await programApi.fetchInitialData();
      setInitialData(data);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      AppToast.error('Failed to load filter options');
    } finally {
      setInitialDataLoading(false);
    }
  }, []);

  const createProgram = useCallback(async (data: Record<string, unknown>) => {
    try {
      const newProgram = await programApi.createProgram(data);
      
      setPrograms(prev => [newProgram, ...prev]);
      setTotal(prev => prev + 1);
      
      AppToast.success('Program created successfully');
      return newProgram;
    } catch (err) {
      console.error('Failed to create program:', err);
      AppToast.error('Failed to create program');
      throw err;
    }
  }, []);

  const updateProgram = useCallback(async (id: string, data: Record<string, unknown>) => {
    try {
      const updatedProgram = await programApi.updateProgram(id, data);
      
      setPrograms(prev => 
        prev.map(program => program.id === id ? { ...program, ...updatedProgram } : program)
      );
      
      AppToast.success('Program updated successfully');
      return updatedProgram;
    } catch (err) {
      console.error('Failed to update program:', err);
      AppToast.error('Failed to update program');
      throw err;
    }
  }, []);

  const deleteProgram = useCallback(async (id: string) => {
    try {
      await programApi.deleteProgram(id);
      
      // Remove from local state
      setPrograms(prev => prev.filter(program => program.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
      
      AppToast.success('Program deleted successfully');
    } catch (err) {
      console.error('Failed to delete program:', err);
      AppToast.error('Failed to delete program');
      throw err;
    }
  }, []);

  // Refetch programs
  const refetch = useCallback(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<Record<string, unknown>>) => {
    setFilters(newFilters); // Replace filters entirely instead of merging
    setPage(0); // Reset to first page when filters change
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(0);
  }, []);

  // Pagination controls
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if ((page + 1) * size < total) {
      setPage(prev => prev + 1);
    }
  }, [page, size, total]);

  const previousPage = useCallback(() => {
    if (page > 0) {
      setPage(prev => Math.max(0, prev - 1));
    }
  }, [page]);

  const changePageSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when size changes
  }, []);

  // Load programs when dependencies change
  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Computed values
  const totalPages = Math.ceil(total / size);
  const hasNextPage = (page + 1) * size < total;
  const hasPreviousPage = page > 0;

  return {
    programs,
    total,
    totalPages,
    loading,
    error,
    page,
    size,
    hasNextPage,
    hasPreviousPage,
    filters,
    initialData,
    initialDataLoading,
    refetch,
    updateFilters,
    clearFilters,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    createProgram,
    updateProgram,
    deleteProgram,
    loadInitialData,
  };
}
