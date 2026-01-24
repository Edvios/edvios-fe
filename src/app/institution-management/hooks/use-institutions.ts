// app/institutions/hooks.ts

import { useState, useEffect, useMemo, useCallback } from 'react'
import { institutionApi } from '@/app/institution-management/api/institution-managemet.api'
import type { 
  Institution, 
  InstitutionFilters, 
  InstitutionMetrics,
  PaginationWithFilterParams 
} from '@/app/institution-management/types/institute-managemet.types'
import type { TabType } from '@/app/institution-management/enums/institute-managemet.enum'

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [paginationWithFilters, setPaginationWithFilters] = useState<PaginationWithFilterParams>({
    page: 1,
    size: 12,
  })
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Tab management
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW' as TabType)

  // Fetch institutions when pagination or filters change
  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Only include non-empty filter values
        const params: PaginationWithFilterParams = {
          page: paginationWithFilters.page,
          size: paginationWithFilters.size,
        }

        if (paginationWithFilters.country) params.country = paginationWithFilters.country
        if (paginationWithFilters.name) params.name = paginationWithFilters.name
        if (paginationWithFilters.status) params.status = paginationWithFilters.status
        if (paginationWithFilters.type) params.type = paginationWithFilters.type

        const response = await institutionApi.getAll(params)
        
        setInstitutions(response.data)
        setTotalItems(response.total)
        setTotalPages(response.totalPages)
        setIsLoading(false)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch institutions')
        setIsLoading(false)
      }
    }

    loadInstitutions()
  }, [paginationWithFilters])

  // Manual fetch function for refreshing data
  const fetchInstitutions = useCallback(async (resetPage: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const pageToFetch = resetPage ? 1 : paginationWithFilters.page;
      
      // Only include non-empty filter values
      const params: PaginationWithFilterParams = {
        page: pageToFetch,
        size: paginationWithFilters.size,
      }

      if (paginationWithFilters.country) params.country = paginationWithFilters.country
      if (paginationWithFilters.name) params.name = paginationWithFilters.name
      if (paginationWithFilters.status) params.status = paginationWithFilters.status
      if (paginationWithFilters.type) params.type = paginationWithFilters.type

      const response = await institutionApi.getAll(params)
      
      setInstitutions(response.data)
      setTotalItems(response.total)
      setTotalPages(response.totalPages)
      
      if (resetPage) {
        setPaginationWithFilters(prev => ({ ...prev, page: 1 }))
      }
      
      setIsLoading(false)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch institutions')
      setIsLoading(false)
    }
  }, [paginationWithFilters])

  // Update filters
  const updateFilter = useCallback((key: keyof InstitutionFilters, value: string) => {
    // Update pagination with filters, reset to page 1
    setPaginationWithFilters(prev => ({
      ...prev,
      [key]: value || undefined, // Remove empty strings
      page: 1 // Reset to first page when filters change
    }))
  }, [])

  // Pagination actions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPaginationWithFilters(prev => ({ ...prev, page }))
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (paginationWithFilters.page < totalPages) {
      setPaginationWithFilters(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }, [paginationWithFilters.page, totalPages])

  const previousPage = useCallback(() => {
    if (paginationWithFilters.page > 1) {
      setPaginationWithFilters(prev => ({ ...prev, page: prev.page - 1 }))
    }
  }, [paginationWithFilters.page])

  const changePageSize = useCallback((size: number) => {
    setPaginationWithFilters({ page: 1, size })
  }, [])

  // Extract current filter values from paginationWithFilters
  const filters = useMemo<InstitutionFilters>(() => ({
    name: paginationWithFilters.name || '',
    country: paginationWithFilters.country || '',
    status: paginationWithFilters.status || '',
    type: paginationWithFilters.type || ''
  }), [paginationWithFilters])

  // Computed: Metrics (based on all institutions, not just current page)
  const metrics = useMemo<InstitutionMetrics>(() => ({
    totalInstitutions: institutions.length,
    activeCount: institutions.filter(i => i.status === 'ACTIVE').length,
    premiumCount: institutions.filter(i => i.partnership === 'PREMIUM').length,
    totalPrograms: institutions.reduce((sum, i) => sum + (Array.isArray(i.programs) ? i.programs.length : i.programs ?? 0), 0),
    totalStudents: institutions.reduce((sum, i) => sum + i.totalStudents, 0),
    totalInternational: institutions.reduce((sum, i) => sum + i.internationalStudents, 0)
  }), [institutions])

  // Computed: Top ranked institutions
  const topInstitutions = useMemo(() => 
    [...institutions]
      .sort((a, b) => a.ranking - b.ranking)
      .slice(0, 3),
    [institutions]
  )

  // Computed: Partnership distribution
  const partnershipDistribution = useMemo(() => ({
    premium: institutions.filter(i => i.partnership === 'PREMIUM').length,
    standard: institutions.filter(i => i.partnership === 'STANDARD').length,
    basic: institutions.filter(i => i.partnership === 'BASIC').length
  }), [institutions])

  return {
    // State
    institutions,
    isLoading,
    error,
    activeTab,
    filters,

    // Pagination
    paginationWithFilters,
    totalItems,
    totalPages,

    // Computed
    metrics,
    topInstitutions,
    partnershipDistribution,

    // Actions
    setActiveTab,
    updateFilter,
    fetchInstitutions,

    // Pagination actions
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  }
}