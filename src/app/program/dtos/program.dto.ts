import { z } from "zod";

// Program Filter Request Schema
export const programFilterRequestSchema = z.object({
    search: z.string().optional(),
    institutionId: z.string().optional(),
    country: z.string().optional(),
    level: z.string().optional(),
    intake: z.string().optional(),
    subjectArea: z.string().optional(),
    scholarshipAvailable: z.enum(['yes', 'no']).optional(),
    englishWaiver: z.enum(['yes', 'no']).optional(),
    page: z.number().min(1).optional(),
    size: z.number().min(1).max(100).optional(),
});

export type ProgramFilterRequest = z.infer<typeof programFilterRequestSchema>;

// Institution Schema
export const institutionSchema = z.object({
    id: z.string(),
    name: z.string(),
});

// Pagination Schema
export const paginationSchema = z.object({
    page: z.number(),
    size: z.number(),
    total: z.number(),
});

// Program Schema
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
    status: z.enum(['available', 'closed', 'waitlist']),
    subject: z.string(),
    ranking: z.number(),
    scholarship: z.boolean(),
    lastUpdated: z.string(),
    applicationDeadline: z.string(),
    ucasCode: z.string().optional(),
    englishWaiver: z.boolean().optional(),
    popularityRank: z.number().optional(),
});

// Initial Program Data Response Schema
export const initialProgramDataResponseSchema = z.object({
    institutions: z.array(institutionSchema),
    countries: z.array(z.string()),
    levels: z.array(z.string()),
    intakes: z.array(z.string()),
    subjects: z.array(z.string()),
    programs: z.array(programSchema),
    pagination: paginationSchema,
});

// Filtered Program Data Response Schema
export const filteredProgramDataResponseSchema = z.object({
    programs: z.array(programSchema),
    pagination: paginationSchema,
});

export type InitialProgramDataResponse = z.infer<typeof initialProgramDataResponseSchema>;
export type FilteredProgramDataResponse = z.infer<typeof filteredProgramDataResponseSchema>;
