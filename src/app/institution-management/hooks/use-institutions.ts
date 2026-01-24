// app/institutions/hooks.ts

import { useState, useEffect, useMemo, useCallback } from 'react'
import { institutionApi } from '@/app/institution-management/api/institution-managemet.api'
import type { 
  Institution, 
  InstitutionFilters, 
  InstitutionMetrics,
  PaginationParams 
} from '@/app/institution-management/types/institute-managemet.types'
import type { TabType } from '@/app/institution-management/enums/institute-managemet.enum'

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    size: 12
  })
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Tab management
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW' as TabType)

  // Filters
  const [filters, setFilters] = useState<InstitutionFilters>({
    searchTerm: '',
    statusFilter: 'all',
    countryFilter: 'all'
  })

  // Fetch institutions when pagination changes
  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await institutionApi.getAll({
          page: pagination.page,
          size: pagination.size
        })
        
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
  }, [pagination.page, pagination.size])

  // Manual fetch function for refreshing data
  const fetchInstitutions = useCallback(async (resetPage: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const pageToFetch = resetPage ? 1 : pagination.page;
      const response = await institutionApi.getAll({
        page: pageToFetch,
        size: pagination.size
      })
      
      setInstitutions(response.data)
      setTotalItems(response.total)
      setTotalPages(response.totalPages)
      
      if (resetPage) {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
      
      setIsLoading(false)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch institutions')
      setIsLoading(false)
    }
  }, [pagination.page, pagination.size])

  // Update filters
  const updateFilter = useCallback((key: keyof InstitutionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  // Pagination actions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (pagination.page < totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }, [pagination.page, totalPages])

  const previousPage = useCallback(() => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }))
    }
  }, [pagination.page])

  const changePageSize = useCallback((size: number) => {
    setPagination({ page: 1, size })
  }, [])

  // Computed: Available countries
  const countries = useMemo(() => 
    Array.from(new Set(institutions.map(i => i.country))),
    [institutions]
  )

  // Computed: Filtered institutions
  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      const searchMatch =
        inst.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        inst.city.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        inst.country.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const statusMatch = filters.statusFilter === 'all' || inst.status === filters.statusFilter
      const countryMatch = filters.countryFilter === 'all' || inst.country === filters.countryFilter

      return searchMatch && statusMatch && countryMatch
    })
  }, [institutions, filters])

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
    pagination,
    totalItems,
    totalPages,

    // Computed
    countries,
    filteredInstitutions,
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