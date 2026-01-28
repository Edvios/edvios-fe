export interface Program {
    id: string;
    title: string;
    institution: string;
    location: string;
    country: string;
    level: string;
    intake: string;
    duration: string;
    tuitionFee: string;
    applicationFee: string;
    englishTestScore: string;
    status: 'available' | 'closed' | 'waitlist' | 'deadline_passed';
    subject: string;
    ranking: number;
    scholarship: boolean;
    lastUpdated: string;
    applicationDeadline: string;
    ucasCode?: string;
    englishWaiver?: boolean;
    popularityRank?: number;
}

export interface Institution {
    id: string;
    name: string;
}

export interface Pagination {
    page: number;
    size: number;
    total: number;
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
    page?: number;
    size?: number;
}

export interface Intake {
    id: string;
    name: string;
}

export interface Subject {
    id: string;
    name: string;
}

export interface InitialProgramData {
    institutions: Institution[];
    countries: string[];
    levels: string[];
    intakes: Intake[];
    subjects: Subject[];
    programs: Program[];
    pagination: Pagination;
}

export interface FilteredProgramData {
    programs: Program[];
    pagination: Pagination;
}
