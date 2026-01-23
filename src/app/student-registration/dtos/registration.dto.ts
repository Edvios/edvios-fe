import { z } from 'zod';

// Create Student DTO schema matching backend
export const createStudentDtoSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  dob: z.string().nullable().optional(), // ISO string
  address: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  currentEducationLevel: z.string().nullable().optional(),
  currentInstitution: z.string().nullable().optional(),
  fieldOfStudy: z.string().nullable().optional(),
  gpa: z.number().nullable().optional(),
  graduationDate: z.string().nullable().optional(), // ISO string
  preferredDestination: z.string().nullable().optional(),
  preferredProgram: z.string().nullable().optional(),
  preferredStudyLevel: z.enum(['BACHELORS', 'MASTERS', 'PHD', 'DIPLOMA']).nullable().optional(),
  preferredIntake: z.string().nullable().optional(),
  englishTest: z.string().nullable().optional(),
  englishScore: z.string().nullable().optional(),
  hasValidPassport: z.boolean().optional(),
  hasAcademicTranscripts: z.boolean().optional(),
  hasRecommendationLetters: z.boolean().optional(),
  hasPersonalStatement: z.boolean().optional(),
  workExperience: z.string().nullable().optional(),
  extraCurricular: z.string().nullable().optional(),
  careerGoals: z.string().nullable().optional(),
  referralSource: z.string().nullable().optional(),
  preferredContactMethod: z.string().nullable().optional(),
  bestTimeToContact: z.string().nullable().optional(),
  additionalQuestions: z.string().nullable().optional(),
  currentCountry: z.string().nullable().optional(),
  currentCity: z.string().nullable().optional(),
  budgetRange: z.string().nullable().optional(),
  scholarshipInterest: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
});

// Registration Response schema
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
