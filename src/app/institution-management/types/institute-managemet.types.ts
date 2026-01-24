// app/institutions/types.ts

export interface Institution {
  id: string
  name: string
  type: 'UNIVERSITY' | 'COLLEGE' | 'SCHOOL' | 'INSTITUTE'
  country: string
  city: string
  ranking: number
  establishedYear: number
  totalStudents: number
  internationalStudents: number
  programsCount: number
  programs?: unknown[]
  tuitionRange: string
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
  partnership: 'PREMIUM' | 'STANDARD' | 'BASIC'
  contactEmail: string
  website: string
  description: string
  specialties: string[]
  accreditations: string[]
  createdAt?: string
  updatedAt?: string
}

export interface InstitutionFilters {
  name: string
  country: string
  status: string
  type: string
}

export interface InstitutionMetrics {
  totalInstitutions: number
  activeCount: number
  premiumCount: number
  totalPrograms: number
  totalStudents: number
  totalInternational: number
}

export interface PaginationWithFilterParams {
  page: number
  size: number
  country?: string
  name?: string
  status?: string
  type?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
  totalPages: number
}