// app/institutions/components/StatsCard.tsx

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  valueColor?: string
}

export const StatsCard = React.memo(function StatsCard({ label, value, icon: Icon, valueColor }: StatsCardProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${valueColor || ''}`}>
              {value}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-edvios-green flex items-center justify-center text-white opacity-80">
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})