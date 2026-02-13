export enum FeatureType {
    AI_MATCHING= 'AI_MATCHING',
    VISA_RISK = 'VISA_RISK',
    CRM = 'CRM',
    ANALYTICS = 'ANALYTICS',
    DOCUMENT_MANAGEMENT = 'DOCUMENT_MANAGEMENT',
}


export enum ServiceType {
    ADMISSIONS = 'ADMISSIONS',
    VISA = 'VISA',
    END_TO_END = 'END_TO_END'
}

export interface AgentProfileData {
    id?: string;

    // Company information
    legalName?: string;
    tradingName?: string | null;
    agentName?: string;
    calendlyLink?: string | null;
    countryOfRegistration?: string;
    yearEstablished?: number | null;
    websiteUrl?: string | null;

    // Contact information
    officeAddress?: string;
    contactPersonName?: string;
    designation?: string | null;
    officialEmail?: string;
    phoneNumber?: string;

    // Registration documents
    businessRegistrationNumber?: string;
    businessRegistrationCertificate?: string | null;
    officeAddressProof?: string | null;

    // Partnerships & accreditations
    registeredWithEducationCouncils?: boolean;
    workingWithUkInstitutions?: boolean;
    workingWithCanadaInstitutions?: boolean;
    workingWithAustraliaInstitutions?: boolean;

    // Business details
    primaryStudentMarkets?: string[];
    averageStudentsPerYearLast2Years?: number | null;
    mainDestinations?: string[];
    typicalStudentProfileStrength?: string | null;

    // Services
    inHouseVisaSupport?: boolean;
    numberOfCounsellors?: number;
    servicesProvided?: ServiceType[];

    // Platform usage
    reasonToUseEdvios?: string | null;
    interestedFeatures?: FeatureType[];
    agentTier?: string;
    notes?: string | null;
}
