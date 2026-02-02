import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axios';
import programApi from '../api/program.api';
import type { Program } from '../types';
import { ProgramStatus } from '../enums';
import { defaultProgramForm } from '../dtos/program.dto';

const asRec = (o: unknown) => o as Record<string, unknown>;

type Filters = {
  search?: string;
  institutionId?: string;
  country?: string;
  level?: string;
  intakeId?: string;
  subjectId?: string;
  scholarship?: 'any' | 'true' | 'false' | undefined;
  englishWaiver?: 'any' | 'true' | 'false' | undefined;
  page?: number;
  size?: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;

export const useProgramsWithRemote = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  // Client-side `filtered` state removed — filtering is handled server-side via API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [size, setSize] = useState<number>(DEFAULT_SIZE);
  const [total, setTotal] = useState<number>(0);

  const [intakesList, setIntakesList] = useState<Array<{id:string; name:string}>>([]);
  const [subjectsList, setSubjectsList] = useState<Array<{id:string; name:string}>>([]);
  const [institutionsList, setInstitutionsList] = useState<Array<{id:string; name:string; country?: string; city?: string}>>([]);
  const [institutionsMap, setInstitutionsMap] = useState<Record<string, unknown>>({});

  const [institutionId, setInstitutionId] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [intakeId, setIntakeId] = useState<string | undefined>(undefined);
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [scholarship, setScholarship] = useState<'any' | 'true' | 'false' | undefined>('any');
  const [englishWaiver, setEnglishWaiver] = useState<'any' | 'true' | 'false' | undefined>('any');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const buildFilterPayload = useCallback(() => {
    const payload: Record<string, unknown> = {};
    if (search) payload.search = search;
    if (institutionId) payload.institutionId = institutionId;
    if (country) payload.country = country;
    if (level) payload.level = level;
    if (intakeId) payload.intakeId = intakeId;
    if (subjectId) payload.subjectId = subjectId;
    if (scholarship === 'true') payload.scholarshipAvailable = true;
    if (scholarship === 'false') payload.scholarshipAvailable = false;
    if (englishWaiver === 'true') payload.englishWaiver = true;
    if (englishWaiver === 'false') payload.englishWaiver = false;
    return payload;
  }, [search, institutionId, country, level, intakeId, subjectId, scholarship, englishWaiver]);

  const fetchList = useCallback(async (opts?: { page?: number; size?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const filters = buildFilterPayload();
      const hasFilters = Object.keys(filters).length > 0;
      if (hasFilters) {
        const resp = await programApi.filterPrograms(filters, { page: opts?.page ?? page, size: opts?.size ?? size });
        // resp may be array or object with data/pagination
        if (Array.isArray(resp)) {
          const normalized = normalizePrograms(resp as Program[]);
          setPrograms(normalized);
          setTotal(normalized.length);
          // asynchronously enrich newly fetched programs with institute data
          enrichProgramsWithInstitutes(normalized).catch(() => {});
          } else if (resp && typeof resp === 'object') {
          const respAny = resp as unknown as Record<string, unknown>;
            const data = (respAny.data ?? respAny.programs ?? respAny.items ?? respAny) as Program[];
          const pg = (respAny.page ?? (respAny.pagination as Record<string, unknown> | undefined)?.page) as number | undefined;
          const sz = (respAny.size ?? (respAny.pagination as Record<string, unknown> | undefined)?.size) as number | undefined;
          const tot = (respAny.total ?? (respAny.pagination as Record<string, unknown> | undefined)?.total) as number | undefined;
            const base = Array.isArray(data) ? normalizePrograms(data) : [];
            setPrograms(base);
            // asynchronously enrich with institute data
            enrichProgramsWithInstitutes(base).catch(() => {});
          setPage(typeof pg === 'number' ? pg : (opts?.page ?? page));
          setSize(typeof sz === 'number' ? sz : (opts?.size ?? size));
          setTotal(typeof tot === 'number' ? tot : (Array.isArray(data) ? data.length : 0));
        } else {
          setPrograms([]);
          setTotal(0);
        }
      } else {
        const resp = await programApi.fetchPrograms({ page: opts?.page ?? page, size: opts?.size ?? size });
        // API may return either an array or an object with pagination metadata
        if (Array.isArray(resp)) {
          const normalized = normalizePrograms(resp as Program[]);
          setPrograms(normalized);
          setTotal(normalized.length);
          enrichProgramsWithInstitutes(normalized).catch(() => {});
        } else if (resp && typeof resp === 'object') {
          const anyResp = resp as unknown as Record<string, unknown>;
          const data = Array.isArray(anyResp.data) ? anyResp.data : (Array.isArray(anyResp.items) ? anyResp.items : (Array.isArray(anyResp.programs) ? anyResp.programs : []));
          const pg = anyResp.page ?? (anyResp.pagination as Record<string, unknown> | undefined)?.page ?? (opts?.page ?? page);
          const sz = anyResp.size ?? (anyResp.pagination as Record<string, unknown> | undefined)?.size ?? (opts?.size ?? size);
          const tot = anyResp.total ?? (anyResp.pagination as Record<string, unknown> | undefined)?.total ?? (Array.isArray(data) ? data.length : 0);
          const normalized = normalizePrograms(Array.isArray(data) ? (data as Program[]) : []);
          setPrograms(normalized);
          enrichProgramsWithInstitutes(normalized).catch(() => {});
          setPage(typeof pg === 'number' ? pg : (opts?.page ?? page));
          setSize(typeof sz === 'number' ? sz : (opts?.size ?? size));
          setTotal(typeof tot === 'number' ? tot : (Array.isArray(data) ? data.length : 0));
        } else {
          setPrograms([]);
          setTotal(0);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, [buildFilterPayload, page, size]);

  const enrichProgramsWithInstitutes = useCallback(async (list: Program[]) => {
    try {
      const ids = Array.from(new Set(list.map(p => asRec(p).institutionId ?? asRec(p).institution_id ?? (asRec(p).institution as Record<string, unknown> | undefined)?.id).filter(Boolean).map(String)));
      const missing = ids.filter(id => !institutionsMap[id]);
      if (missing.length === 0) return;
      const promises = missing.map(id => programApi.getInstituteById(String(id)).then(res => ({ id, res })).catch(() => ({ id, res: null })));
      const results = await Promise.all(promises);
      const nextMap = { ...institutionsMap };
      for (const r of results) {
        if (r.res) nextMap[r.id] = r.res;
      }
      setInstitutionsMap(nextMap);
      // also ensure institutionsList contains the newly fetched institutes
      try {
        const mapped = Object.keys(nextMap).map(id => {
          const insAny = nextMap[id] as unknown as Record<string, unknown>;
          const name = String(insAny.name ?? insAny.label ?? insAny.title ?? insAny.university ?? '');
          const country = insAny.country ?? insAny.countryCode ?? insAny.institutionCountry ?? insAny.country_name ?? undefined;
          const city = insAny.city ?? insAny.institutionCity ?? insAny.town ?? insAny.location_city ?? undefined;
          return { id: String(id), name, country: country ? String(country) : undefined, city: city ? String(city) : undefined };
        }).filter((x: {id:string}) => x.id);
        setInstitutionsList(prev => {
          const mapPrev: Record<string, {id:string;name:string;country?:string;city?:string}> = {};
          for (const p of prev || []) mapPrev[p.id] = p;
          for (const it of mapped) {
            if (!mapPrev[it.id]) mapPrev[it.id] = it;
            else {
              // merge fields
              mapPrev[it.id] = { ...mapPrev[it.id], ...it };
            }
          }
          return Object.values(mapPrev).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        });
      } catch (e) {
        // ignore
      }
      // merge into programs
      const merged = list.map(p => {
        const pRec = asRec(p);
        const pid = pRec.institutionId ?? pRec.institution_id ?? (pRec.institution as Record<string, unknown> | undefined)?.id;
        const inst = pid ? nextMap[String(pid)] : null;
        if (!inst) return p;
        const instAny = inst as unknown as Record<string, unknown>;
        const name = instAny.name ?? instAny.label ?? instAny.title;
        const location = instAny.country ?? instAny.location ?? instAny.institution_location ?? (instAny.city ? `${instAny.city}${instAny.country ? ', ' + instAny.country : ''}` : undefined);
        const tuitionRange = instAny.tuitionRange ?? instAny.tuition_range ?? instAny.feesRange ?? instAny.tuition ?? undefined;
        const out = { ...p } as Program & Record<string, unknown>;
        out.university = out.university ?? (name as string) ?? out.university;
        out.institutionName = out.institutionName ?? (name as string) ?? out.institutionName;
        out.institutionLocation = out.institutionLocation ?? (location as string | undefined) ?? out.institutionLocation;
        out.tuition = out.tuition ?? (asRec(out).tuitionFee as string | undefined) ?? (asRec(out).tuition_fee as string | undefined) ?? (tuitionRange as string | undefined) ?? out.tuition;
        out.tuitionFee = out.tuitionFee ?? (asRec(out).tuitionFee as string | undefined) ?? (tuitionRange as string | undefined) ?? out.tuitionFee;
        return out as Program;
      });
      setPrograms(merged);
    } catch (e) {
      // ignore enrichment errors
    }
  }, [institutionsMap]);

  // Normalize programs coming from different API shapes so UI fields like
  // `university` and `location` are always present when possible.
  const normalizePrograms = useCallback((list: Program[]) => {
    return list.map(p => {
      const out = { ...(p as unknown as Record<string, unknown>) } as Record<string, unknown> & Program;
      // institution object variants
      const pRec = asRec(p);
      const inst = pRec.institution ?? pRec.institute ?? pRec.institutionData ?? null;
      if (inst && typeof inst === 'object') {
        const instRec = inst as Record<string, unknown>;
        const instIdRaw = instRec.id ?? instRec._id ?? instRec.value;
        const idCandidate = out.institutionId ?? out.institution_id ?? instIdRaw;
        out.institutionId = idCandidate != null ? String(idCandidate) : out.institutionId;
        const instNameRaw = instRec.name ?? instRec.label ?? instRec.title;
        const nameCandidate = out.institutionName ?? instNameRaw;
        out.institutionName = nameCandidate != null ? String(nameCandidate) : out.institutionName;
        out.university = out.university ?? out.institutionName ?? out.university;
        const countryCandidate = out.institutionCountry ?? instRec.country ?? instRec.countryCode ?? instRec.institutionCountry ?? out.institutionCountry;
        out.institutionCountry = countryCandidate != null ? String(countryCandidate) : out.institutionCountry;
        const cityCandidate = out.institutionCity ?? instRec.city ?? instRec.institutionCity ?? instRec.town ?? out.institutionCity;
        out.institutionCity = cityCandidate != null ? String(cityCandidate) : out.institutionCity;
        out.location = out.location ?? out.institutionCity ?? out.location;
      }
      // flat name fields
      out.university = out.university ?? out.institutionName ?? out.institution_name ?? out.university;
      out.location = out.location ?? out.institutionCity ?? out.institution_location ?? out.location;
      // ensure id string
      if (out.institutionId) out.institutionId = String(out.institutionId);
      return out as Program;
    });
  }, []);

  // Debounce filters/search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchList({ page, size });
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, institutionId, country, level, intakeId, subjectId, scholarship, englishWaiver, page, size, fetchList]);

  // initial load
  useEffect(() => { fetchList({ page, size }); }, []);

  // fetch initial dropdown data (intakes, subjects, institutions) when mounted
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const init = await programApi.fetchInitialData();
        const anyInit = init as unknown as Record<string, unknown>;
        // possible shapes: { intakes: [], subjects: [], institutes: [], countries: [] } or data wrapper
        const payload = (anyInit.data ?? anyInit ?? {}) as Record<string, unknown>;
        const intakes = Array.isArray(payload.intakes as unknown) ? (payload.intakes as unknown[]) : (Array.isArray(payload.intakeList as unknown) ? (payload.intakeList as unknown[]) : []);
        const subjects = Array.isArray(payload.subjects as unknown) ? (payload.subjects as unknown[]) : (Array.isArray(payload.subjectList as unknown) ? (payload.subjectList as unknown[]) : []);
        const institutes = Array.isArray(payload.institutes as unknown) ? (payload.institutes as unknown[]) : (Array.isArray(payload.institutesList as unknown) ? (payload.institutesList as unknown[]) : (Array.isArray(payload.instituteList as unknown) ? (payload.instituteList as unknown[]) : []));
        if (!mounted) return;
        if (Array.isArray(intakes)) setIntakesList(intakes.map((i: unknown) => ({ id: String(asRec(i).id ?? asRec(i).value ?? asRec(i).name ?? ''), name: String(asRec(i).name ?? asRec(i).value ?? asRec(i)) })).filter((x:{id:string}) => x.id));
        if (Array.isArray(subjects)) setSubjectsList(subjects.map((s: unknown) => ({ id: String(asRec(s).id ?? asRec(s).value ?? asRec(s).name ?? ''), name: String(asRec(s).name ?? asRec(s).value ?? asRec(s)) })).filter((x:{id:string}) => x.id));
        if (Array.isArray(institutes) && institutes.length) {
          setInstitutionsList(institutes.map((ins: unknown) => {
          const id = String(asRec(ins).id ?? asRec(ins)._id ?? asRec(ins).value ?? '');
          const name = String(asRec(ins).name ?? asRec(ins).label ?? asRec(ins).title ?? '');
          const country = (asRec(ins).country ?? asRec(ins).countryCode ?? asRec(ins).institutionCountry ?? asRec(ins).country_name ?? asRec(ins).location ?? undefined) as string | undefined;
          const city = (asRec(ins).city ?? asRec(ins).institutionCity ?? asRec(ins).town ?? asRec(ins).location_city ?? undefined) as string | undefined;
          return { id, name, country: country ? String(country) : undefined, city: city ? String(city) : undefined };
        }).filter((x:{id:string}) => x.id));
        } else {
          // fallback: try fetching full institutes list from API
          try {
            const all = await programApi.fetchInstitutes();
            if (Array.isArray(all) && all.length) {
              setInstitutionsList(all.map((ins: unknown) => {
                const id = String(asRec(ins).id ?? asRec(ins)._id ?? asRec(ins).value ?? '');
                const name = String(asRec(ins).name ?? asRec(ins).label ?? asRec(ins).title ?? '');
                const country = (asRec(ins).country ?? asRec(ins).countryCode ?? asRec(ins).institutionCountry ?? asRec(ins).country_name ?? asRec(ins).location ?? undefined) as string | undefined;
                const city = (asRec(ins).city ?? asRec(ins).institutionCity ?? asRec(ins).town ?? asRec(ins).location_city ?? undefined) as string | undefined;
                return { id, name, country: country ? String(country) : undefined, city: city ? String(city) : undefined };
              }).filter((x:{id:string}) => x.id));
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // fallback: derive from programs
        try {
          const ints = Array.from(new Set((programs ?? []).map(p => String(p.intake ?? p.intakeName ?? '')).filter(Boolean))).map(s => ({ id: s, name: s }));
          const subs = Array.from(new Set((programs ?? []).map(p => String(p.subjectName ?? '')).filter(Boolean))).map(s => ({ id: s, name: s }));
          if (mounted) {
            setIntakesList(ints);
            setSubjectsList(subs);
          }
        } catch { /* ignore */ }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSave = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true);
    try {
      // normalize `status` to canonical ProgramStatus values before sending
      try {
        if (payload.status !== undefined && payload.status !== null) {
          const raw = String(payload.status);
          const candidates = Object.values(ProgramStatus) as string[];
          const match = candidates.find(v => v === raw) ?? candidates.find(v => v.toUpperCase() === raw.toUpperCase()) ?? candidates.find(v => v.toLowerCase() === raw.toLowerCase());
          (payload as Record<string, unknown>).status = (match ?? raw.toUpperCase());
        }
      } catch (e) {
        // ignore normalization errors and send original value
      }

      if (payload.id) {
        // update
        await programApi.updateProgram(String(payload.id), payload);
      } else {
        // Build a full DTO-like payload to send to create endpoint so the
        // backend receives the same sanitized shape as updates. This mirrors
        // the sanitization performed in the ProgramFormModal.
        try {
          const baseDefaults = { ...(defaultProgramForm as Record<string, unknown>) };
          const full = { ...baseDefaults, ...(payload as Record<string, unknown>) } as Record<string, unknown>;
          // Normalize `status` to known ProgramStatus values (case-insensitive)
          try {
            const rawStatus = (full.status === undefined || full.status === null) ? undefined : String(full.status);
            if (!rawStatus || rawStatus.trim() === '') {
              delete full.status;
            } else {
              const candidates = Object.values(ProgramStatus) as string[];
              const match = candidates.find(v => v === rawStatus) ?? candidates.find(v => v.toUpperCase() === rawStatus.toUpperCase()) ?? candidates.find(v => v.toLowerCase() === rawStatus.toLowerCase());
              full.status = (match ?? String(rawStatus).toUpperCase());
            }
          } catch {
            // ignore
          }

          const allowedKeys = [
            'id', 'title', 'level', 'intakeId', 'duration', 'tuitionFee', 'applicationFee', 'englishTestScore', 'subjectId', 'scholarship', 'lastUpdated', 'applicationDeadline', 'ucasCode', 'englishWaiver', 'popularityRank', 'status', 'institutionId'
          ];
          const sanitized: Record<string, unknown> = {};
          for (const k of allowedKeys) {
            if (!(k in full)) continue;
            const v = (full as Record<string, unknown>)[k];
            if (v === undefined) continue;
            if (Array.isArray(v)) {
              sanitized[k] = v.map(it => (it === null || it === undefined) ? it : (typeof it === 'object' ? String(it) : it));
              continue;
            }
            const t = typeof v;
            if (t === 'string' || t === 'number' || t === 'boolean') {
              sanitized[k] = v;
              continue;
            }
            if (v && typeof v === 'object') {
              const obj = v as Record<string, unknown>;
              if (obj.id) sanitized[k] = String(obj.id);
              else if (obj.name) sanitized[k] = String(obj.name);
              else if (obj.value) sanitized[k] = String(obj.value);
              else {
                try { sanitized[k] = JSON.stringify(obj); } catch { /* ignore */ }
              }
              continue;
            }
            try { sanitized[k] = String(v); } catch { /* ignore */ }
          }
          try {
            if (sanitized.updated !== undefined && sanitized.updated !== null) {
              if (sanitized.lastUpdated === undefined) sanitized.lastUpdated = String(sanitized.updated);
              delete sanitized.updated;
            }
            if (sanitized.lastUpdated === undefined) sanitized.lastUpdated = new Date().toISOString();
          } catch {}
          if ('updatedAt' in sanitized) delete (sanitized as Record<string, unknown>).updatedAt;
          // Ensure status is normalized if present; do NOT set a default here
          try {
            if (sanitized.status !== undefined && sanitized.status !== null) {
              const raw = String(sanitized.status);
              const candidates = Object.values(ProgramStatus) as string[];
              const match = candidates.find(v => v === raw) ?? candidates.find(v => v.toUpperCase() === raw.toUpperCase()) ?? candidates.find(v => v.toLowerCase() === raw.toLowerCase());
              sanitized.status = match ?? raw.toUpperCase();
            }
            // if status is missing, leave it absent so the UI/backend can handle validation
          } catch {}

          try {
            console.log('Creating program sanitized payload:', sanitized);
          } catch {}
          await axiosInstance.post('/pai/programs', sanitized);
        } catch (e) {
          // fallback: send original payload
          try {
            console.log('Creating program original payload (fallback):', payload);
          } catch {}
          await axiosInstance.post('/pai/programs', payload);
        }
      }
      // refresh
      await fetchList({ page: 1, size });
      setPage(1);
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save program');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchList, page, size]);

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await programApi.deleteProgram(id);
      await fetchList({ page, size });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete program');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchList, page, size]);

  return {
    programs,
    intakesList,
    subjectsList,
    institutionsList,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    handleSave,
    handleDelete,
    page,
    setPage,
    size,
    total,
    institutionId,
    setInstitutionId,
    country,
    setCountry,
    level,
    setLevel,
    intakeId,
    setIntakeId,
    subjectId,
    setSubjectId,
    scholarship,
    setScholarship,
    englishWaiver,
    setEnglishWaiver,
    loading,
    error,
  };
};

export default useProgramsWithRemote;
