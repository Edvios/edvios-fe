export enum ServiceType {
    ADMISSIONS = 'ADMISSIONS',
    VISA = 'VISA',
    END_TO_END = 'END_TO_END',
}

export enum FeatureType {
    AI_MATCHING = 'AI_MATCHING',
    VISA_RISK = 'VISA_RISK',
    CRM = 'CRM',
    ANALYTICS = 'ANALYTICS',
    DOCUMENT_MANAGEMENT = 'DOCUMENT_MANAGEMENT',
}

export interface AgentRegistrationData {
    // Company Info
    legalName: string;
    tradingName: string;
    countryOfRegistration: string;
    yearEstablished: string; // Input as string, convert to number
    websiteUrl: string;
    officeAddress: string;

    // Contact Info
    contactPersonName: string;
    designation: string;
    officialEmail: string;
    phoneNumber: string;

    // Business Details
    businessRegistrationNumber: string;
    businessRegistrationCertificate: string; // URL or File Ref
    officeAddressProof: string; // URL or File Ref

    // Credentials
    registeredWithEducationCouncils: boolean;
    workingWithUkInstitutions: boolean;
    workingWithCanadaInstitutions: boolean;
    workingWithAustraliaInstitutions: boolean;

    // Market & Performance
    primaryStudentMarkets: string[];
    averageStudentsPerYearLast2Years: string; // Input as string, convert to number
    mainDestinations: string[];
    typicalStudentProfileStrength: string;
    inHouseVisaSupport: boolean;
    numberOfCounsellors: string; // Input as string, convert to number

    // Services & Engagement
    servicesProvided: ServiceType[];
    reasonToUseEdvios: string;
    interestedFeatures: FeatureType[];

    openToPilotUsage: boolean; // Not in backend DTO? Will map to notes.

    // Legal
    termsAccepted: boolean;
    marketingConsent: boolean;
}

export interface AgentRegistrationResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
    };
}
