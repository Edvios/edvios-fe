import { z } from 'zod';
import { Availability, ProgramStatus } from '../enums';

// Single Zod schema that also provides sensible form defaults via `.default()`.
// Use `programSchema.parse({})` to obtain the default form object.
export const programSchema = z.object({
	id: z.string(),
	title: z.string().default(''),
	university: z.string().default(''),
	location: z.string().default(''),
	countryCode: z.string().default('UK'),
	ranking: z.string().default(''),
	rating: z.number().default(5),
	badges: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	intake: z.string().default(''),
	// Do not preselect availability — force user to choose in the form
	availability: z.nativeEnum(Availability).optional(),
	tuitionFee: z.string().optional(),
	englishTestScore: z.string().optional(),
	lastUpdated: z.string().optional().default(''),
	applicationDeadline: z.string().optional(),
	ucasCode: z.string().optional(),
	scholarship: z.boolean().optional().default(false),
	englishWaiver: z.boolean().optional().default(false),
	popularityRank: z.number().int().optional().default(0),
	status: z.nativeEnum(ProgramStatus).optional(),
	level: z.string().optional().default(''),
	tuition: z.string().default(''),
	applicationFee: z.string().default(''),
	duration: z.string().default(''),
	category: z.string().default(''),
	degree: z.string().default("Bachelor's Degree"),
	updated: z.string().default(new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })),
	// foreign keys and resolved fields
	institutionId: z.string().optional(),
	intakeId: z.string().optional(),
	subjectId: z.string().optional(),
	institutionType: z.string().optional(),
	institutionName: z.string().optional(),
	institutionCountry: z.string().optional(),
	institutionCity: z.string().optional(),
	subjectName: z.string().optional(),
	// keep intakeName optional as requested
	intakeName: z.string().optional(),
});

export type ProgramsResopnseDto = {
  data: ProgramDto[];
  page: number;
  size: number;
  total: number;
}

export type ProgramDto = z.infer<typeof programSchema>;
export type ProgramFormDto = ProgramDto;

export const defaultProgramForm: ProgramFormDto = programSchema.parse({});
