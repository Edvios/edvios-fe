import { z } from 'zod';

// Create Student DTO schema matching backend
export const createStudentDtoSchema = z.object({
  // Personal
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dob: z.string().nullable().optional(), // ISO string
  gender: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  passportNumber: z.string().nullable().optional(),
  passportExpiryDate: z.string().nullable().optional(),
  countryOfResidence: z.string().nullable().optional(),

  // Contact
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  emergencyContact: z.string().nullable().optional(), // e.g., "Name (Number)"

  // Academic
  highestQualification: z.string().nullable().optional(),
  yearOfCompletion: z.number().nullable().optional(),
  institutionName: z.string().nullable().optional(),
  mediumOfInstruction: z.string().nullable().optional(),
  gradesSummary: z.string().nullable().optional(),
  academicCertificates: z.array(z.string()).nullable().optional(), // File URLs/Refs

  // English
  englishTestTaken: z.string().nullable().optional(),
  overallScore: z.number().nullable().optional(),
  testExpiryDate: z.string().nullable().optional(), // ISO string

  // Study Preferences
  intendedIntakeMonth: z.number().nullable().optional(),
  intendedIntakeYear: z.number().nullable().optional(),
  preferredCountries: z.array(z.string()).nullable().optional(),
  preferredStudyLevel: z.string().nullable().optional(),
  preferredFieldOfStudy: z.string().nullable().optional(),
  estimatedBudget: z.number().nullable().optional(),
  fundingSource: z.string().nullable().optional(),

  // Visa
  previousVisaRefusal: z.boolean().optional(),
  visaRefusalDetails: z.string().nullable().optional(),
  travelHistory: z.string().nullable().optional(),
  ongoingImmigrationApps: z.string().nullable().optional(),

  // Internal / Extra
  notes: z.string().nullable().optional(),

  // Address might be needed but optional if backend doesn't care
  address: z.string().nullable().optional(),
});

// Registration Response schema (unchanged mostly)
export const registrationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    studentId: z.string(),
  }).optional(),
});

// Type exports
export type CreateStudentDto = z.infer<typeof createStudentDtoSchema>;
export type RegistrationResponseDto = z.infer<typeof registrationResponseSchema>;
