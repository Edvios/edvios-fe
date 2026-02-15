// app/institutions/components/InstitutionCard.tsx

import React, { useState } from 'react'
import { School, GraduationCap, BookOpen, Building, Mail, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Institution } from '@/app/institution-management/types/institute-managemet.types'
import { InstitutionDetailsDialog } from './InstitutionDetailsDialog'

interface InstitutionCardProps {
  institution: Institution
  onDeleted?: () => void
  onUpdated?: () => void
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const value = status.toLowerCase()
  if (value === 'active') return 'default'
  if (value === 'pending') return 'secondary'
  return 'outline'
}

const getPartnershipVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
  const value = level.toLowerCase()
  if (value === 'premium') return 'default'
  if (value === 'standard') return 'secondary'
  return 'outline'
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'university': return School
    case 'college': return GraduationCap
    case 'school': return BookOpen
    case 'institute': return Building
    default: return School
  }
}

export const InstitutionCard = React.memo(function InstitutionCard({ institution, onDeleted, onUpdated }: InstitutionCardProps) {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const TypeIcon = getTypeIcon(institution.type)

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow overflow-hidden border-gray-200 h-full flex flex-col">
        <CardContent className="p-4 md:p-5 lg:p-6 flex flex-col flex-1">
          {/* Header Section */}
          <div className="mb-3 md:mb-4">
            {/* Icon and Badges Row */}
            <div className="flex items-start justify-between mb-2.5 md:mb-3 gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-edvios-green rounded-xl flex items-center justify-center text-white flex-shrink-0">
                {React.createElement(TypeIcon, { className: "w-5 h-5 md:w-6 md:h-6" })}
              </div>
              <div className="flex gap-2 items-start flex-shrink-0">
                <Badge 
                  variant={getStatusVariant(institution.status)} 
                  className="border-0 bg-green-100 text-green-700 text-[10px] md:text-xs px-2 py-0.5"
                >
                  {institution.status}
                </Badge>
                <Badge 
                  variant={getPartnershipVariant(institution.partnership)} 
                  className="border-0 text-[10px] md:text-xs px-2 py-0.5"
                >
                  {institution.partnership.charAt(0).toUpperCase() + institution.partnership.slice(1)}
                </Badge>
              </div>
            </div>
            
            {/* University Name and Location */}
            <div>
              <h3 className="font-semibold text-sm md:text-base lg:text-lg leading-tight mb-1">
                {institution.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {institution.city}, {institution.country}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2 leading-relaxed">
            {institution.description}
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-2 md:gap-2.5 text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-gray-500" />
              <span className="truncate">{institution.contactEmail}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-gray-500" />
              <span className="truncate">{institution.website.replace('https://', '')}</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-4 md:mb-5">
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {institution.specialties.slice(0, 4).map(s => (
                <Badge 
                  key={s} 
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 border-0 text-[10px] md:text-xs px-2 py-0.5"
                >
                  {s}
                </Badge>
              ))}
              {institution.specialties.length > 4 && (
                <Badge 
                  variant="secondary" 
                  className="bg-gray-100 text-gray-500 border-0 text-[10px] md:text-xs px-2 py-0.5"
                >
                  +{institution.specialties.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-auto">
            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center pt-3 md:pt-4 border-t border-gray-200">
              <div>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-edvios-blue leading-tight">
                  #{typeof institution.ranking === 'number' ? institution.ranking : 'N/A'}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Ranking</p>
              </div>
              <div>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-600 leading-tight">
                  {Array.isArray(institution.programs) ? institution.programs.length : institution.programs ?? 0}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Programs</p>
              </div>
              <div>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-purple-600 leading-tight">
                  {institution.totalStudents.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Students</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-4 md:mt-5">
              <Button 
                variant="outline" 
                className="flex-1 text-xs md:text-sm h-9 md:h-10"
                onClick={() => setDetailsDialogOpen(true)}
              >
                View Details
              </Button>
              <Button className="flex-1 bg-edvios-green hover:opacity-90 text-xs md:text-sm h-9 md:h-10">
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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