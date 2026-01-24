// app/institutions/components/InstitutionList.tsx

import React from 'react'
import { InstitutionCard } from './InstitutionCard'
import type { Institution } from '@/app/institution-management/types/institute-managemet.types'

interface InstitutionListProps {
  institutions: Institution[]
}

export const InstitutionList = React.memo(function InstitutionList({ 
  institutions 
}: InstitutionListProps) {
  if (institutions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No institutions found matching your filters
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {institutions.map(inst => (
        <InstitutionCard key={inst.id} institution={inst} />
      ))}
    </div>
  )
})
