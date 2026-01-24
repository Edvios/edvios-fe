// app/institutions/components/InstitutionFilters.tsx

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface InstitutionFiltersProps {
  searchTerm: string
  statusFilter: string
  countryFilter: string
  countries: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCountryChange: (value: string) => void
}

export function InstitutionFilters({
  searchTerm,
  statusFilter,
  countryFilter,
  countries,
  onSearchChange,
  onStatusChange,
  onCountryChange
}: InstitutionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search by name, city or country..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-10 border-gray-300"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[160px] border-gray-300">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select value={countryFilter} onValueChange={onCountryChange}>
        <SelectTrigger className="w-full sm:w-[160px] border-gray-300">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}