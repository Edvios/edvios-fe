/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Program } from '../types';
import type { ProgramFormDto } from '../dtos/program.dto';
import { Availability } from '../types';
import axiosInstance from '@/lib/axios';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

function mapRowToProgram(r: any): Program {
  const inst = r.institution ?? {};
  const institutionLabel = String(inst.institution ?? inst.label ?? inst.name ?? r.institution_name ?? '') || '';
  const institutionLocation = String(inst.location ?? inst.city ?? r.institution_city ?? '') || '';

  // Normalize intake: backend may return string or object { id, name }
  const intakeRaw = r.intake ?? r.intake_name ?? null;
  const intakeNameResolved = typeof intakeRaw === 'string'
    ? intakeRaw
    : (intakeRaw && typeof intakeRaw === 'object' ? (intakeRaw.name ?? intakeRaw.intake_name ?? intakeRaw.label ?? '') : (r.intake_name ?? ''));

  return {
    id: String(r.id),
    title: r.title ?? '',
    university: String(r.university ?? inst.name ?? r.institution_name ?? ''),
    location: String(r.location ?? institutionLocation ?? r.institution_country ?? ''),
    countryCode: String(r.country_code ?? ''),
    ranking: String(r.ranking ?? ''),
    rating: Number(r.rating ?? 0),
    badges: Array.isArray(r.badges) ? r.badges : [],
    tags: Array.isArray(r.tags) ? r.tags : [],
    intake: String(intakeNameResolved ?? ''),
    intakeName: String(intakeNameResolved ?? r.intake_name ?? ''),
    availability: r.availability ?? Availability.Available,
    tuition: String(r.tuitionFee ?? ''),
    tuitionFee: String(r.tuitionFee ?? ''),
    englishTestScore: String(r.englishTestScore ?? ''),
    level: r.level ? String(r.level) : undefined,
    applicationDeadline: String(r.applicationDeadline ?? r.application_deadline ?? r.application_deadline_at ?? ''),
    ucasCode: String(r.ucasCode ?? r.ucas_code ?? ''),
    scholarship: Boolean(r.scholarship ?? r.hasScholarship ?? r.scholarship_available ?? false),
    englishWaiver: Boolean(r.englishWaiver ?? r.english_waiver ?? false),
    popularityRank: (typeof r.popularityRank === 'number' ? r.popularityRank : (typeof r.popularity_rank === 'number' ? r.popularity_rank : (r.popularity ? Number(r.popularity) : undefined))),
    status: r.status ?? r.program_status ?? undefined,
    applicationFee: String(r.applicationFee ?? ''),
    duration: String(r.duration ?? ''),
    category: String(r.category ?? ''),
    degree: String(r.degree ?? ''),
    updated: r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '',
    institutionId: r.institutionId ?? null,
    intakeId: r.intakeId ?? null,
    subjectId: r.subjectId ?? null,
    subjectName: String(r.subject_name ?? ''),
    institutionName: String(r.institution_name ?? inst.name ?? ''),
    institutionCountry: String(r.institution_country ?? inst.country ?? ''),
    institutionType: String(r.institution_type ?? inst.type ?? ''),
    institutionLabel: institutionLabel || undefined,
    institutionLocation: institutionLocation || undefined,
    raw: r,
  };
}

/* ---------------- FETCH ALL ---------------- */
export async function fetchPrograms(): Promise<Program[]> {
  try {
    const res = await axiosInstance.get('/pai/programs');
    const rows = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    return rows.map(mapRowToProgram);
  } catch (err: any) {
    console.error('fetchPrograms failed:', err?.response?.data || err);
    return [];
  }
}

/* ---------------- PAGINATED FETCH ---------------- */
export async function fetchProgramsPage(page = 1, limit = 10, search?: string, filters?: Record<string, any>): Promise<{ items: Program[]; total: number }> {
  try {
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    // Merge provided filter keys into query params (e.g. institutionId, country, level, intakeId, subjectId, scholarship, englishWaiver)
    if (filters && typeof filters === 'object') {
      for (const [k, v] of Object.entries(filters)) {
        if (v === undefined || v === null) continue;
        // only include non-empty strings and booleans/numbers
        if (typeof v === 'string' && v.trim() === '') continue;
        params[k] = v;
      }
    }
    const res = await axiosInstance.get('/pai/programs', { params });

    // Support various backend shapes: array, { data: [], total } or { data: { items: [], total } }
    const payload = res.data ?? {};
    let rows: any[] = [];
    let total = 0;

    if (Array.isArray(payload)) {
      rows = payload;
      total = rows.length;
    } else if (Array.isArray(payload.data)) {
      rows = payload.data;
      total = Number(payload.total ?? payload.meta?.total ?? rows.length) || rows.length;
    } else if (payload.data && Array.isArray(payload.data.items)) {
      rows = payload.data.items;
      total = Number(payload.data.total ?? payload.data.meta?.total ?? rows.length) || rows.length;
    } else if (payload.items && Array.isArray(payload.items)) {
      rows = payload.items;
      total = Number(payload.total ?? payload.meta?.total ?? rows.length) || rows.length;
    }

    // fallback to header total if provided
    if (!total && res.headers && res.headers['x-total-count']) {
      const h = parseInt(String(res.headers['x-total-count']), 10);
      if (!Number.isNaN(h)) total = h;
    }

    const items = Array.isArray(rows) ? rows.map(mapRowToProgram) : [];
    return { items, total };
  } catch (err: any) {
    console.error('fetchProgramsPage failed:', err?.response?.data || err);
    return { items: [], total: 0 };
  }
}

