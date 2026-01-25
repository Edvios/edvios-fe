export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentCountry?: string;
  currentCity?: string;
  role: string;
  createdAt: string;
  updatedAt: string;

  // These fields come from the student profile (if joined/fetched)
  nationality?: string;
  currentEducationLevel?: string;
  currentInstitution?: string;
  fieldOfStudy?: string;
  gpa?: string;
  graduationDate?: string;
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
  budgetRange?: string;
  scholarshipInterest?: boolean;
  marketingConsent?: boolean;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}


export interface StudentFilters {
  search?: string;
  country?: string;
  page?: number;
  pageSize?: number;
}

export interface StudentResponse {
  students: Student[];
  total: number;
  page: number;
  size: number;
}

export interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  currentCountry?: string;
  currentCity?: string;
}