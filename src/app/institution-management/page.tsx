// app/institutions/page.tsx
'use client'

import React, { useState } from 'react'
import {
  Search, Plus, School, Globe, BookOpen, Award,
  CheckCircle2, Mail, Building, GraduationCap
} from 'lucide-react'

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface Institution {
  id: string
  name: string
  type: 'university' | 'college' | 'school' | 'institute'
  country: string
  city: string
  ranking: number
  establishedYear: number
  totalStudents: number
  internationalStudents: number
  programs: number
  tuitionRange: string
  status: 'active' | 'pending' | 'inactive'
  partnership: 'premium' | 'standard' | 'basic'
  contactEmail: string
  website: string
  description: string
  specialties: string[]
  accreditations: string[]
  applicationDeadlines: string[]
}

// ────────────────────────────────────────────────
// Sample Data
// ────────────────────────────────────────────────
const sampleInstitutions: Institution[] = [
  {
    id: 'INST001',
    name: 'University of Oxford',
    type: 'university',
    country: 'United Kingdom',
    city: 'Oxford',
    ranking: 1,
    establishedYear: 1096,
    totalStudents: 24000,
    internationalStudents: 8500,
    programs: 350,
    tuitionRange: '£9,250 – £37,510',
    status: 'active',
    partnership: 'premium',
    contactEmail: 'admissions@ox.ac.uk',
    website: 'https://www.ox.ac.uk',
    description: 'The University of Oxford is a collegiate research university in Oxford, England.',
    specialties: ['Medicine', 'Law', 'Business', 'Engineering', 'Humanities'],
    accreditations: ['QAA', 'AACSB', 'EQUIS'],
    applicationDeadlines: ['January 15', 'October 15']
  },
  // ... other entries (Harvard, Toronto, Melbourne) – same as your original
  // (I've omitted them here for brevity – copy them from your code)
]

