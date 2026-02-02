import { z } from 'zod';
import { Availability, ProgramStatus } from '../enums';

export const programSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	university: z.string(),
	location: z.string(),
	countryCode: z.string(),
	ranking: z.string(),
	rating: z.number(),
	badges: z.array(z.string()),
	tags: z.array(z.string()),
	intake: z.string(),
	availability: z.nativeEnum(Availability),
	tuitionFee: z.string().optional(),
	englishTestScore: z.string().optional(),
	lastUpdated: z.string().optional(),
	applicationDeadline: z.string().optional(),
	ucasCode: z.string().optional(),
	scholarship: z.boolean().optional(),
	englishWaiver: z.boolean().optional(),
	popularityRank: z.number().int().optional(),
	status: z.nativeEnum(ProgramStatus).optional(),
	level: z.string().optional(),
	tuition: z.string(),
	applicationFee: z.string(),
	duration: z.string(),
	category: z.string(),
	degree: z.string(),
	updated: z.string(),
  // foreign keys and resolved fields
  institutionId: z.string().optional(),
  intakeId: z.string().optional(),
  subjectId: z.string().optional(),
  institutionType: z.string().optional(),
  institutionName: z.string().optional(),
  institutionCountry: z.string().optional(),
  institutionCity: z.string().optional(),
  subjectName: z.string().optional(),
  intakeName: z.string().optional(),
});

export type ProgramDto = z.infer<typeof programSchema>;
export type ProgramFormDto = Omit<ProgramDto, 'id'> & { id?: string };

export const defaultProgramForm: ProgramFormDto = {
	title: '',
	university: '',
	location: '',
	countryCode: 'UK',
	ranking: '',
	rating: 5,
	badges: [],
	tags: [],
	intake: '',
	availability: Availability.AVAILABLE,
	// prefer `tuitionFee` but keep legacy `tuition` in sync to avoid accidental
	// saves of the wrong key. Keep both undefined for truly-optional fields,
	// but keep empty strings for form-controlled fields elsewhere.
	tuitionFee: undefined,
	tuition: '',
	englishTestScore: undefined,
	scholarship: false,
	applicationDeadline: undefined,
	ucasCode: undefined,
	englishWaiver: false,
	popularityRank: 0,
	// Do not preselect `status` so the form validation forces user choice.
	status: undefined,
	// Use empty strings for form-controlled fields so validation behaves
	// consistently (the form treats `undefined` as missing).
	level: '',
	subjectId: '',
	subjectName: '',
	applicationFee: '',
	duration: '',
	category: '',
	degree: "Bachelor's Degree",
	// Keep both `updated` and `lastUpdated` present; backend mapping prefers
	// `updated` in some places while UI uses `lastUpdated`.
	lastUpdated: '',
	updated: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
};
