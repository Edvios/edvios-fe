// app/institutions/page.tsx
'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Plus, School, CheckCircle2, BookOpen, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useInstitutions } from '@/app/institution-management/hooks/use-institutions'
import { InstitutionFilters } from './components/InstitutionFilters'
import { InstitutionList } from './components/InstitutionList'
import { OverviewTab } from './components/OverviewTab'
import { Pagination } from './components/Pagination'
import { CreateInstitutionDialog } from './components/CreateInstitutionDialog'
import { TabType } from '@/app/institution-management/enums/institute-managemet.enum'
import { UserTypeToggle } from '@/app/auth/login/components/toggle'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { StatsCard } from '@/components/shared/stats-card'

export default function InstitutionManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const {
    institutions,
    isLoading,
    error,
    activeTab,
    filters,
    metrics,
    topInstitutions,
    partnershipDistribution,
    totalItems,
    totalPages,
    paginationWithFilters,
    setActiveTab,
    updateFilter,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    fetchInstitutions
  } = useInstitutions()

  // Memoized filter handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((val: string) => updateFilter('name', val), [updateFilter])
  const handleStatusChange = useCallback((val: string) => updateFilter('status', val), [updateFilter])
  const handleCountryChange = useCallback((val: string) => updateFilter('country', val), [updateFilter])
  const handleTypeChange = useCallback((val: string) => updateFilter('type', val), [updateFilter])

  // Memoized stats section to prevent re-renders
  const statsSection = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatsCard
        label="Total Institutions"
        value={metrics.totalInstitutions}
        icon={School}
        loading={isLoading}
      />
      <StatsCard
        label="Active Partners"
        value={metrics.activeCount}
        icon={CheckCircle2}
        valueColor="text-green-600"
        loading={isLoading}
      />
      <StatsCard
        label="Total Programs"
        value={metrics.totalPrograms.toLocaleString()}
        icon={BookOpen}
        valueColor="text-purple-600"
        loading={isLoading}
      />
      <StatsCard
        label="Premium Partners"
        value={metrics.premiumCount}
        icon={Award}
        valueColor="text-amber-600"
        loading={isLoading}
      />
    </div>
  ), [metrics, isLoading])


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumb items={[{ label: "Institution Management", active: true }]} className="mb-0" />
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-edvios-green hover:bg-edvios-green/90 text-white font-bold text-xs uppercase tracking-widest h-10 px-6 rounded-md shadow-none"
          >
            <Plus size={16} className="mr-2" />
            Add Institution
          </Button>
        </div>

        {/* Stats Cards */}
        {statsSection}

        {/* Tabs */}
        <Card className="border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <UserTypeToggle
              options={['OVERVIEW', 'INSTITUTIONS', 'PARTNERSHIPS', 'ANALYTICS']}
              value={activeTab}
              onChange={(val) => setActiveTab(val as TabType)}
            />
          </div>

          <div className="p-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && (
              <OverviewTab
                topInstitutions={topInstitutions}
                partnershipDistribution={partnershipDistribution}
                totalStudents={metrics.totalStudents}
                totalInternational={metrics.totalInternational}
                loading={isLoading}
              />
            )}

            {/* INSTITUTIONS TAB */}
            {activeTab === 'INSTITUTIONS' && (
              <div className="space-y-6">
                <InstitutionFilters
                  name={filters.name}
                  status={filters.status}
                  country={filters.country}
                  type={filters.type}
                  onSearchChange={handleSearchChange}
                  onStatusChange={handleStatusChange}
                  onCountryChange={handleCountryChange}
                  onTypeChange={handleTypeChange}
                />

                <InstitutionList institutions={institutions} loading={isLoading} />

                {/* Pagination */}
                {institutions.length > 0 && (
                  <Pagination
                    currentPage={paginationWithFilters.page}
                    totalPages={totalPages}
                    pageSize={paginationWithFilters.size}
                    totalItems={totalItems}
                    onPageChange={goToPage}
                    onPageSizeChange={changePageSize}
                    onNext={nextPage}
                    onPrevious={previousPage}
                  />
                )}
              </div>
            )}

            {/* PARTNERSHIPS TAB */}
            {activeTab === 'PARTNERSHIPS' && (
              <div className="text-center py-12 text-gray-500">
                Partnership management view (to be implemented)
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'ANALYTICS' && (
              <div className="text-center py-12 text-gray-500">
                Analytics & performance dashboard (to be implemented)
              </div>
            )}
          </div>
        </Card>

      </div>

      <CreateInstitutionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={() => {
          fetchInstitutions(true)
        }}
      />
    </div>
  )
}