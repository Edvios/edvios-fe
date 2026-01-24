// app/institutions/components/InstitutionFilters.tsx

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InstitutionCountry, InstitutionStatus, InstitutionType } from '../enums/institute-managemet.enum'

interface InstitutionFiltersProps {
  name: string
  status: string
  type: string
  country: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCountryChange: (value: string) => void
  onTypeChange: (value: string) => void
}

export function InstitutionFilters({
  name,
  status,
  type,
  country,
  onSearchChange,
  onStatusChange,
  onCountryChange,
  onTypeChange,
}: InstitutionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search by name..."
          value={name}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-10 border-gray-300"
        />
      </div>

      <Select value={status || 'all'} onValueChange={(val) => onStatusChange(val === 'all' ? '' : val)}>
        <SelectTrigger className="w-full sm:w-[160px] border-gray-300">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {Object.values(InstitutionStatus).map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={country || 'all'} onValueChange={(val) => onCountryChange(val === 'all' ? '' : val)}>
        <SelectTrigger className="w-full sm:w-[160px] border-gray-300">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {Object.values(InstitutionCountry).map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type || 'all'} onValueChange={(val) => onTypeChange(val === 'all' ? '' : val)}>
        <SelectTrigger className="w-full sm:w-[160px] border-gray-300">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.values(InstitutionType).map(t => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}