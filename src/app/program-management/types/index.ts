import { Availability, StudyLevel, ProgramStatus } from '../enums';
import type { ProgramFormDto } from '../dtos/program.dto';
export { Availability, StudyLevel, ProgramStatus };

export type Program = {
  id: string;
  title: string;                    // e.g. "Bachelor of Arts in Philosophy, Politics and Economics (PPE)"
  university: string;
  location: string;                 // e.g. "Oxford, UK"
  countryCode: string;              // e.g. "UK"
  ranking: string;                  // e.g. "UK #1", "Popular #1"
  rating: number;                   // 1–5
  badges: string[];                 // e.g. ["Instant Submission", "Scholarships Available", "Prime", "Popular"]
  tags: string[];                   // e.g. ["Fast Acceptance", "L0V0"]
  intake: string;                   // e.g. "October 2025 intake"
  availability?: Availability;
  tuition: string;                  // e.g. "£10,015 GBP" or "£37,380–£62,820"
  tuitionFee?: string;              // optional extra tuition fee field from DB
  englishTestScore?: string;        // e.g. "IELTS 6.5"
  level?: string;               // free-form level (or map to StudyLevel when appropriate)
  applicationFee: string;           // e.g. "Free" or "£75"
  duration: string;                 // e.g. "36 months"
  category: string;                 // e.g. "Social Sciences"
  degree: string;                   // e.g. "Bachelor's Degree"
  scholarship?: boolean;            // whether scholarships are available
  lastUpdated?: string;             // optional timestamp string
  applicationDeadline?: string;     // optional timestamp string
  ucasCode?: string;                // UCAS code (text)
  updated: string;                  // e.g. "Updated 1/23/2026"
  englishWaiver?: boolean;
  popularityRank?: number;
  status?: ProgramStatus; // e.g. 'draft' | 'published' | 'archived'
  // original raw row from the database (optional) - helps render any extra columns
  raw?: Record<string, unknown>;
  // foreign keys (if present in programs table)
  institutionId?: string;
  intakeId?: string;
  subjectId?: string;

  // resolved/mapped values from related tables
  institutionType?: string; // e.g. "University", "College"
  institutionName?: string;
  institutionCountry?: string;
  institutionCity?: string;
  institutionLabel?: string; // combined or raw institution.label/institution field
  institutionLocation?: string; // location value from institutions table
  subjectName?: string;
  intakeName?: string;
};

export interface ProgramFormProps {
  program?: Program;
  onSave: (data: ProgramFormDto) => void;
  onClose: () => void;
}

export type { };

export interface Institution {
  id: string;
  name: string;
  country?: string;
  ranking?: string | number;
}

export interface Intake {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}
