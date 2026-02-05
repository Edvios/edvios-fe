import { Availability, StudyLevel, ProgramStatus } from '../enums';
import type { ProgramFormDto } from '../dtos/program.dto';
export { Availability, StudyLevel, ProgramStatus };

export interface Institution {
  id: string;
  name: string;
  type: string;
  country: string;
  city: string;
  ranking?: number;
  establishedYear?: number;
  totalStudents?: number;
  internationalStudents?: number;
  programsCount?: number;
  tuitionRange?: string;
  status?: string;
  partnership?: string;
  contactEmail?: string;
  website?: string;
  logo?: string;
  description?: string;
  specialties?: string[];
  accreditations?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Intake {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Program = {
  id: string;
  title: string;
  level?: string;
  intakeId?: string;
  duration?: string;
  tuitionFee?: string;
  applicationFee?: string;
  englishTestScore?: string;
  subjectId?: string;
  scholarship?: boolean;
  scholarshipAvailable?: boolean;
  lastUpdated?: string;
  applicationDeadline?: string;
  ucasCode?: string;
  englishWaiver?: boolean;
  popularityRank?: number;
  status?: ProgramStatus | string;
  institutionId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Nested relations from backend
  institution?: Institution;
  intake?: Intake;
  subject?: Subject;
  
  // Legacy fields for backward compatibility
  university?: string;
  location?: string;
  countryCode?: string;
  ranking?: string | number;
  rating?: number;
  badges?: string[];
  tags?: string[];
  availability?: Availability;
  tuition?: string;
  category?: string;
  degree?: string;
  updated?: string;
  raw?: Record<string, unknown>;
  
  // Computed/mapped values for easy access
  institutionType?: string;
  institutionName?: string;
  institutionCountry?: string;
  institutionCity?: string;
  institutionLabel?: string;
  institutionLocation?: string;
  subjectName?: string;
  intakeName?: string;
};

export interface ProgramFormProps {
  program?: Program;
  onSave: (data: ProgramFormDto) => void;
  onClose: () => void;
}

export interface ProgramFilters {
  search?: string;
  institutionId?: string;
  country?: string;
  level?: string;
  intake?: string;
  subjectArea?: string;
  scholarshipAvailable?: boolean;
  englishWaiver?: boolean;
}

export type ProgramsResponse = {
  data: Program[];
  page: number;
  size: number;
  total: number;
}