// sampleStats removed (not used)

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function InstitutionManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'institutions' | 'partnerships' | 'analytics'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')

  const [institutions] = useState<Institution[]>(sampleInstitutions)

  // Computed values
  const totalInstitutions = institutions.length
  const activeCount = institutions.filter(i => i.status === 'active').length
  const premiumCount = institutions.filter(i => i.partnership === 'premium').length
  const totalPrograms = institutions.reduce((sum, i) => sum + i.programs, 0)
  const totalStudents = institutions.reduce((sum, i) => sum + i.totalStudents, 0)
  const totalInternational = institutions.reduce((sum, i) => sum + i.internationalStudents, 0)

  const countries = Array.from(new Set(institutions.map(i => i.country)))

  const filteredInstitutions = institutions.filter(inst => {
    const searchMatch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.country.toLowerCase().includes(searchTerm.toLowerCase())

    const statusMatch = statusFilter === 'all' || inst.status === statusFilter
    const countryMatch = countryFilter === 'all' || inst.country === countryFilter

    return searchMatch && statusMatch && countryMatch
  })

  // Helpers
  const getStatusClasses = (status: string) => {
    if (status === 'active')   return 'bg-green-100 text-green-800 border-green-200'
    if (status === 'pending')  return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (status === 'inactive') return 'bg-gray-100 text-gray-700 border-gray-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPartnershipClasses = (level: string) => {
    if (level === 'premium')  return 'bg-purple-100 text-purple-800 border-purple-200'
    if (level === 'standard') return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'university': return School
      case 'college':    return GraduationCap
      case 'school':     return BookOpen
      case 'institute':  return Building
      default:           return School
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Institution Management</h1>
            <p className="mt-1 text-gray-600">
              Manage partnerships with educational institutions worldwide
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
            <Plus size={18} />
            Add Institution
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Institutions</p>
                <p className="text-3xl font-bold mt-1">{totalInstitutions}</p>
              </div>
              <School className="h-10 w-10 text-indigo-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Partners</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeCount}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalPrograms.toLocaleString()}</p>
              </div>
              <BookOpen className="h-10 w-10 text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Partners</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{premiumCount}</p>
              </div>
              <Award className="h-10 w-10 text-amber-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {(['overview', 'institutions', 'partnerships', 'analytics'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                    ${activeTab === tab
                      ? 'border-b-2 border-indigo-600 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Contents */}
          <div className="p-6">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Institutions */}
                <div className="bg-gray-50/50 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Top Ranking Institutions</h3>
                  <div className="space-y-4">
                    {institutions
                      .sort((a, b) => a.ranking - b.ranking)
                      .slice(0, 3)
                      .map(inst => {
                        const TypeIcon = getTypeIcon(inst.type)
                        return (
                          <div key={inst.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                                <TypeIcon size={16} />
                              </div>
                              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                                #{inst.ranking}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{inst.name}</p>
                              <p className="text-sm text-gray-500">{inst.city}, {inst.country}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">{inst.programs} programs</p>
                              <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mt-1 ${getPartnershipClasses(inst.partnership)}`}>
                                {inst.partnership}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Partnership & Student Stats */}
                <div className="bg-gray-50/50 rounded-xl p-6 border space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Partnership Distribution</h3>
                    <div className="space-y-3">
                      {['premium', 'standard', 'basic'].map(level => (
                        <div key={level} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              level === 'premium' ? 'bg-purple-500' :
                              level === 'standard' ? 'bg-blue-500' : 'bg-gray-500'
                            }`} />
                            <span className="font-medium capitalize">{level}</span>
                          </div>
                          <span className="font-medium">
                            {institutions.filter(i => i.partnership === level).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
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
                        <span className="font-medium text-indigo-600">
                          {Math.round((totalInternational / totalStudents) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INSTITUTIONS TAB */}
            {activeTab === 'institutions' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by name, city or country..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border rounded-lg min-w-[160px]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={countryFilter}
                    onChange={e => setCountryFilter(e.target.value)}
                    className="px-4 py-2.5 border rounded-lg min-w-[160px]"
                  >
                    <option value="all">All Countries</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Institution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInstitutions.map(inst => {
                    const TypeIcon = getTypeIcon(inst.type)
                    return (
                      <div
                        key={inst.id}
                        className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <TypeIcon size={24} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{inst.name}</h3>
                                <p className="text-sm text-gray-600">{inst.city}, {inst.country}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(inst.status)}`}>
                                {inst.status}
                              </span>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPartnershipClasses(inst.partnership)}`}>
                                {inst.partnership}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-5 line-clamp-3">{inst.description}</p>

                          <div className="flex items-center gap-5 text-sm text-gray-600 mb-5">
                            <div className="flex items-center gap-1.5">
                              <Mail size={16} />
                              {inst.contactEmail}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Globe size={16} />
                              {inst.website.replace('https://', '')}
                            </div>
                          </div>

                          <div className="mb-5">
                            <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
                            <div className="flex flex-wrap gap-1.5">
                              {inst.specialties.slice(0, 4).map(s => (
                                <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {s}
                                </span>
                              ))}
                              {inst.specialties.length > 4 && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                  +{inst.specialties.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
                            <div>
                              <p className="text-xl font-bold text-indigo-600">#{inst.ranking}</p>
                              <p className="text-xs text-gray-500 mt-1">Ranking</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-green-600">{inst.programs}</p>
                              <p className="text-xs text-gray-500 mt-1">Programs</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-purple-600">
                                {(inst.totalStudents / 1000).toFixed(0)}k
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Students</p>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                              View Details
                            </button>
                            <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* PARTNERSHIPS & ANALYTICS tabs – similar structure can be added */}
            {activeTab === 'partnerships' && (
              <div className="text-center py-12 text-gray-500">
                Partnership management view (to be implemented)
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12 text-gray-500">
                Analytics & performance dashboard (to be implemented)
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}