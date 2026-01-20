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

export interface ProgramFilters {
    institution: string;
    studyLevel: string;
    subject: string;
    scholarship: string; // 'all' | 'yes' | 'no'
    intake: string;
    tuitionFeeMin: string;
    tuitionFeeMax: string;
    englishWaiver: string; // 'all' | 'yes' | 'no'
    searchTerm: string;
}
