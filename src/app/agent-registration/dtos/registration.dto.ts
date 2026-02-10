import { z } from 'zod';

export enum AgentServiceType {
    ADMISSIONS = 'ADMISSIONS',
    VISA = 'VISA', // Note: Check backend enum value, usually uppercase
    END_TO_END = 'END_TO_END',
}

export enum AgentFeatureType {
    AI_MATCHING = 'AI_MATCHING',
    VISA_RISK = 'VISA_RISK',
    CRM = 'CRM',
    ANALYTICS = 'ANALYTICS',
    DOCUMENT_MANAGEMENT = 'DOCUMENT_MANAGEMENT',
}

// Create Agent DTO schema matching backend
export const createAgentDtoSchema = z.object({
    legalName: z.string().min(1, "Legal Name is required"),
    tradingName: z.string().nullable().optional(),
    agentName: z.string().optional(), // Often derived from legal/trading or input separately? Backend requires it. I will map it to legalName or contactPerson if not distinct.
    // Actually backend DTO has `agentName` @IsNotEmpty(). user prompt didn't list it separately from "Agency Legal Name" / "Trading Name". 
    // I'll assume `agentName` is the name of the agency, so `legalName`. I'll map `agentName` = `legalName` or `tradingName` in API.

    calendlyLink: z.string().nullable().optional(),
    countryOfRegistration: z.string().min(1, "Country is required"),
    yearEstablished: z.number().nullable().optional(),
    websiteUrl: z.string().nullable().optional(),
    officeAddress: z.string().min(1, "Address is required"),
    contactPersonName: z.string().min(1, "Contact Person is required"),
    designation: z.string().nullable().optional(),
    officialEmail: z.string().email("Invalid email").min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone is required"),

    businessRegistrationNumber: z.string().min(1, "Registration Number is required"),
    businessRegistrationCertificate: z.string().nullable().optional(), // URL
    officeAddressProof: z.string().nullable().optional(), // URL

    registeredWithEducationCouncils: z.boolean().optional(),
    workingWithUkInstitutions: z.boolean().optional(),
    workingWithCanadaInstitutions: z.boolean().optional(),
    workingWithAustraliaInstitutions: z.boolean().optional(),

    primaryStudentMarkets: z.array(z.string()).optional(),
    averageStudentsPerYearLast2Years: z.number().nullable().optional(),
    mainDestinations: z.array(z.string()).optional(),

    typicalStudentProfileStrength: z.string().nullable().optional(),
    inHouseVisaSupport: z.boolean().optional(),
    numberOfCounsellors: z.number().optional(),

    servicesProvided: z.array(z.nativeEnum(AgentServiceType)).optional(),
    reasonToUseEdvios: z.string().nullable().optional(),
    interestedFeatures: z.array(z.nativeEnum(AgentFeatureType)).optional(),

    agentTier: z.string().optional(),
    notes: z.string().nullable().optional(),
});

export const registrationResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        id: z.string(),
    }).optional(),
});

export type CreateAgentDto = z.infer<typeof createAgentDtoSchema>;
export type RegistrationResponseDto = z.infer<typeof registrationResponseSchema>;
