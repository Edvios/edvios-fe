
import axiosInstance from "@/lib/axios";
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
  ProgramApplicationRequest,
} from "../dtos/program.dto";

export class ProgramService {

  static async fetchInitialData(): Promise<InitialProgramDataResponse> {
    try {
      const response = await axiosInstance.get<BackendInitialProgramDataResponse>(
        "/pai/programs"
      );

      const result = backendInitialProgramDataResponseSchema.safeParse(response.data);
      if (!result.success) {
        console.error("Initial backend schema validation failed:", result.error.format());
        throw new Error("Initial backend schema validation failed");
      }

      const backendData = result.data;
      const programs = backendData.data;

      const institutionsMap = new Map<string, { id: string; name: string }>();
      const intakesMap = new Map<string, { id: string; name: string }>();
      const subjectsMap = new Map<string, { id: string; name: string }>();
      const countriesSet = new Set<string>();
      const levelsSet = new Set<string>();

      programs.forEach((p) => {
        if (p.institution?.id && p.institution?.name) {
          institutionsMap.set(p.institution.id, { id: p.institution.id, name: p.institution.name });
          if (p.institution.country) countriesSet.add(p.institution.country);
        }
        if (p.intake?.id && p.intake?.name) intakesMap.set(p.intake.id, { id: p.intake.id, name: p.intake.name });
        if (p.subject?.id && p.subject?.name) subjectsMap.set(p.subject.id, { id: p.subject.id, name: p.subject.name });
        if (p.level) levelsSet.add(p.level);
      });

      const transformedData: InitialProgramDataResponse = {
        institutions: Array.from(institutionsMap.values()),
        countries: Array.from(countriesSet),
        levels: Array.from(levelsSet),
        intakes: Array.from(intakesMap.values()),
        subjects: Array.from(subjectsMap.values()),
        programs: programs.map(mapBackendProgramToFrontend),
        pagination: {
          page: backendData.page,
          size: backendData.size,
          total: backendData.total,
        },
      };

      return initialProgramDataResponseSchema.parse(transformedData);
    } catch (error) {
      console.error("Failed to fetch initial program data:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch initial program data");
    }
  }


  static async fetchFilteredPrograms(
    filters: ProgramFilterRequest
  ): Promise<FilteredProgramDataResponse> {
    try {
      const { page, size, ...filterBody } = filters;

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (size) queryParams.append("size", size.toString());

      const cleanedFilterBody = Object.fromEntries(
        Object.entries(filterBody).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
      );



      const response = await axiosInstance.post<BackendFilteredProgramResponse>(
        `/pai/programs/filter?${queryParams}`,
        cleanedFilterBody
      );



      const parsed = backendFilteredProgramResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        console.error("Filtered backend schema validation failed:", parsed.error.format());
        throw new Error("Filtered backend schema validation failed");
      }

      const backendData = parsed.data;


      const transformedData: FilteredProgramDataResponse = {
        programs: backendData.data.map(mapBackendProgramToFrontend),
        pagination: {
          page: backendData.page,
          size: backendData.size ?? backendData.data.length,
          total: backendData.total,
        },
      };

      return filteredProgramDataResponseSchema.parse(transformedData);
    } catch (error) {
      console.error("Failed to fetch filtered programs:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch filtered programs");
    }
  }

  static async applyToProgram(data: ProgramApplicationRequest): Promise<{ success: boolean; message: string }> {
    try {


      const response = await axiosInstance.post("/applications", data);
      return response.data;
    } catch (error) {
      console.error("Failed to submit application:", error);
      throw new Error("Failed to submit application. Please try again later.");
    }
  }
}

function mapBackendProgramToFrontend(program: BackendProgram) {
  const normalizeStatus = (status?: string | null): "available" | "closed" | "waitlist" | "deadline_passed" => {
    if (!status) return "available";

    const normalized = status.toLowerCase().trim();
    const validStatuses = ["available", "closed", "waitlist", "deadline_passed"];

    if (validStatuses.includes(normalized)) {
      return normalized as "available" | "closed" | "waitlist" | "deadline_passed";
    }

    switch (normalized) {
      case "open":
      case "active":
        return "available";
      case "full":
      case "inactive":
        return "closed";
      case "waiting":
      case "wait_list":
        return "waitlist";
      case "expired":
      case "deadline_expired":
        return "deadline_passed";
      default:
        console.warn(`Unknown program status "${status}", defaulting to "available"`);
        return "available";
    }
  };

  return {
    id: program.id,
    title: program.title,
    institution: program.institution?.name ?? "",
    location: program.institution?.city ?? "",
    country: program.institution?.country ?? "",
    level: program.level ?? "",
    intake: program.intake?.name ?? "",
    duration: program.duration ?? "",
    tuitionFee: program.tuitionFee ?? "",
    applicationFee: program.applicationFee ?? "",
    englishTestScore: program.englishTestScore ?? "",
    status: normalizeStatus(program.status),
    subject: program.subject?.name ?? "",
    ranking: 0,
    scholarship: program.scholarship ?? false,
    lastUpdated: program.lastUpdated ?? "",
    applicationDeadline: program.applicationDeadline ?? "",
    ucasCode: program.ucasCode ?? undefined,
    englishWaiver: program.englishWaiver ?? undefined,
    popularityRank: program.popularityRank ?? undefined,
  };
}


