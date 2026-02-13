import { z } from 'zod';
import { AgentServiceType, AgentFeatureType } from '../enums/registration.enums';


export const createAgentDtoSchema = z.object({
    legalName: z.string().min(1, "Legal Name is required"),
    tradingName: z.string().nullable().optional(),
    agentName: z.string().optional(), 

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
export { AgentFeatureType, AgentServiceType };

