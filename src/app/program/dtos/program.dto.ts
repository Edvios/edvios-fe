import { z } from "zod";

/* ===============================
   Filter Request
================================ */

export const programFilterRequestSchema = z.object({
  search: z.string().optional(),
  institutionId: z.string().optional(),
  country: z.string().optional(),
  level: z.string().optional(),
  intake: z.string().optional(),
  subjectArea: z.string().optional(),
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
   Backend Program Schema
================================ */

export const backendProgramSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  duration: z.string(),
  tuitionFee: z.string(),
  applicationFee: z.string(),
  englishTestScore: z.string(),
  status: z.string(),
  scholarship: z.boolean(),
  lastUpdated: z.string(),
  applicationDeadline: z.string(),
  ucasCode: z.string().optional(),
  englishWaiver: z.boolean(),
  popularityRank: z.number(),

  institution: z
    .object({
      name: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      ranking: z.number().optional(),
    })
    .optional(),

  intake: z
    .object({
      name: z.string().optional(),
    })
    .optional(),

  subject: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
});

export type BackendProgram = z.infer<typeof backendProgramSchema>;

/* ===============================
   Backend Responses
================================ */

export const backendFilteredProgramResponseSchema = z.object({
  data: z.array(backendProgramSchema),
  page: z.number(),
  size: z.number(),
  total: z.number(),
});

export type BackendFilteredProgramResponse =
  z.infer<typeof backendFilteredProgramResponseSchema>;

export const backendInitialProgramDataResponseSchema = z.object({
  subjects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  intakes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  institutes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  programs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    })
  ),
});

export type BackendInitialProgramDataResponse =
  z.infer<typeof backendInitialProgramDataResponseSchema>;

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
