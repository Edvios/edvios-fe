// app/institutions/components/OverviewTab.tsx

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Institution } from '@/app/institution-management/types/institute-managemet.types'

interface OverviewTabProps {
  topInstitutions: Institution[]
  partnershipDistribution: {
    premium: number
    standard: number
    basic: number
  }
  totalStudents: number
  totalInternational: number
}

const getPartnershipClasses = (level: string) => {
  if (level === 'premium') return 'bg-purple-100 text-purple-800'
  if (level === 'standard') return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-700'
}

export function OverviewTab({
  topInstitutions,
  partnershipDistribution,
  totalStudents,
  totalInternational
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Institutions */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Ranking Institutions</h3>
          <div className="space-y-4">
            {topInstitutions.map(inst => (
              <div key={inst.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center text-white font-bold">
                  #{inst.ranking?.toString() || 'N/A'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{inst.name}</p>
                  <p className="text-sm text-gray-500">{inst.city}, {inst.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{Array.isArray(inst.programs) ? inst.programs.length : inst.programs ?? 0} programs</p>
                  <Badge className={`mt-1 border-0 ${getPartnershipClasses(inst.partnership)}`}>
                    {inst.partnership.charAt(0).toUpperCase() + inst.partnership.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partnership & Student Stats */}
      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Partnership Distribution</h3>
            <div className="space-y-3">
              {[
                { level: 'premium', count: partnershipDistribution.premium, color: 'bg-purple-500' },
                { level: 'standard', count: partnershipDistribution.standard, color: 'bg-blue-500' },
                { level: 'basic', count: partnershipDistribution.basic, color: 'bg-gray-500' }
              ].map(({ level, count, color }) => (
                <div key={level} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="font-medium capitalize">{level}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-3">Student Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students</span>
                <span className="font-medium">{totalStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">International Students</span>
                <span className="font-medium">{totalInternational.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">International %</span>
                <span className="font-medium">
                  {Math.round((totalInternational / totalStudents) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}