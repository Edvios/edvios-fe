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
    status: 'available' | 'closed' | 'waitlist';
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
    search: string;
    institutionId: string;
    country: string;
    level: string;
    intake: string;
    subjectArea: string;
    scholarshipAvailable: string; // 'all' | 'yes' | 'no'
    englishWaiver: string; // 'all' | 'yes' | 'no'
    page: number;
    size: number;
}

export interface InitialProgramData {
    institutions: Institution[];
    countries: string[];
    levels: string[];
    intakes: string[];
    subjects: string[];
    programs: Program[];
    pagination: Pagination;
}

export interface FilteredProgramData {
    programs: Program[];
    pagination: Pagination;
}
