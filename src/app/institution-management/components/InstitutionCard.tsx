// app/institutions/components/InstitutionCard.tsx

import React, { useState } from 'react'
import { School, GraduationCap, BookOpen, Building, Mail, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Institution } from '@/app/institution-management/types/institute-managemet.types'
import { InstitutionDetailsDialog } from './InstitutionDetailsDialog'

interface InstitutionCardProps {
  institution: Institution
  onDeleted?: () => void
  onUpdated?: () => void
}

const getPartnershipVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
  const value = level.toLowerCase()
  if (value === 'premium') return 'default'
  if (value === 'standard') return 'secondary'
  return 'outline'
}

const InstitutionTypeIcon = ({ type, className }: { type: string, className?: string }) => {
  const Icon = (() => {
    switch (type.toLowerCase()) {
      case 'university': return School
      case 'college': return GraduationCap
      case 'school': return BookOpen
      case 'institute': return Building
      default: return School
    }
  })()
  return <Icon className={className} />
}

export const InstitutionCard = React.memo(function InstitutionCard({ institution, onDeleted, onUpdated }: InstitutionCardProps) {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const programsCount = Array.isArray(institution.programs) ? institution.programs.length : institution.programs ?? 0;

  return (
    <>
      <div className="group bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all flex flex-col h-full overflow-hidden">
        {/* Header Section - Clean & Professional */}
        <div className="p-5 pb-0 flex gap-4">
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <InstitutionTypeIcon type={institution.type} className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base text-gray-900 leading-tight truncate pr-1" title={institution.name}>
                {institution.name}
              </h3>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {/* Status Dot */}
                <div className={`w-2 h-2 rounded-full ${institution.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`} title={institution.status} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {institution.city}, {institution.country}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1">
          {/* Badges Row */}
          <div className="flex gap-2">
            <Badge variant={getPartnershipVariant(institution.partnership)} className="h-5 px-1.5 text-[10px]">
              {institution.partnership}
            </Badge>
            {/* Show top 2 specialties as badges */}
            {institution.specialties.slice(0, 2).map(s => (
              <Badge key={s} variant="secondary" className="h-5 px-1.5 text-[10px] bg-gray-100 text-gray-600 font-normal">
                {s}
              </Badge>
            ))}
            {institution.specialties.length > 2 && (
              <span className="text-[10px] text-gray-400 self-center">+{institution.specialties.length - 2}</span>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {institution.description}
          </p>

          <div className="flex flex-col gap-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-gray-400" />
              <span className="truncate">{institution.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={12} className="text-gray-400" />
              <span className="truncate">{institution.website.replace(/^https?:\/\//, '')}</span>
            </div>
          </div>
        </div>

        {/* Footer Stats & Actions */}
        <div className="mt-auto bg-gray-50/50 border-t border-gray-100 p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">#{typeof institution.ranking === 'number' ? institution.ranking : '-'}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rank</div>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="text-lg font-bold text-gray-900">{programsCount}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Programs</div>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="text-lg font-bold text-gray-900">{institution.totalStudents.toLocaleString()}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Students</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8 bg-white"
              onClick={() => setDetailsDialogOpen(true)}
            >
              Details
            </Button>
            <Button
              size="sm"
              className="w-full text-xs h-8 bg-gray-900 hover:bg-gray-800 text-white"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>

      <InstitutionDetailsDialog
        institutionId={institution.id}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onDeleted={onDeleted}
        onUpdated={onUpdated}
      />
    </>
  )
})