/* ---------------- GET ONE ---------------- */
export async function fetchProgramById(id: string) {
  const res = await axiosInstance.get(`/pai/programs/${id}`);
  return mapRowToProgram(res.data?.data ?? res.data);
}

/* ---------------- CREATE ---------------- */
export async function createProgram(payload: ProgramFormDto) {
  const res = await axiosInstance.post('/pai/programs', payload);
  return res.data?.data ?? res.data;
}

/* ---------------- UPDATE ---------------- */
export async function updateProgram(id: string, payload: Partial<ProgramFormDto>) {
  try {
    const res = await axiosInstance.put(`/pai/programs/${encodeURIComponent(id)}`, payload);
    return res.data?.data ?? res.data;
  } catch (err: any) {
    console.error('updateProgram failed:', err?.response?.data ?? err);
    throw err;
  }
}

/* ---------------- DELETE ---------------- */
export async function deleteProgram(id: string) {
  await axiosInstance.delete(`/pai/programs/${id}`);
}

/* ---------------- DROPDOWNS ---------------- */
// Supabase fallback: query `institutions` table directly
async function fetchInstitutionsFromSupabase() {
  try {
    const supabase = createSupabaseClient();
    // Try multiple possible table names (different projects may use singular/plural/capitalized)
    const tableCandidates = ['institutions', 'institution', 'Institution', 'InstitutionTable'];
    for (const tbl of tableCandidates) {
      try {
        const { data, error } = await supabase.from(tbl).select('*');
        if (error) {
          // table may not exist in this project, try next
          continue;
        }
        if (!Array.isArray(data)) return [];
        return data
          .map((r: any) => ({
            id: String(r.id ?? r.institutionId ?? r.institution_id ?? ''),
            // prefer explicit `name` column from DB
            name: String(r.name ?? r.institution_name ?? r.university ?? r.label ?? '').trim(),
            // prefer explicit `country` column from DB
            country: r.country ?? r.country_name ?? r.institution_country ?? r.countryCode ?? r.country_code ?? undefined,
            ranking: r.ranking ?? r.rank ?? undefined,
          }))
          .filter((x: any) => !!x.name);
      } catch (err) {
        // ignore and try next candidate
        continue;
      }
    }
    return [];
  } catch (err) {
    console.error('fetchInstitutionsFromSupabase exception', err);
    return [];
  }
}

export async function fetchInstitutionsList() {
  // Prefer backend endpoints first (ensure server-side data & auth are used)
  let rows: any[] = [];

  const candidates = ['/pai/institutes', '/pai/institutions', '/pai/programs/institutions', '/institutions', '/pai/programs/institutions'];
  for (const path of candidates) {
    try {
      const res = await axiosInstance.get(path);
      const data = res.data?.data ?? res.data ?? [];
      if (Array.isArray(data) && data.length) {
        rows = data;
        console.debug('[fetchInstitutionsList] loaded', rows.length, 'rows from endpoint', path);
        break;
      }
    } catch (err: any) {
      console.debug('[fetchInstitutionsList] endpoint failed', path, err?.message ?? err);
      continue;
    }
  }

  // If endpoints didn't return data, fall back to Supabase direct query
  if (!rows || rows.length === 0) {
    try {
      const supRows = await fetchInstitutionsFromSupabase();
      if (Array.isArray(supRows) && supRows.length) {
        rows = supRows;
        console.debug('[fetchInstitutionsList] loaded', rows.length, 'rows from Supabase (fallback)');
      }
    } catch (err) {
      // ignore
    }
  }

  if (!rows || rows.length === 0) console.warn('[fetchInstitutionsList] no institution rows found from endpoints or Supabase');

  return Array.isArray(rows)
    ? rows.map((r: any) => ({
        id: String(r.id ?? r.institutionId ?? r.institution_id ?? r.id?.toString?.() ?? ''),
        // prefer explicit `name` column from institution table
        name: String(r.name ?? r.institution_name ?? r.label ?? r.institution ?? r.university ?? '').trim(),
        // prefer explicit `country` column from institution table
        country: r.country ?? r.country_name ?? r.institution_country ?? r.countryCode ?? r.country_code ?? undefined,
        ranking: r.ranking ?? r.rank ?? undefined,
      }))
    : [];
}

