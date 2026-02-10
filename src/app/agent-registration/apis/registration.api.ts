import axiosInstance from '@/lib/axios';
import {
    createAgentDtoSchema,
    RegistrationResponseDto,
    AgentServiceType,
    AgentFeatureType
} from '../dtos/registration.dto';
import { AgentRegistrationData} from '../types/registration.types';

export const submitAgentRegistration = async (
    formData: AgentRegistrationData
): Promise<RegistrationResponseDto> => {
    try {
        // Map Frontend Data to DTO

        // Notes logic to capture extra info
        const notesParts = [];
        if (formData.openToPilotUsage) notesParts.push('Open to Pilot Usage: YES');
        // Map any other miscellaneous info if needed

        const dtoData: any = {
            // Identity
            legalName: formData.legalName,
            tradingName: formData.tradingName || null,
            agentName: formData.tradingName || formData.legalName, // Prefer trading name, fallback to legal
            countryOfRegistration: formData.countryOfRegistration,
            yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
            websiteUrl: formData.websiteUrl || null,
            officeAddress: formData.officeAddress,

            // Contact
            contactPersonName: formData.contactPersonName,
            designation: formData.designation || null,
            officialEmail: formData.officialEmail,
            phoneNumber: formData.phoneNumber,

            // Business
            businessRegistrationNumber: formData.businessRegistrationNumber,
            businessRegistrationCertificate: formData.businessRegistrationCertificate || null,
            officeAddressProof: formData.officeAddressProof || null,

            registeredWithEducationCouncils: formData.registeredWithEducationCouncils,
            workingWithUkInstitutions: formData.workingWithUkInstitutions,
            workingWithCanadaInstitutions: formData.workingWithCanadaInstitutions,
            workingWithAustraliaInstitutions: formData.workingWithAustraliaInstitutions,

            primaryStudentMarkets: formData.primaryStudentMarkets.length > 0 ? formData.primaryStudentMarkets : [],
            averageStudentsPerYearLast2Years: formData.averageStudentsPerYearLast2Years ? parseInt(formData.averageStudentsPerYearLast2Years) : null,
            mainDestinations: formData.mainDestinations.length > 0 ? formData.mainDestinations : [],

            typicalStudentProfileStrength: formData.typicalStudentProfileStrength || null,
            inHouseVisaSupport: formData.inHouseVisaSupport,
            numberOfCounsellors: formData.numberOfCounsellors ? parseInt(formData.numberOfCounsellors) : 0,

            // Services & Features (Map Strings to Enums)
            servicesProvided: formData.servicesProvided.length > 0
                ? formData.servicesProvided.map(s => s as unknown as AgentServiceType)
                : [],
            reasonToUseEdvios: formData.reasonToUseEdvios || null,
            interestedFeatures: formData.interestedFeatures.length > 0
                ? formData.interestedFeatures.map(f => f as unknown as AgentFeatureType)
                : [],

            // Internal / Extra
            notes: notesParts.length > 0 ? notesParts.join('\n') : null,
            agentTier: 'BASIC', // Default
        };

        // Validate using Zod
        const validation = createAgentDtoSchema.safeParse(dtoData);

        if (!validation.success) {
            const errorMessages = validation.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');
            throw new Error(`Validation failed: ${errorMessages}`);
        }

        console.log('Submitting agent registration:', validation.data);

        // Endpoint: POST /agents
        // Assuming backend endpoint is /agents based on user request "make folder for agent registration... @[edvios-be/src/agents]"
        const response = await axiosInstance.post<RegistrationResponseDto>(
            '/agents',
            validation.data
        );

        return response.data;
    } catch (error) {
        console.error('Agent Registration error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to submit registration. Please try again.');
    }
};
