export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export enum EnglishTestType {
    IELTS = 'IELTS',
    PTE = 'PTE',
    DUOLINGO = 'DUOLINGO',
    NONE = 'NONE',
}

export enum StudyLevel {
    BACHELORS = 'BACHELORS',
    MASTERS = 'MASTERS',
    PHD = 'PHD',
    DIPLOMA = 'DIPLOMA',
    CERTIFICATE = 'CERTIFICATE',
}


export enum FundingSource {
    SELF = 'SELF',
    PARENTS = 'PARENTS',
    SPONSOR = 'SPONSOR',
    LOAN = 'LOAN',
    SCHOLARSHIP = 'SCHOLARSHIP',
}


export enum VisaRiskBand {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface StudentProfileData {
    user?: UserProfile;
    id?: string;

    // Personal info
    firstName?: string | null;
    lastName?: string | null;
    dob?: string;
    gender?: Gender | null;
    nationality?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
    countryOfResidence?: string;

    // Contact
    email?: string;
    phone?: string;
    emergencyContact?: string;

    // Academic background
    highestQualification?: string;
    yearOfCompletion?: number | null;
    institutionName?: string;
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
    preferredFieldOfStudy?: string;

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
}
