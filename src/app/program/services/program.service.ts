import {
  InitialProgramDataResponse,
  FilteredProgramDataResponse,
  ProgramFilterRequest,
  initialProgramDataResponseSchema,
  filteredProgramDataResponseSchema,
  BackendInitialProgramDataResponse,
  backendInitialProgramDataResponseSchema,
  BackendFilteredProgramResponse,
  backendFilteredProgramResponseSchema,
  BackendProgram,
} from "../dtos/program.dto";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ProgramService {
  static async fetchInitialData(): Promise<InitialProgramDataResponse> {
    const response = await fetch(`${API_BASE_URL}/api/pai/programs`);

    if (!response.ok) {
      throw new Error("Failed to fetch initial program data");
    }

    const backendData: BackendInitialProgramDataResponse =
      backendInitialProgramDataResponseSchema.parse(await response.json());

    const transformedData: InitialProgramDataResponse = {
      institutions: backendData.institutes,
      countries: [],
      levels: [],
      intakes: backendData.intakes,
      subjects: backendData.subjects,
      programs: [],
      pagination: {
        page: 1,
        size: 12,
        total: 0,
      },
    };

    return initialProgramDataResponseSchema.parse(transformedData);
  }

  static async fetchFilteredPrograms(
    filters: ProgramFilterRequest
  ): Promise<FilteredProgramDataResponse> {
    const { page, size, ...filterBody } = filters;

    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (size) queryParams.append("size", size.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/pai/programs/filter?${queryParams}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterBody),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch filtered programs");
    }

    const backendData: BackendFilteredProgramResponse =
      backendFilteredProgramResponseSchema.parse(await response.json());

    const transformedData = {
      programs: backendData.data.map((program: BackendProgram) => ({
        id: program.id,
        title: program.title,
        institution: program.institution?.name ?? "",
        location: program.institution?.city ?? "",
        country: program.institution?.country ?? "",
        level: program.level,
        intake: program.intake?.name ?? "",
        duration: program.duration,
        tuitionFee: program.tuitionFee,
        applicationFee: program.applicationFee,
        englishTestScore: program.englishTestScore,
        status: program.status.toLowerCase(),
        subject: program.subject?.name ?? "",
        ranking: program.institution?.ranking ?? 0,
        scholarship: program.scholarship,
        lastUpdated: program.lastUpdated,
        applicationDeadline: program.applicationDeadline,
        ucasCode: program.ucasCode,
        englishWaiver: program.englishWaiver,
        popularityRank: program.popularityRank,
      })),
      pagination: {
        page: backendData.page,
        size: backendData.size,
        total: backendData.total,
      },
    };

    return filteredProgramDataResponseSchema.parse(transformedData);
  }
}
