// app/institutions/dtos.ts

import { z } from 'zod'

const normalizeType = (type: string): 'UNIVERSITY' | 'COLLEGE' | 'SCHOOL' | 'INSTITUTE' => {
  const value = type.toUpperCase()
  if (value === 'COLLEGE' || value === 'SCHOOL' || value === 'INSTITUTE') return value as 'COLLEGE' | 'SCHOOL' | 'INSTITUTE'
  return 'UNIVERSITY'
}

const normalizeStatus = (status: string): 'ACTIVE' | 'PENDING' | 'INACTIVE' => {
  const value = status.toUpperCase()
  if (value === 'ACTIVE' || value === 'PENDING') return value as 'ACTIVE' | 'PENDING'
  return 'INACTIVE'
}

const normalizePartnership = (level: string): 'PREMIUM' | 'STANDARD' | 'BASIC' => {
  const value = level.toUpperCase()
  if (value === 'PREMIUM' || value === 'STANDARD') return value as 'PREMIUM' | 'STANDARD'
  return 'BASIC'
}

const InstitutionBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  type: z.string(),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  ranking: z.number().nonnegative(),
  establishedYear: z.number().min(1000).max(new Date().getFullYear()),
  totalStudents: z.number().nonnegative(),
  internationalStudents: z.number().nonnegative(),
  programsCount: z.number().nonnegative().optional(),
  programs: z.union([z.number(), z.array(z.unknown())]).optional(),
  tuitionRange: z.string(),
  status: z.string(),
  partnership: z.string(),
  contactEmail: z.string().email(),
  website: z.string().url(),
  description: z.string(),
  specialties: z.array(z.string()).default([]),
  accreditations: z.array(z.string()).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const InstitutionSchema = InstitutionBaseSchema.transform((data) => ({
  ...data,
  type: normalizeType(data.type),
  status: normalizeStatus(data.status),
  partnership: normalizePartnership(data.partnership),
  programsCount: data.programsCount ?? (typeof data.programs === 'number' ? data.programs : Array.isArray(data.programs) ? data.programs.length : 0),
  programs: typeof data.programs === 'number' ? [] : (data.programs ?? []),
  specialties: data.specialties ?? [],
  accreditations: data.accreditations ?? [],
}))

export const InstitutionStatsSchema = z.object({
  institutionId: z.string(),
  applications: z.number().nonnegative(),
  acceptances: z.number().nonnegative(),
  enrollments: z.number().nonnegative(),
  revenue: z.number().nonnegative(),
  month: z.string()
})

export const CreateInstitutionDTO = InstitutionBaseSchema.pick({
  name: true,
  type: true,
  country: true,
  city: true,
  ranking: true,
  establishedYear: true,
  totalStudents: true,
  internationalStudents: true,
  programsCount: true,
  tuitionRange: true,
  status: true,
  partnership: true,
  contactEmail: true,
  website: true,
  description: true,
  specialties: true,
  accreditations: true,
})

export const UpdateInstitutionDTO = CreateInstitutionDTO.partial().extend({ id: z.string() })

export type InstitutionDTO = z.infer<typeof InstitutionSchema>
export type CreateInstitutionDTO = z.infer<typeof CreateInstitutionDTO>
export type UpdateInstitutionDTO = z.infer<typeof UpdateInstitutionDTO>
export type InstitutionStatsDTO = z.infer<typeof InstitutionStatsSchema>