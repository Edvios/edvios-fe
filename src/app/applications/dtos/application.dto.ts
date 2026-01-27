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
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  nationality: z.string().optional(),
  currentEducationLevel: z.string().optional(),
  currentInstitution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  gpa: z.number().nullable().optional(),
  graduationDate: z.string().nullable().optional(),
  preferredDestination: z.string().optional(),
  preferredProgram: z.string().optional(),
  preferredStudyLevel: z.string().optional(),
  preferredIntake: z.string().optional(),
  englishTest: z.string().optional(),
  englishScore: z.string().optional(),
  hasValidPassport: z.boolean().optional(),
  hasAcademicTranscripts: z.boolean().optional(),
  hasRecommendationLetters: z.boolean().optional(),
  hasPersonalStatement: z.boolean().optional(),
  workExperience: z.string().optional(),
  extraCurricular: z.string().optional(),
  careerGoals: z.string().optional(),
  referralSource: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  bestTimeToContact: z.string().optional(),
  additionalQuestions: z.string().optional(),
  dob: z.string().optional(),
  currentCountry: z.string().optional(),
  currentCity: z.string().optional(),
  budgetRange: z.string().optional(),
  scholarshipInterest: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
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