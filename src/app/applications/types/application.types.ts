import { ApplicationStatus } from '@/app/applications/enums/application.enum';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  nationality?: string;
  currentEducationLevel?: string;
  currentInstitution?: string;
  fieldOfStudy?: string;
  gpa?: number | null;
  graduationDate?: string | null;
  preferredDestination?: string;
  preferredProgram?: string;
  preferredStudyLevel?: string;
  preferredIntake?: string;
  englishTest?: string;
  englishScore?: string;
  hasValidPassport?: boolean;
  hasAcademicTranscripts?: boolean;
  hasRecommendationLetters?: boolean;
  hasPersonalStatement?: boolean;
  workExperience?: string;
  extraCurricular?: string;
  careerGoals?: string;
  referralSource?: string;
  preferredContactMethod?: string;
  bestTimeToContact?: string;
  additionalQuestions?: string;
  dob?: string;
  currentCountry?: string;
  currentCity?: string;
  budgetRange?: string;
  scholarshipInterest?: boolean;
  marketingConsent?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
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
  comments: Comment[];
}

export interface UserSession {
  user: Student;
  token?: string;
  role?: 'student' | 'admin';
}