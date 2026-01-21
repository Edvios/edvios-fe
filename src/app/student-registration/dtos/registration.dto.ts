import { z } from 'zod';

// Personal Information schema
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  currentCountry: z.string().optional().or(z.literal('')),
  currentCity: z.string().optional().or(z.literal('')),
});

// Academic Background schema
const academicBackgroundSchema = z.object({
  currentEducationLevel: z
    .string()
    .min(1, 'Education level is required'),
  currentInstitution: z.string().optional().or(z.literal('')),
  fieldOfStudy: z
    .string()
    .min(1, 'Field of study is required'),
  gpa: z.string().optional().or(z.literal('')),
  graduationDate: z.string().optional().or(z.literal('')),
  englishProficiency: z.string().optional().or(z.literal('')),
  ieltsScore: z.string().optional().or(z.literal('')),
  toeflScore: z.string().optional().or(z.literal('')),
});

// Study Preferences schema
const studyPreferencesSchema = z.object({
  preferredDestination: z
    .string()
    .min(1, 'Preferred destination is required'),
  preferredProgram: z
    .string()
    .min(1, 'Preferred program is required'),
  studyLevel: z
    .string()
    .min(1, 'Study level is required'),
  preferredIntake: z.string().optional().or(z.literal('')),
  budgetRange: z.string().optional().or(z.literal('')),
  scholarshipInterest: z.boolean(),
});

// Document Readiness schema
const documentReadinessSchema = z.object({
  hasPassport: z.boolean(),
  hasTranscripts: z.boolean(),
  hasRecommendationLetters: z.boolean(),
  hasPersonalStatement: z.boolean(),
  workExperience: z.string().optional().or(z.literal('')),
  extracurriculars: z.string().optional().or(z.literal('')),
  careerGoals: z.string().optional().or(z.literal('')),
});

// Additional Information schema
const additionalInfoSchema = z.object({
  howDidYouHear: z.string().optional().or(z.literal('')),
  additionalRequirements: z.string().optional().or(z.literal('')),
  preferredContactMethod: z.string().optional().or(z.literal('')),
  bestTimeToContact: z.string().optional().or(z.literal('')),
  marketingConsent: z.boolean(),
  termsAccepted: z.boolean(),
}).refine(
  (data) => data.termsAccepted === true,
  {
    message: 'You must accept the terms and conditions',
    path: ['termsAccepted'],
  }
);

// Student Registration Data schema (flat structure from form)
export const STUDENTRegistrationDataSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10),
  dateOfBirth: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  currentCountry: z.string().optional().or(z.literal('')),
  currentCity: z.string().optional().or(z.literal('')),
  currentEducationLevel: z.string().min(1),
  currentInstitution: z.string().optional().or(z.literal('')),
  fieldOfStudy: z.string().min(1),
  gpa: z.string().optional().or(z.literal('')),
  graduationDate: z.string().optional().or(z.literal('')),
  englishProficiency: z.string().optional().or(z.literal('')),
  ieltsScore: z.string().optional().or(z.literal('')),
  toeflScore: z.string().optional().or(z.literal('')),
  preferredDestination: z.string().min(1),
  preferredProgram: z.string().min(1),
  studyLevel: z.string().min(1),
  preferredIntake: z.string().optional().or(z.literal('')),
  budgetRange: z.string().optional().or(z.literal('')),
  scholarshipInterest: z.boolean(),
  hasPassport: z.boolean(),
  hasTranscripts: z.boolean(),
  hasRecommendationLetters: z.boolean(),
  hasPersonalStatement: z.boolean(),
  workExperience: z.string().optional().or(z.literal('')),
  extracurriculars: z.string().optional().or(z.literal('')),
  careerGoals: z.string().optional().or(z.literal('')),
  howDidYouHear: z.string().optional().or(z.literal('')),
  additionalRequirements: z.string().optional().or(z.literal('')),
  preferredContactMethod: z.string().optional().or(z.literal('')),
  bestTimeToContact: z.string().optional().or(z.literal('')),
  marketingConsent: z.boolean(),
  termsAccepted: z.boolean(),
});

// Student Registration DTO schema (structured for API)
export const STUDENTRegistrationDtoSchema = z.object({
  personalInfo: personalInfoSchema,
  academicBackground: academicBackgroundSchema,
  studyPreferences: studyPreferencesSchema,
  documentReadiness: documentReadinessSchema,
  additionalInfo: additionalInfoSchema,
});

// Registration Response schema
export const registrationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    registrationId: z.string(),
    STUDENTId: z.string(),
  }).optional(),
});

// Type exports
export type PersonalInfoDto = z.infer<typeof personalInfoSchema>;
export type AcademicBackgroundDto = z.infer<typeof academicBackgroundSchema>;
export type StudyPreferencesDto = z.infer<typeof studyPreferencesSchema>;
export type DocumentReadinessDto = z.infer<typeof documentReadinessSchema>;
export type AdditionalInfoDto = z.infer<typeof additionalInfoSchema>;
export type StudentRegistrationDataDto = z.infer<typeof STUDENTRegistrationDataSchema>;
export type StudentRegistrationDto = z.infer<typeof STUDENTRegistrationDtoSchema>;
export type RegistrationResponseDto = z.infer<typeof registrationResponseSchema>;