// Supabase fallback for intakes
async function fetchIntakesFromSupabase() {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('intakes').select('*');
    if (error) {
      console.error('supabase fetch intakes error', error);
      return [];
    }
    return Array.isArray(data)
      ? data.map((r: any) => ({ id: String(r.id ?? r.intakeId ?? r.intake_id ?? ''), name: String(r.intake ?? r.name ?? r.intake_name ?? '') }))
      : [];
  } catch (err) {
    console.error('fetchIntakesFromSupabase exception', err);
    return [];
  }
}

export async function fetchIntakesList() {
  // Prefer Supabase intakes first
  let rows: any[] = [];
  try {
    const sup = await fetchIntakesFromSupabase();
    if (Array.isArray(sup) && sup.length) rows = sup;
    if (Array.isArray(sup) && sup.length) console.debug('[fetchIntakesList] loaded', rows.length, 'intakes from Supabase');
  } catch (err) {}

  if (!rows || rows.length === 0) {
    const candidates = ['/intakes', '/pai/programs/intakes', '/pai/intakes'];
    for (const path of candidates) {
      try {
        const res = await axiosInstance.get(path);
        const data = res.data?.data ?? res.data ?? [];
        if (Array.isArray(data)) {
          rows = data;
          console.debug('[fetchIntakesList] loaded', rows.length, 'intakes from endpoint', path);
          break;
        }
      } catch (err: any) {
        console.debug('[fetchIntakesList] endpoint failed', path, err?.message ?? err);
        continue;
      }
    }
  }

  if (!rows || rows.length === 0) console.warn('[fetchIntakesList] no intake rows found from Supabase or endpoints');

  return Array.isArray(rows)
    ? rows.map((r: any) => ({ id: String(r.id ?? r.intakeId ?? r.intake_id ?? ''), name: String(r.intake ?? r.name ?? r.label ?? r.intake_name ?? '') }))
    : [];
}

export async function fetchSubjectsList() {
  // Prefer Supabase `subjects` table first
  let rows: any[] = [];
  try {
    const sup = await (async function fetchSubjectsFromSupabase() {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.from('subjects').select('*');
        if (error || !Array.isArray(data)) return [];
        return data.map((r: any) => ({ id: String(r.id ?? r.subjectId ?? r.subject_id ?? ''), name: String(r.name ?? r.subject_name ?? r.subject ?? r.label ?? '').trim() }));
      } catch (err) {
        return [];
      }
    })();
    if (Array.isArray(sup) && sup.length) {
      rows = sup;
      console.debug('[fetchSubjectsList] loaded', rows.length, 'subjects from Supabase');
    }
  } catch (err) {}

  if (!rows || rows.length === 0) {
    const candidates = ['/pai/programs/subjects', '/subjects', '/pai/subjects'];
    for (const path of candidates) {
      try {
        const res = await axiosInstance.get(path);
        const data = res.data?.data ?? res.data ?? [];
        if (Array.isArray(data)) {
          rows = data;
          console.debug('[fetchSubjectsList] loaded', rows.length, 'subjects from endpoint', path);
          break;
        }
      } catch (err: any) {
        console.debug('[fetchSubjectsList] endpoint failed', path, err?.message ?? err);
        continue;
      }
    }
  }

  if (!rows || rows.length === 0) console.warn('[fetchSubjectsList] no subjects found from Supabase or endpoints');

  return Array.isArray(rows)
    ? rows.map((r: any) => ({ id: String(r.id ?? r.subjectId ?? r.subject_id ?? ''), name: String((r.name ?? r.subject_name ?? r.subject ?? r.label ?? '')).trim() })).filter((s: any) => !!s.name)
    : [];
}

export interface InstitutionItem {
  id: string;
  name: string;
  country?: string;
  ranking?: string | number;
}

export interface IntakeItem {
  id: string;
  name: string;
}

export interface SubjectItem {
  id: string;
  name: string;
}

export type { InstitutionItem as Institution, IntakeItem as Intake, SubjectItem as Subject };
