// app/institutions/components/StatsCard.tsx

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  valueColor?: string
  loading?: boolean
}

export const StatsCard = React.memo(function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  valueColor,
  loading = false
}: StatsCardProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            {loading ? (
              <Skeleton className="h-9 w-24 mt-1" />
            ) : (
              <p className={`text-3xl font-bold mt-1 ${valueColor || ''}`}>
                {value}
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-edvios-green flex items-center justify-center text-white opacity-80 flex-shrink-0 ml-4">
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})