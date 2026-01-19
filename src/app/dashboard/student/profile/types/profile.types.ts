export interface PersonalInfo {
  fullName: string;
  studentId: string;
  status: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
}

export interface AcademicInfo {
  educationLevel: string;
  gpa: string;
  interestedPrograms: string[];
  preferredCountries: string[];
}

export interface StudentProfile {
  personal: PersonalInfo;
  academic: AcademicInfo;
}
