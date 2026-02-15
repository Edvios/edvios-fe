export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum EnglishTestType {
  IELTS = 'IELTS',
  TOEFL = 'TOEFL',
  PTE = 'PTE',
  DUOLINGO = 'DUOLINGO',
  OTHER = 'OTHER',
  NONE = 'NONE',
}

export enum StudyLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  DOCTORATE = 'DOCTORATE',
  DIPLOMA = 'DIPLOMA',
  OTHER = 'OTHER',
}

export enum FundingSource {
  SELF_FUNDED = 'SELF_FUNDED',
  SCHOLARSHIP = 'SCHOLARSHIP',
  SPONSORED = 'SPONSORED',
  LOAN = 'LOAN',
}

export enum VisaRiskBand {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Student {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Personal info
  firstName: string;
  lastName: string;
  dob: string;
  gender?: Gender | null;
  nationality: string;
  passportNumber: string;
  passportExpiryDate: string;
  countryOfResidence: string;

  // Contact
  email: string;
  phone: string;
  emergencyContact: string;

  // Academic background
  highestQualification: string;
  yearOfCompletion?: number | null;
  institutionName: string;
  mediumOfInstruction?: string | null;
  gradesSummary?: string | null;
  academicCertificates?: string[];

  // English test
  englishTestTaken?: EnglishTestType;
  overallScore?: number | null;
  testExpiryDate?: string | null;

  // Study preferences
  intendedIntakeMonth?: number | null;
  intendedIntakeYear?: number | null;
  preferredCountries?: string[];
  preferredStudyLevel?: StudyLevel | null;
  preferredFieldOfStudy: string;

  // Financial
  estimatedBudget?: number | null;
  fundingSource?: FundingSource | null;

  // Visa / immigration
  previousVisaRefusal?: boolean;
  visaRefusalDetails?: string | null;
  travelHistory?: string | null;
  ongoingImmigrationApps?: string | null;

  // Internal / assessment
  academicFit?: string | null;
  visaRiskBand?: VisaRiskBand | null;
  notes?: string | null;

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
  countryOfResidence?: string;
}