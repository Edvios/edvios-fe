// app/programs/page.tsx
"use client";

import React, { useState } from 'react';
import { mockPrograms } from '@/data/mock-programs';
import { Search, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import ProgramCard from './components/program-card';

import type { Program, ProgramFormProps } from './types';
import type { ProgramFormDto } from './dtos/program.dto';
import { defaultProgramForm } from './dtos/program.dto';
import { useProgramsWithRemote as usePrograms } from './hooks/use-programs';
import programApi from './api/program.api';
import { ProgramPagination } from '../program-finder/components/program-pagination';

const asRec = (o: unknown) => o as Record<string, unknown>;

// Use shared Availability enum from types

// Sample data moved to ./dtos/initial-programs

// ────────────────────────────────────────────────
// Modal Form
// ────────────────────────────────────────────────

// program lists are derived from local `programs` data
import { StudyLevel, ProgramStatus, Availability } from './enums';

function ProgramFormModal({ program, onSave, onClose, programs, intakesList: remoteIntakesList, subjectsList: remoteSubjectsList, institutionsList: remoteInstitutionsList }: ProgramFormProps & { programs: Program[]; intakesList?: Array<{id:string; name:string}>; subjectsList?: Array<{id:string; name:string}>; institutionsList?: Array<{id:string; name:string; country?: string}> }) {
  const isEdit = !!program;

  const [form, setForm] = useState<Omit<Program, 'id'>>(() => ({ ...defaultProgramForm }));
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const requiredFields = [
    'title',
    'university',
    'location',
    'tuition',
    'applicationFee',
    'duration',
    'intake',
    'level',
    'englishTestScore',
    'applicationDeadline',
    'subjectId',
    'ucasCode',
    'popularityRank',
    'status',
  ];

  // Normalize various ISO/UTC timestamps into `datetime-local` input value: YYYY-MM-DDTHH:MM
  const toDateTimeLocal = (v?: string | null) => {
    if (!v) return '';
    try {
      // If already in a valid datetime-local-ish format, strip trailing Z and seconds if present
      const already = String(v).trim();
      const reLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(?:\.\d+)?)?$/;
      if (reLocal.test(already)) return already.slice(0, 16);

      // Parse via Date and produce local date/time components
      const d = new Date(already);
      if (Number.isNaN(d.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  // Initialize form from default + program when modal mounts or `program` changes
  React.useEffect(() => {
    const base = { ...defaultProgramForm, ...(program ?? {}) } as Record<string, unknown> & Partial<Program>;
    const rawDeadline = base.applicationDeadline ?? base.application_deadline ?? base.application_deadline_at ?? null;
    base.applicationDeadline = toDateTimeLocal(
      typeof rawDeadline === 'string' || typeof rawDeadline === 'number' ? String(rawDeadline) : null
    );
    // Ensure UCAS and location fallbacks from raw row data or alternate keys
    const rawUcas = base.ucasCode ?? base.ucas_code ?? base.raw?.ucas_code ?? base.raw?.ucasCode ?? null;
    base.ucasCode = typeof rawUcas === 'string' || typeof rawUcas === 'number' ? String(rawUcas) : '';
    const rawLocation = base.location ?? base.institutionLocation ?? base.institution_location ?? base.raw?.institution_location ?? base.raw?.location ?? base.raw?.institution_city ?? base.institutionCountry ?? base.raw?.institution_country ?? null;
    base.location = typeof rawLocation === 'string' || typeof rawLocation === 'number' ? String(rawLocation) : '';
    // populate institutionCountry and countryCode from program or raw institute fields
    const rawInstCountry = base.institutionCountry ?? base.raw?.institution_country ?? base.country ?? base.raw?.country ?? base.raw?.countryCode ?? null;
    base.institutionCountry = typeof rawInstCountry === 'string' || typeof rawInstCountry === 'number' ? String(rawInstCountry) : (base.institutionCountry ?? '');
    base.countryCode = typeof base.countryCode === 'string' || typeof base.countryCode === 'number' ? String(base.countryCode) : (base.institutionCountry ?? '');
    // populate institutionCity from program or raw institute fields
    const rawInstCity = base.institutionCity ?? base.raw?.institution_city ?? base.raw?.city ?? base.raw?.location ?? base.location ?? null;
    base.institutionCity = typeof rawInstCity === 'string' || typeof rawInstCity === 'number' ? String(rawInstCity) : (base.institutionCity ?? '');
    // Ensure tuition fields are synchronized: backend may store `tuitionFee` or legacy `tuition`.
    const rawTuition = base.tuitionFee ?? base.tuition ?? base.raw?.tuitionFee ?? base.raw?.tuition ?? null;
    if (rawTuition !== null && rawTuition !== undefined) {
      const t = String(rawTuition);
      base.tuitionFee = t;
      base.tuition = t;
    } else {
      // Keep form-controlled `tuition` as an empty string when absent to avoid uncontrolled inputs
      base.tuition = typeof base.tuition === 'string' ? base.tuition : '';
    }
    // Normalize intake to a string. Handle cases where intake may be an object
    // (e.g. { id, name }) or a string. Prefer explicit name fields when present.
    const rawIntake = base.raw?.intake;
    let rawIntakeName: string | undefined;
    if (typeof rawIntake === 'string') {
      rawIntakeName = rawIntake;
    } else if (rawIntake && typeof rawIntake === 'object') {
      const obj = rawIntake as Record<string, unknown>;
      rawIntakeName = (obj['name'] ?? obj['intake_name'] ?? obj['label'] ?? obj['value']) as string | undefined;
      if (rawIntakeName != null) rawIntakeName = String(rawIntakeName);
    } else {
      rawIntakeName = undefined;
    }

    // If `base.intake` itself is an object, try to extract known name fields
    const intakeCandidate = base.intake as unknown;
    let intakeString = '';
    if (intakeCandidate == null) {
      intakeString = rawIntakeName ?? (base.intakeName as string) ?? (base.intake_name as string) ?? (base.raw?.intake_name as string) ?? '';
    } else if (typeof intakeCandidate === 'string' || typeof intakeCandidate === 'number') {
      intakeString = String(intakeCandidate);
    } else if (typeof intakeCandidate === 'object') {
      const obj = intakeCandidate as Record<string, unknown>;
      const maybe = obj['name'] ?? obj['intake_name'] ?? obj['label'] ?? obj['value'] ?? undefined;
      intakeString = maybe != null ? String(maybe) : (rawIntakeName ?? '');
    } else {
      intakeString = rawIntakeName ?? '';
    }
    base.intake = intakeString;
    // ensure popularityRank is a number or undefined
    if (base.popularityRank === null) base.popularityRank = undefined;
    setForm(base as Omit<Program, 'id'>);
  }, [program]);

  // dropdown option state (prefer remote lists from backend, fallback to existing programs)
  const [universities, setUniversities] = React.useState<string[]>(() => {
    if (remoteInstitutionsList && remoteInstitutionsList.length) return Array.from(new Set(remoteInstitutionsList.map(i => i.name).filter(Boolean))).sort();
    return Array.from(new Set((programs ?? []).map(p => p.university).filter(Boolean))).sort();
  });
  const [countries, setCountries] = React.useState<string[]>(() => {
    if (remoteInstitutionsList && remoteInstitutionsList.length) return Array.from(new Set(remoteInstitutionsList.map(i => String(asRec(i).country ?? '')).filter(Boolean))).sort();
    return Array.from(new Set((programs ?? []).map(p => String(p.institutionCountry ?? (asRec(p).country as string | undefined) ?? '')).filter(Boolean))).sort();
  });
  const [intakes, setIntakes] = React.useState<string[]>(() => {
    if (remoteIntakesList && remoteIntakesList.length) return Array.from(new Set(remoteIntakesList.map(i => i.name).filter(Boolean))).sort();
    return Array.from(new Set((programs ?? []).map(p => String(p.intake ?? p.intakeName ?? '')).filter(Boolean))).sort();
  });
  // Rankings not currently used in the form; keep logic out until needed
  const [locations, setLocations] = React.useState<string[]>(() => {
    if (remoteInstitutionsList && remoteInstitutionsList.length) return Array.from(new Set(remoteInstitutionsList.map(i => String(asRec(i).city ?? '')).filter(Boolean))).sort();
    return Array.from(new Set((mockPrograms ?? []).map(p => String(p.location)).filter(Boolean))).sort();
  });
  const [intakesList, setIntakesList] = React.useState<Array<{id: string; name: string}>>(() => {
    if (remoteIntakesList && remoteIntakesList.length) return remoteIntakesList;
    return Array.from(new Set((programs ?? []).map(p => String(p.intake ?? p.intakeName ?? '')).filter(Boolean))).map(s => ({ id: s, name: s }));
  });
  const [subjectsList, setSubjectsList] = React.useState<Array<{id: string; name: string}>>(() => {
    if (remoteSubjectsList && remoteSubjectsList.length) return remoteSubjectsList;
    return Array.from(new Set((programs ?? []).map(p => String(p.subjectName ?? '')).filter(Boolean))).map(s => ({ id: s, name: s }));
  });
  // Local institutions list state: start from remote prop if provided, otherwise empty
  const [institutionsList, setInstitutionsList] = React.useState<Array<{id: string; name: string; country?: string; city?: string}>>(() => {
    if (remoteInstitutionsList && remoteInstitutionsList.length) return remoteInstitutionsList.map(i => ({ id: String(asRec(i).id ?? asRec(i).value ?? ''), name: String(asRec(i).name ?? asRec(i).label ?? ''), country: asRec(i).country != null ? String(asRec(i).country) : (asRec(i).countryCode != null ? String(asRec(i).countryCode) : undefined), city: asRec(i).city != null ? String(asRec(i).city) : (asRec(i).institutionCity != null ? String(asRec(i).institutionCity) : undefined) })).filter(x => x.id);
    return [];
  });

  React.useEffect(() => {
    let mounted = true;
    // derive lists from programs prop (avoid remote calls)
    (async () => {
      try {
        if (!mounted) return;
        // Prefer remote lists when available
        const ints = (remoteIntakesList && remoteIntakesList.length) ? remoteIntakesList : Array.from(new Set((programs ?? []).map(p => String(p.intake ?? p.intakeName ?? '')).filter(Boolean))).map(s => ({ id: s, name: s }));
        const subs = (remoteSubjectsList && remoteSubjectsList.length) ? remoteSubjectsList : Array.from(new Set((programs ?? []).map(p => String(p.subjectName ?? '')).filter(Boolean))).map(s => ({ id: s, name: s }));
        let unis = (remoteInstitutionsList && remoteInstitutionsList.length) ? Array.from(new Set(remoteInstitutionsList.map(i => i.name).filter(Boolean))).sort() : Array.from(new Set((programs ?? []).map(p => p.university).filter(Boolean))).sort();
        let couns = (remoteInstitutionsList && remoteInstitutionsList.length) ? Array.from(new Set(remoteInstitutionsList.map(i => asRec(i).country).filter(Boolean))).sort() : Array.from(new Set((programs ?? []).map(p => p.institutionCountry ?? (asRec(p).country as string | undefined) ?? '').filter(Boolean))).sort();
        let locs = (remoteInstitutionsList && remoteInstitutionsList.length) ? Array.from(new Set(remoteInstitutionsList.map(i => asRec(i).city).filter(Boolean))).sort() : Array.from(new Set((mockPrograms ?? []).map(p => p.location).filter(Boolean))).sort();
        // Always try fetching the full institutes list and merge country/city values
        try {
          const allInst = await programApi.fetchInstitutes();
          if (Array.isArray(allInst) && allInst.length) {
            const allUnis = allInst.map(i => String(asRec(i).name ?? '')).filter(Boolean);
            const allCouns = allInst.map(i => String(asRec(i).country ?? asRec(i).countryCode ?? '')).filter(Boolean);
            const allLocs = allInst.map(i => String(asRec(i).city ?? asRec(i).institutionCity ?? asRec(i).location ?? '')).filter(Boolean);
            unis = Array.from(new Set([...(unis || []), ...allUnis])).filter(Boolean).sort();
            couns = Array.from(new Set([...(couns || []), ...allCouns])).filter(Boolean).sort();
            locs = Array.from(new Set([...(locs || []), ...allLocs])).filter(Boolean).sort();
            // map institutions into id/name/country/city objects and set local institutions list
            const mapped = allInst.map((ins: unknown) => ({ id: String(asRec(ins).id ?? asRec(ins)._id ?? asRec(ins).value ?? ''), name: String(asRec(ins).name ?? asRec(ins).label ?? asRec(ins).title ?? ''), country: asRec(ins).country != null ? String(asRec(ins).country) : (asRec(ins).countryCode != null ? String(asRec(ins).countryCode) : (asRec(ins).institutionCountry != null ? String(asRec(ins).institutionCountry) : undefined)), city: asRec(ins).city != null ? String(asRec(ins).city) : (asRec(ins).institutionCity != null ? String(asRec(ins).institutionCity) : (asRec(ins).town != null ? String(asRec(ins).town) : undefined)) })).filter((x) => x.id);
            if (mapped.length) setInstitutionsList(mapped.sort((a,b)=> (a.name||'').localeCompare(b.name||'')));
            // if editing an existing program, try to resolve its institutionId from name and set form accordingly
            if (program) {
              try {
                const progInstName = asRec(program).institutionName ?? asRec(program).university ?? asRec(program).institutionLabel ?? '';
                if (progInstName) {
                  const found = mapped.find(m => String(m.name).toLowerCase() === String(progInstName).toLowerCase());
                  if (found) {
                    setForm(prev => ({ ...prev, institutionId: found.id, university: found.name ?? prev.university, institutionCountry: found.country ?? prev.institutionCountry, institutionCity: found.city ?? prev.institutionCity, countryCode: found.country ?? prev.countryCode, location: found.city ?? prev.location } as Omit<Program, 'id'>));
                  }
                }
              } catch (e) { /* ignore */ }
            }
          }
        } catch (e) {
          // ignore fetch errors
        }
        if (!mounted) return;
        if (ints && ints.length) {
          setIntakesList(ints);
          setIntakes(Array.from(new Set(ints.map(i => i.name).filter(Boolean))).sort());
        }
        if (subs && subs.length) {
          setSubjectsList(subs);
        }
        if (unis && unis.length) {
          setUniversities(unis.map(String));
        }
        if (couns && couns.length) {
          setCountries(couns.map(String));
        }
        if (locs && locs.length) {
          setLocations(locs.map(String));
        }
      } catch {
        console.error('Failed loading dropdown lists:');
      }
    })();
    return () => { mounted = false; };
  }, [programs, remoteIntakesList, remoteSubjectsList, remoteInstitutionsList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // validate all required fields
        const nextErrors: Record<string, string> = {};
        for (const f of requiredFields) {
          const v = (form as Record<string, unknown>)[f];
          const str = v === undefined || v === null ? '' : String(v).trim();
          if (str === '') {
            // convert camelCase keys to friendly labels
            const label = f === 'subjectId' ? 'Subject' : f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            nextErrors[f] = `${label} is required`;
          }
        }
        if (Object.keys(nextErrors).length) {
          setErrors(nextErrors);
          return;
        }
        setErrors({});
        setIsSaving(true);
    // collect form values into payload matching backend CreateProgramDto
    // resolve intakeId from fetched list (backend expects IDs).
    const selectedIntake = intakesList.find(i => i.name === (form.intake ?? ''));

    const deriveStatus = (): ProgramStatus => {
      try {
        // Respect explicit user selection first
        if (form.status && String(form.status).trim() !== '') return form.status as ProgramStatus;
        // If a deadline exists and is in the past, mark deadline passed
        if (form.applicationDeadline) {
          const maybe = String(form.applicationDeadline);
          // try parsing ISO or datetime-local strings
          const d = new Date(maybe);
          if (!Number.isNaN(d.getTime())) {
            if (d.getTime() < Date.now()) return ProgramStatus.DEADLINE_PASSED;
          }
        }
        // If availability signals closed, map to FULL
        if ((asRec(form).availability as string | undefined) === Availability.CLOSED) return ProgramStatus.FULL;
      } catch {
        // fall back to AVAILABLE on any error
      }
      return ProgramStatus.AVAILABLE;
    };

    const payload: Record<string, unknown> = {
      title: form.title,
      level: form.level ?? undefined,
      intakeId: selectedIntake?.id ?? undefined,
      duration: form.duration ?? '',
      // Ensure tuition value from the form is passed explicitly as `tuitionFee` only.
      tuitionFee: form.tuition ?? form.tuitionFee ?? '',
      applicationFee: form.applicationFee ?? '',
      englishTestScore: form.englishTestScore ?? '',
      scholarship: !!form.scholarship,
      // Convert `datetime-local` (YYYY-MM-DDTHH:MM) into an explicit ISO timestamp
      // by constructing a local Date so the correct instant is saved in DB.
      // Serialize as timezone-less local datetime (YYYY-MM-DDTHH:mm:ss)
      // so the backend receives the exact local date & time the user selected.
      applicationDeadline: form.applicationDeadline ? (() => {
        try {
          const v = String(form.applicationDeadline);
          const [datePart, timePartRaw] = v.split('T');
          if (!datePart || !timePartRaw) return v;
          const [yStr, mStr, dStr] = datePart.split('-');
          const timePart = timePartRaw.split(':');
          const hhStr = timePart[0] ?? '00';
          const mmStr = timePart[1] ?? '00';
          const y = Number(yStr) || 0;
          const m = Number(mStr) || 1;
          const d = Number(dStr) || 1;
          const hh = Number(hhStr) || 0;
          const mm = Number(mmStr) || 0;
          const pad = (n: number) => String(n).padStart(2, '0');
          // Build a Date in local time
          const local = new Date(y, m - 1, d, hh, mm, 0, 0);
          // Compute timezone offset sign and components
          const offsetMinutes = -local.getTimezoneOffset();
          const sign = offsetMinutes >= 0 ? '+' : '-';
          const absOff = Math.abs(offsetMinutes);
          const offH = Math.floor(absOff / 60);
          const offM = absOff % 60;
          // Return ISO-like string including local offset: YYYY-MM-DDTHH:MM:SS±HH:MM
          return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${sign}${pad(offH)}:${pad(offM)}`;
        } catch {
          return String(form.applicationDeadline);
        }
      })() : undefined,
      subjectId: form.subjectId ?? undefined,
      // Do not send `lastUpdated` from the form; let the DB set it server-side.
      ucasCode: form.ucasCode ?? undefined,
      englishWaiver: !!form.englishWaiver,
      popularityRank: typeof form.popularityRank === 'number' ? form.popularityRank : undefined,
      institutionId: asRec(form).institutionId as string | undefined ?? undefined,
      institutionCountry: form.institutionCountry ?? undefined,
      institutionCity: form.institutionCity ?? form.location ?? undefined,
      countryCode: form.countryCode ?? form.institutionCountry ?? undefined,
      // compute a canonical status: explicit form.status wins, otherwise derive
      status: form.status ?? deriveStatus(),
      // keep some legacy fields for UI but backend DTO covers main columns
    };
    // debug: log payload to help verify IDs are resolved correctly before sending
    try {
       
      console.log('Submitting program payload:', payload);
    } catch (e) {}

    if (program?.id) (payload as Record<string, unknown>).id = program.id;
    try {
      // Merge original program object with the payload so the API receives a
      // full program object containing both unchanged fields and edited values.
      const finalPayload = program ? ({ ...(program as Record<string, unknown>), ...(payload as Record<string, unknown>) }) : (payload as Record<string, unknown>);
      // ensure `id` is a string when present
      if (finalPayload.id) finalPayload.id = String(finalPayload.id);

      // Build a full DTO-compatible payload by starting with defaults,
      // merging the original program and then edited fields so all required
      // keys exist (backend expects full object for update).
      const baseDefaults = { ...(defaultProgramForm as Record<string, unknown>) };
      const full = { ...baseDefaults, ...(program as Record<string, unknown>), ...finalPayload } as Record<string, unknown>;
      
      // Normalize `status` to a known ProgramStatus value (case-insensitive)
      // and remove empty strings so we don't send an empty status key.
      try {
        const rawStatus = (full.status === undefined || full.status === null) ? undefined : String(full.status);
        if (!rawStatus || rawStatus.trim() === '') {
          // ensure empty values are omitted
          delete full.status;
        } else {
          const candidates = Object.values(ProgramStatus) as string[];
          const match = candidates.find(v => v === rawStatus) ?? candidates.find(v => v.toUpperCase() === rawStatus.toUpperCase()) ?? candidates.find(v => v.toLowerCase() === rawStatus.toLowerCase());
          full.status = (match ?? String(rawStatus).toUpperCase());
        }
      } catch {
        // leave as-is on error
      }
      // Sanitize payload: keep only DTO-expected keys and primitive/array values.
      // Only include fields that exist on the Prisma `Program` model to avoid
      // sending unexpected properties that can cause DB/validation errors.
      const allowedKeys = [
        'id', 'title', 'level', 'intakeId', 'duration', 'tuitionFee', 'applicationFee', 'englishTestScore', 'subjectId', 'scholarship', 'lastUpdated', 'applicationDeadline', 'ucasCode', 'englishWaiver', 'popularityRank', 'status', 'institutionId'
      ];
      const sanitized: Record<string, unknown> = {};
      for (const k of allowedKeys) {
        if (!(k in full)) continue;
        const v = (full as Record<string, unknown>)[k];
        if (v === undefined) continue;
        // Arrays: include only primitive elements
        if (Array.isArray(v)) {
          sanitized[k] = v.map(it => (it === null || it === undefined) ? it : (typeof it === 'object' ? String(it) : it));
          continue;
        }
        // Primitive types: include directly
        const t = typeof v;
        if (t === 'string' || t === 'number' || t === 'boolean') {
          sanitized[k] = v;
          continue;
        }
        // Objects: try to extract common id/name fields, otherwise skip
        if (v && typeof v === 'object') {
          const obj = v as Record<string, unknown>;
          if (obj.id) sanitized[k] = String(obj.id);
          else if (obj.name) sanitized[k] = String(obj.name);
          else if (obj.value) sanitized[k] = String(obj.value);
          else {
            // try JSON stringify for fallback
            try { sanitized[k] = JSON.stringify(obj); } catch { /* ignore */ }
          }
          continue;
        }
        // fallback: stringify
        try { sanitized[k] = String(v); } catch { /* ignore */ }
      }

      // Map legacy `updated` field to `lastUpdated` (backend expects `lastUpdated` DateTime)
      try {
        if (sanitized.updated !== undefined && sanitized.updated !== null) {
          if (sanitized.lastUpdated === undefined) sanitized.lastUpdated = String(sanitized.updated);
          delete sanitized.updated;
        }
        // If no `lastUpdated` provided, set a current ISO timestamp so backend receives an explicit value
        if (sanitized.lastUpdated === undefined) sanitized.lastUpdated = new Date().toISOString();
      } catch (e) {
        // fall back silently on any mapping error
      }

      // Ensure we do NOT send `updatedAt` — Prisma manages this @updatedAt field server-side.
      if ('updatedAt' in sanitized) delete (sanitized as Record<string, unknown>).updatedAt;

      try {
        // Ensure `status` is a canonical ProgramStatus before sending
        try {
          if (sanitized.status !== undefined && sanitized.status !== null) {
            const raw = String(sanitized.status);
            const candidates = Object.values(ProgramStatus) as string[];
            const match = candidates.find(v => v === raw) ?? candidates.find(v => v.toUpperCase() === raw.toUpperCase()) ?? candidates.find(v => v.toLowerCase() === raw.toLowerCase());
            sanitized.status = match ?? raw.toUpperCase();
          } else {
            sanitized.status = deriveStatus();
          }
        } catch {
          // fall back to leaving sanitized.status as-is
        }
         
        console.log('Updating program with sanitized payload:', sanitized);
      } catch {}
      await onSave(sanitized as ProgramFormDto);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-2xl">{isEdit ? 'Edit Program' : 'Add New Program'}</CardTitle>
            <button onClick={onClose} className="p-2 hover:bg-green-50 rounded-full text-green-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <CardContent className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Program Title *</Label>
                <Input
                  required
                  value={form.title}
                  onChange={e => {
                    setForm({ ...form, title: e.target.value });
                    if (errors.title) setErrors(prev => { const n = { ...prev }; delete (n as Record<string,string>).title; return n; });
                  }}
                  aria-invalid={errors.title ? 'true' : undefined}
                  className={`w-full mt-2 h-12 px-4 ${errors.title ? 'border-red-300' : ''}`}
                />
                {errors.title && <div className="text-sm text-red-600 mt-1">{errors.title}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">University *</Label>
                <select
                  required
                  value={asRec(form).institutionId != null ? String(asRec(form).institutionId) : (form.university ?? '')}
                  onChange={e => {
                    const val = e.target.value;
                    // find matching institution by id
                    const sel = institutionsList.find(i => i.id === val);
                    setForm({ ...form, institutionId: sel ? val : undefined, university: sel?.name ?? String(val || ''), institutionCountry: sel?.country ?? form.institutionCountry, institutionCity: sel?.city ?? form.institutionCity, countryCode: sel?.country ?? form.countryCode, location: sel?.city ?? form.location });
                    if (errors.university) setErrors(prev => { const n = { ...prev }; delete (n as Record<string,string>).university; return n; });
                  }}
                  aria-invalid={errors.university ? 'true' : undefined}
                  className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.university ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select university</option>
                  {institutionsList && institutionsList.length ? (
                    <>
                      {/* If we have a university name but no matching institution id yet, expose it so the select shows the saved value */}
                      {(form.university && !institutionsList.some(i => String(i.name).toLowerCase() === String(form.university).toLowerCase())) && (
                        <option key="__current_university" value={String(form.university)}>{form.university}</option>
                      )}
                      {institutionsList.map(i => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                      ))}
                    </>
                  ) : (
                    universities.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))
                  )}
                </select>
                {errors.university && <div className="text-sm text-red-600 mt-1">{errors.university}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Country</Label>
                <select value={form.institutionCountry ?? form.countryCode ?? ''} onChange={e => {
                    const val = e.target.value;
                    setForm({ ...form, institutionCountry: val, countryCode: val });
                    if (errors.location) setErrors(prev => { const n = { ...prev }; delete n.location; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.location ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select country</option>
                  {(form.institutionCountry && form.institutionCountry !== '' && !countries.includes(form.institutionCountry)) && (
                    <option key="__current_country" value={form.institutionCountry}>{form.institutionCountry}</option>
                  )}
                  {countries.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && <div className="text-sm text-red-600 mt-1">{errors.location}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Location</Label>
                <select value={form.location} onChange={e => {
                    const val = e.target.value;
                    setForm({ ...form, location: val, institutionCity: val });
                    if (errors.location) setErrors(prev => { const n = { ...prev }; delete n.location; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.location ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select location</option>
                  {form.location && form.location !== '' && !locations.includes(form.location) && (
                    <option key="__current" value={form.location}>{form.location}</option>
                  )}
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && <div className="text-sm text-red-600 mt-1">{errors.location}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Tuition (1st year)</Label>
                <Input value={form.tuition} onChange={e => {
                    setForm({ ...form, tuition: e.target.value });
                    if (errors.tuition) setErrors(prev => { const n = { ...prev }; delete n.tuition; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.tuition ? 'border-red-300' : ''}`} placeholder="£37,380 – £62,820" />
                {errors.tuition && <div className="text-sm text-red-600 mt-1">{errors.tuition}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Application Fee</Label>
                <Input value={form.applicationFee} onChange={e => {
                    setForm({ ...form, applicationFee: e.target.value });
                    if (errors.applicationFee) setErrors(prev => { const n = { ...prev }; delete n.applicationFee; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.applicationFee ? 'border-red-300' : ''}`} />
                {errors.applicationFee && <div className="text-sm text-red-600 mt-1">{errors.applicationFee}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Duration</Label>
                <Input value={form.duration} onChange={e => {
                    setForm({ ...form, duration: e.target.value });
                    if (errors.duration) setErrors(prev => { const n = { ...prev }; delete n.duration; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.duration ? 'border-red-300' : ''}`} placeholder="36 months" />
                {errors.duration && <div className="text-sm text-red-600 mt-1">{errors.duration}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Intake</Label>
                <select value={form.intake} onChange={e => {
                    setForm({ ...form, intake: e.target.value });
                    if (errors.intake) setErrors(prev => { const n = { ...prev }; delete n.intake; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.intake ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select intake</option>
                  {form.intake && form.intake !== '' && !intakes.includes(form.intake) && (
                    <option key="__current_intake" value={form.intake}>{form.intake}</option>
                  )}
                  {intakes.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                {errors.intake && <div className="text-sm text-red-600 mt-1">{errors.intake}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Level</Label>
                <select value={form.level ?? ''} onChange={e => {
                    setForm({ ...form, level: e.target.value || undefined });
                    if (errors.level) setErrors(prev => { const n = { ...prev }; delete n.level; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.level ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select level</option>
                  {Object.values(StudyLevel).map(v => (
                    <option key={v} value={v}>{
                      v === StudyLevel.BACHELORS ? 'Bachelors' :
                      v === StudyLevel.MASTERS ? 'Masters' :
                      v === StudyLevel.PHD ? 'PhD' :
                      v === StudyLevel.DIPLOMA ? 'Diploma' : v
                    }</option>
                  ))}
                </select>
                {errors.level && <div className="text-sm text-red-600 mt-1">{errors.level}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">English Test Score</Label>
                <Input value={form.englishTestScore} onChange={e => {
                    setForm({ ...form, englishTestScore: e.target.value });
                    if (errors.englishTestScore) setErrors(prev => { const n = { ...prev }; delete n.englishTestScore; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.englishTestScore ? 'border-red-300' : ''}`} placeholder="e.g. IELTS 6.5" />
                {errors.englishTestScore && <div className="text-sm text-red-600 mt-1">{errors.englishTestScore}</div>}
              </div>
              <div className="flex items-center gap-3 md:justify-center lg:justify-start">
                <Checkbox id="scholarship" checked={!!form.scholarship} onCheckedChange={v => setForm({ ...form, scholarship: !!v })} />
                <Label htmlFor="scholarship">Scholarships Available</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Application Deadline</Label>
                <Input value={form.applicationDeadline} onChange={e => {
                    setForm({ ...form, applicationDeadline: e.target.value });
                    if (errors.applicationDeadline) setErrors(prev => { const n = { ...prev }; delete n.applicationDeadline; return n; });
                  }} type="datetime-local" className={`w-full mt-2 h-12 px-4 ${errors.applicationDeadline ? 'border-red-300' : ''}`} />
                {errors.applicationDeadline && <div className="text-sm text-red-600 mt-1">{errors.applicationDeadline}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Subject</Label>
                <select value={form.subjectId ?? ''} onChange={e => {
                    const val = e.target.value;
                    const sub = subjectsList.find(s => s.id === val);
                    setForm({ ...form, subjectId: val || undefined, subjectName: sub?.name ?? '' });
                    if (errors.subjectId) setErrors(prev => { const n = { ...prev }; delete n.subjectId; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.subjectId ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select subject</option>
                  {subjectsList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.subjectId && <div className="text-sm text-red-600 mt-1">{errors.subjectId}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">UCAS Code</Label>
                <Input value={form.ucasCode} onChange={e => {
                    setForm({ ...form, ucasCode: e.target.value });
                    if (errors.ucasCode) setErrors(prev => { const n = { ...prev }; delete n.ucasCode; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.ucasCode ? 'border-red-300' : ''}`} />
                {errors.ucasCode && <div className="text-sm text-red-600 mt-1">{errors.ucasCode}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Popularity Rank</Label>
                <Input type="number" value={form.popularityRank ?? ''} onChange={e => {
                    setForm({ ...form, popularityRank: e.target.value ? Number(e.target.value) : undefined });
                    if (errors.popularityRank) setErrors(prev => { const n = { ...prev }; delete n.popularityRank; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.popularityRank ? 'border-red-300' : ''}`} />
                {errors.popularityRank && <div className="text-sm text-red-600 mt-1">{errors.popularityRank}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Checkbox id="englishWaiver" checked={!!form.englishWaiver} onCheckedChange={v => setForm({ ...form, englishWaiver: !!v })} />
                <Label htmlFor="englishWaiver">English Waiver</Label>
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Status</Label>
                <select value={form.status ?? ''} onChange={e => {
                    const val = e.target.value;
                    setForm({ ...form, status: val ? (val as ProgramStatus) : undefined });
                    if (errors.status) setErrors(prev => { const n = { ...prev }; delete n.status; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.status ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select status</option>
                  {Object.values(ProgramStatus).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {errors.status && <div className="text-sm text-red-600 mt-1">{errors.status}</div>}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="default" className="bg-gradient text-white" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="bg-gradient text-white shadow-lg" disabled={isSaving}>
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  {isEdit ? 'Updating...' : 'Saving...'}
                </div>
              ) : (isEdit ? 'Update Program' : 'Add Program')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────
export default function ProgramManagementPage() {
  const {
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    programs,
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
    intakesList,
    subjectsList,
    institutionsList,
  } = usePrograms();
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header + Add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
            <p className="text-gray-600 mt-1">Manage university degree programs and offerings</p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            variant="default"
            size="lg"
            className="bg-gradient text-white shadow-lg w-full sm:w-auto"
          >
            <Plus size={18} />
            Add New Program
          </Button>
        </div>

        {/* Filters bar (top, horizontal, no borders) */}
        <div className="mb-6">
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search programs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full max-w-3xl pl-12 pr-4 h-12 rounded-md bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
              {/* Institution and country filters removed */}

              <select value={level ?? ''} onChange={e => setLevel(e.target.value || undefined)} className="h-12 px-4 rounded-md bg-white text-sm min-w-[140px]">
                <option value="">All Levels</option>
                {Object.values(StudyLevel).map(v => (<option key={v} value={v}>{v}</option>))}
              </select>

              <select value={intakeId ?? ''} onChange={e => setIntakeId(e.target.value || undefined)} className="h-12 px-4 rounded-md bg-white text-sm min-w-[140px]">
                <option value="">Any Intake</option>
                {intakesList.map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
              </select>

              <select value={subjectId ?? ''} onChange={e => setSubjectId(e.target.value || undefined)} className="h-12 px-4 rounded-md bg-white text-sm min-w-[140px]">
                <option value="">All Subject</option>
                {subjectsList.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>

              <select value={scholarship ?? 'any'} onChange={e => setScholarship((e.target.value || 'any') as 'any' | 'true' | 'false')} className="h-12 px-4 rounded-md bg-white text-sm min-w-[160px]">
                <option value="any">Scholarship: Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <select value={englishWaiver ?? 'any'} onChange={e => setEnglishWaiver((e.target.value || 'any') as 'any' | 'true' | 'false')} className="h-12 px-4 rounded-md bg-white text-sm min-w-[160px]">
                <option value="any">English Waiver: Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <Button variant="default" onClick={() => {
                setInstitutionId(undefined); setCountry(undefined); setLevel(undefined); setIntakeId(undefined); setSubjectId(undefined); setScholarship(undefined); setEnglishWaiver(undefined); setSearch('');
              }} className="ml-2 bg-gradient text-white shadow">Reset</Button>
            </div>
        </div>

        {/* Main content */}
        <section>
          {programs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No programs found. Try adjusting your search or add a new one.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map(program => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onEdit={(p) => { setEditing(p); setModalOpen(true); }}
                  onDelete={(id) => handleDelete(id)}
                />
              ))}
            </div>
          )}
        </section>
        {/* Pagination */}
        <div className="max-w-7xl mx-auto">
          <ProgramPagination pagination={{ page, size, total }} onPageChange={(p) => setPage(p)} />
        </div>
      </div>

      {modalOpen && (
        <ProgramFormModal
          program={editing ?? undefined}
          programs={programs}
          intakesList={intakesList}
          subjectsList={subjectsList}
          institutionsList={institutionsList}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}