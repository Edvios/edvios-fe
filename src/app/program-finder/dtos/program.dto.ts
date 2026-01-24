import { z } from "zod";

/* ===============================
   Filter Request
================================ */
export const programFilterRequestSchema = z.object({
  search: z.string().optional(),
  institutionId: z.string().optional(),
  country: z.string().optional(),
  level: z.string().optional(),
  intakeId: z.string().optional(),
  subjectId: z.string().optional(),
  scholarshipAvailable: z.boolean().optional(),
  englishWaiver: z.boolean().optional(),
  page: z.number().min(1).optional(),
  size: z.number().min(1).max(100).optional(),
});
export type ProgramFilterRequest = z.infer<typeof programFilterRequestSchema>;

/* ===============================
   Common Schemas
================================ */
export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  total: z.number(),
});

/* ===============================
   Frontend Program Schema
================================ */
export const programSchema = z.object({
  id: z.string(),
  title: z.string(),
  institution: z.string(),
  location: z.string(),
  country: z.string(),
  level: z.string(),
  intake: z.string(),
  duration: z.string(),
  tuitionFee: z.string(),
  applicationFee: z.string(),
  englishTestScore: z.string(),
  status: z.enum(["available", "closed", "waitlist"]),
  subject: z.string(),
  ranking: z.number(),
  scholarship: z.boolean(),
  lastUpdated: z.string(),
  applicationDeadline: z.string(),
  ucasCode: z.string().optional(),
  englishWaiver: z.boolean().optional(),
  popularityRank: z.number().optional(),
});

/* ===============================
   Backend Schemas
================================ */
export const backendInstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  logo: z.string().optional(),
});

export const backendIntakeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const backendSubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const backendProgramSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string().optional(),
  intakeId: z.string().nullable().optional(),
  subjectId: z.string().nullable().optional(),
  duration: z.string().optional(),
  tuitionFee: z.string().optional(),
  applicationFee: z.string().optional(),
  englishTestScore: z.string().optional(),
  scholarship: z.boolean().optional(),
  lastUpdated: z.string().optional(),
  applicationDeadline: z.string().optional(),
  ucasCode: z.string().nullable().optional(),
  englishWaiver: z.boolean().nullable().optional(),
  popularityRank: z.number().nullable().optional(),
  status: z.string().optional(),
  institutionId: z.string().nullable().optional(),
  intake: backendIntakeSchema.nullable().optional(),
  subject: backendSubjectSchema.nullable().optional(),
  institution: backendInstitutionSchema.nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type BackendProgram = z.infer<typeof backendProgramSchema>;

/* ===============================
   Backend Responses
================================ */
export const backendFilteredProgramResponseSchema = z.object({
  data: z.array(backendProgramSchema),
  total: z.number(),
  page: z.number(),
  lastPage: z.number(),
});
export type BackendFilteredProgramResponse = z.infer<
  typeof backendFilteredProgramResponseSchema
>;

export const backendInitialProgramDataResponseSchema = z.object({
  data: z.array(backendProgramSchema),
  page: z.number(),
  size: z.number(),
  total: z.number(),
});
export type BackendInitialProgramDataResponse = z.infer<
  typeof backendInitialProgramDataResponseSchema
>;

/* ===============================
   Frontend Responses
================================ */
export const initialProgramDataResponseSchema = z.object({
  institutions: z.array(institutionSchema),
  countries: z.array(z.string()),
  levels: z.array(z.string()),
  intakes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  subjects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  programs: z.array(programSchema),
  pagination: paginationSchema,
});

export const filteredProgramDataResponseSchema = z.object({
  programs: z.array(programSchema),
  pagination: paginationSchema,
});

export type InitialProgramDataResponse = z.infer<
  typeof initialProgramDataResponseSchema
>;
export type FilteredProgramDataResponse = z.infer<
  typeof filteredProgramDataResponseSchema
>;
