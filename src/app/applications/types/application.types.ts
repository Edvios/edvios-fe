import { ApplicationStatus } from '@/app/applications/enums/application.enum';

export interface Student {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationality?: string | null;
  currentEducationLevel?: string | null;
  currentInstitution?: string | null;
  fieldOfStudy?: string | null;
  gpa?: number | null;
  graduationDate?: string | null;
  preferredDestination?: string | null;
  preferredProgram?: string | null;
  preferredStudyLevel?: string | null;
  preferredIntake?: string | null;
  englishTest?: string | null;
  englishScore?: string | null;
  hasValidPassport?: boolean | null;
  hasAcademicTranscripts?: boolean | null;
  hasRecommendationLetters?: boolean | null;
  hasPersonalStatement?: boolean | null;
  workExperience?: string | null;
  extraCurricular?: string | null;
  careerGoals?: string | null;
  referralSource?: string | null;
  preferredContactMethod?: string | null;
  bestTimeToContact?: string | null;
  additionalQuestions?: string | null;
  dob?: string | null;
  currentCountry?: string | null;
  currentCity?: string | null;
  budgetRange?: string | null;
  scholarshipInterest?: boolean | null;
  marketingConsent?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Program {
  id: string;
  title: string;
  level: string;
  intakeId?: string;
  intake?: string;
  duration?: string;
  tuitionFee?: string;
  applicationFee?: string;
  englishTestScore?: string;
  subjectId?: string;
  subject?: string;
  scholarship?: boolean;
  lastUpdated?: string;
  applicationDeadline?: string;
  ucasCode?: string;
  englishWaiver?: boolean;
  popularityRank?: number;
  status?: string;
  institutionId?: string;
  institution?: string;
  location?: string;
  country?: string;
  ranking?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PreferredIntake {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  programId: string;
  status: ApplicationStatus;
  additionalNotes?: string | null;
  preferredIntakeId?: string | null;
  academicYear?: string | null;
  appliedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  student: Student;
  program: Program;
  preferredIntake?: PreferredIntake;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  status?: ApplicationStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
}

export interface UserSession {
  user: Student;
  token?: string;
  role?: 'student' | 'admin';
}