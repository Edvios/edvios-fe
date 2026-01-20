import {
    InitialProgramDataResponse,
    FilteredProgramDataResponse,
    ProgramFilterRequest,
    initialProgramDataResponseSchema,
    filteredProgramDataResponseSchema
} from '../dtos/program.dto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ProgramService {
    static async fetchInitialData(): Promise<InitialProgramDataResponse> {
        const response = await fetch(`${API_BASE_URL}/api/programs/initial`);
        if (!response.ok) {
            throw new Error('Failed to fetch initial program data');
        }
        const data = await response.json();
        return initialProgramDataResponseSchema.parse(data);
    }

    static async fetchFilteredPrograms(filters: ProgramFilterRequest): Promise<FilteredProgramDataResponse> {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const response = await fetch(`${API_BASE_URL}/api/programs/filtered?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch filtered programs');
        }
        const data = await response.json();
        return filteredProgramDataResponseSchema.parse(data);
    }
}