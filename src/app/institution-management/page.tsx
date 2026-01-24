// app/institutions/page.tsx
'use client'

import React, { useState } from 'react'
import { Plus, School, CheckCircle2, BookOpen, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useInstitutions } from '@/app/institution-management/hooks/use-institutions'
import { StatsCard } from './components/StatsCard'
import { InstitutionFilters } from './components/InstitutionFilters'
import { InstitutionCard } from './components/InstitutionCard'
import { OverviewTab } from './components/OverviewTab'
import { Pagination } from './components/Pagination'
import { CreateInstitutionDialog } from './components/CreateInstitutionDialog'
import { TabType } from '@/app/institution-management/enums/institute-managemet.enum'
import { UserTypeToggle } from '@/app/auth/login/components/toggle'

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading institutions...</p>
          </div>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Institution Management</h1>
            <p className="mt-1 text-gray-600">
              Manage partnerships with educational institutions worldwide
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-orange-gradient hover:opacity-90 shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Add Institution
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            label="Total Institutions"
            value={metrics.totalInstitutions}
            icon={School}
          />
          <StatsCard
            label="Active Partners"
            value={metrics.activeCount}
            icon={CheckCircle2}
            valueColor="text-green-600"
          />
          <StatsCard
            label="Total Programs"
            value={metrics.totalPrograms.toLocaleString()}
            icon={BookOpen}
            valueColor="text-purple-600"
          />
          <StatsCard
            label="Premium Partners"
            value={metrics.premiumCount}
            icon={Award}
            valueColor="text-amber-600"
          />
        </div>

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
                  onSearchChange={(val) => updateFilter('name', val)}
                  onStatusChange={(val) => updateFilter('status', val)}
                  onCountryChange={(val) => updateFilter('country', val)}
                  onTypeChange={(val) => updateFilter('type', val)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {institutions.map(inst => (
                    <InstitutionCard key={inst.id} institution={inst} />
                  ))}
                </div>

                {institutions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No institutions found matching your filters
                  </div>
                )}

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