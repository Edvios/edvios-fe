// app/applications/page.tsx
'use client'

import { useState, useCallback, useMemo } from 'react'
import { GraduationCap, CheckCircle2, Clock, XCircle } from 'lucide-react'

import { useApplications } from '@/app/applications/hooks/use-applications'
import { ApplicationCard } from '@/app/applications/components/ApplicationCard'
import { ApplicationCardSkeleton } from '@/app/applications/components/ApplicationCardSkeleton'
import { ApplicationFilters } from '@/app/applications/components/ApplicationFilters'
import { Pagination } from '@/app/applications/components/Pagination'
import { ApplicationStatus } from '@/app/applications/enums/application.enum'
import { StatsCard } from '@/components/shared/stats-card'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function AdminPanel() {
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all')

  const {
    applications,
    loading,
    countsLoading,
    metrics,
    updateApplicationStatus,
    paginationParams,
    totalItems,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  } = useApplications(
    filter === 'all' ? undefined : filter
  )

  const handleFilterChange = useCallback((val: 'all' | ApplicationStatus) => {
    setFilter(val)
  }, [])

  // Stats skeleton for initial load
  const statsSection = useMemo(() => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          label="Total Applications"
          value={metrics.total}
          icon={GraduationCap}
          loading={countsLoading}
        />
        <StatsCard
          label="Submitted"
          value={metrics.pending}
          icon={Clock}
          valueColor="text-blue-600"
          loading={countsLoading}
        />
        <StatsCard
          label="Approved"
          value={metrics.approved}
          icon={CheckCircle2}
          valueColor="text-green-600"
          loading={countsLoading}
        />
        <StatsCard
          label="Rejected"
          value={metrics.rejected}
          icon={XCircle}
          valueColor="text-red-600"
          loading={countsLoading}
        />
      </div>
    )
  }, [metrics, countsLoading])

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <Breadcrumb items={[{ label: "Application Management", active: true }]} />

        {statsSection}

        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-sm font-bold text-black uppercase tracking-wider">Applications</h2>
              <ApplicationFilters
                currentFilter={filter}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <ApplicationCardSkeleton key={i} />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <GraduationCap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? 'There are no applications to display.'
                    : `No ${filter.toLowerCase()} applications at this time.`}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onStatusUpdate={updateApplicationStatus}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={paginationParams.page || 1}
                  totalPages={totalPages}
                  pageSize={paginationParams.size || 10}
                  totalItems={totalItems}
                  onPageChange={goToPage}
                  onPageSizeChange={changePageSize}
                  onNext={nextPage}
                  onPrevious={previousPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}