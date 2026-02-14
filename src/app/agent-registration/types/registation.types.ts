import { ServiceType, FeatureType } from '../enums/registration.enums';


export interface AgentRegistrationData {
    // Company Info
    legalName: string;
    tradingName: string;
    agentName: string;
    countryOfRegistration: string;
    yearEstablished: string; 
    websiteUrl: string;
    officeAddress: string;
    calendlyLink: string;

    // Contact Info
    contactPersonName: string;
    designation: string;
    officialEmail: string;
    phoneNumber: string;

    // Business Details
    businessRegistrationNumber: string;
    businessRegistrationCertificate: string; 
    officeAddressProof: string; 

    // Credentials
    registeredWithEducationCouncils: boolean;
    workingWithUkInstitutions: boolean;
    workingWithCanadaInstitutions: boolean;
    workingWithAustraliaInstitutions: boolean;

    // Market & Performance
    primaryStudentMarkets: string[];
    averageStudentsPerYearLast2Years: string;
    mainDestinations: string[];
    typicalStudentProfileStrength: string;
    inHouseVisaSupport: boolean;
    numberOfCounsellors: string; 

    // Services & Engagement
    servicesProvided: ServiceType[];
    reasonToUseEdvios: string;
    interestedFeatures: FeatureType[];

    openToPilotUsage: boolean; 

    // Legal
    termsAccepted: boolean;
    marketingConsent: boolean;
    notes?: string;
    agentTier?: string;
}

export interface AgentRegistrationResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
    };
}
