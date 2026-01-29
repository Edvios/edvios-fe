import { z } from 'zod';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';

const ApplicationStatusEnum = z.nativeEnum(ApplicationStatus);

export const ProgramSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  intakeId: z.string().optional(),
  duration: z.string().optional(),
  tuitionFee: z.string().optional(),
  applicationFee: z.string().optional(),
  englishTestScore: z.string().optional(),
  subjectId: z.string().optional(),
  scholarship: z.boolean().optional(),
  lastUpdated: z.string().optional(),
  applicationDeadline: z.string().optional(),
  ucasCode: z.string().optional(),
  englishWaiver: z.boolean().optional(),
  popularityRank: z.number().optional(),
  status: z.string().optional(),
  institutionId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  institution: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  intake: z.string().optional(),
  ranking: z.number().optional(),
});

export const StudentSchema = z.object({
  id: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  currentEducationLevel: z.string().nullable().optional(),
  currentInstitution: z.string().nullable().optional(),
  fieldOfStudy: z.string().nullable().optional(),
  gpa: z.number().nullable().optional(),
  graduationDate: z.string().nullable().optional(),
  preferredDestination: z.string().nullable().optional(),
  preferredProgram: z.string().nullable().optional(),
  preferredStudyLevel: z.string().nullable().optional(),
  preferredIntake: z.string().nullable().optional(),
  englishTest: z.string().nullable().optional(),
  englishScore: z.string().nullable().optional(),
  hasValidPassport: z.boolean().nullable().optional(),
  hasAcademicTranscripts: z.boolean().nullable().optional(),
  hasRecommendationLetters: z.boolean().nullable().optional(),
  hasPersonalStatement: z.boolean().nullable().optional(),
  workExperience: z.string().nullable().optional(),
  extraCurricular: z.string().nullable().optional(),
  careerGoals: z.string().nullable().optional(),
  referralSource: z.string().nullable().optional(),
  preferredContactMethod: z.string().nullable().optional(),
  bestTimeToContact: z.string().nullable().optional(),
  additionalQuestions: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  currentCountry: z.string().nullable().optional(),
  currentCity: z.string().nullable().optional(),
  budgetRange: z.string().nullable().optional(),
  scholarshipInterest: z.boolean().nullable().optional(),
  marketingConsent: z.boolean().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const CommentSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Comment cannot be empty'),
  author: z.string(),
  timestamp: z.string(),
});

export const ApplicationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  programId: z.string(),
  status: ApplicationStatusEnum,
  additionalNotes: z.string().nullable().optional(),
  preferredIntakeId: z.string().nullable().optional(),
  academicYear: z.string().nullable().optional(),
  appliedDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  student: StudentSchema,
  program: ProgramSchema,
  comments: z.array(CommentSchema).optional().default([]),
});

export const UpdateStatusSchema = z.object({
  status: ApplicationStatusEnum,
});

export const SendCommentSchema = z.object({
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment is too long'),
});

export type ApplicationDto = z.infer<typeof ApplicationSchema>;
export type UpdateStatusPayload = z.infer<typeof UpdateStatusSchema>;
export type SendCommentPayload = z.infer<typeof SendCommentSchema>;