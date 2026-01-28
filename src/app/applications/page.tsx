// app/applications/page.tsx
'use client'

import { useState, useCallback, useMemo } from 'react'
import { GraduationCap, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApplications } from '@/app/applications/hooks/use-applications'
import { ApplicationCard } from '@/app/applications/components/ApplicationCard'
import { ApplicationFilters } from '@/app/applications/components/ApplicationFilters'
import { ApplicationStatus } from '@/app/applications/enums/application.enum'
import { StatsCard } from '@/app/institution-management/components/StatsCard'

export default function AdminPanel() {
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all')
  
  const { applications, loading, error, countsLoading, metrics, updateApplicationStatus } = useApplications(
    filter === 'all' ? undefined : filter
  )

  // Memoized filter handler
  const handleFilterChange = useCallback((val: 'all' | ApplicationStatus) => {
    setFilter(val)
  }, [])

  // Memoized stats section
  const statsSection = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatsCard
        label="Total Applications"
        value={metrics.total}
        icon={GraduationCap}
      />
      <StatsCard
        label="Submitted"
        value={metrics.pending}
        icon={Clock}
        valueColor="text-blue-600"
      />
      <StatsCard
        label="Approved"
        value={metrics.approved}
        icon={CheckCircle2}
        valueColor="text-green-600"
      />
      <StatsCard
        label="Rejected"
        value={metrics.rejected}
        icon={XCircle}
        valueColor="text-red-600"
      />
    </div>
  ), [metrics])

  if (loading || countsLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading applications...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
            <p className="mt-1 text-gray-600">
              Review and manage student applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {statsSection}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error loading applications</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <Card className="border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
              <ApplicationFilters 
                currentFilter={filter} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          </div>

          <div className="p-6">
            {/* Applications List */}
            {applications.length === 0 ? (
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
              <div className="space-y-6">
                {applications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onStatusUpdate={updateApplicationStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  )
}