// app/programs/page.tsx
"use client";

import React, { useState } from 'react';
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
import { ProgramPagination } from '../program-finder/components/program-pagination';

// Use shared Availability enum from types

// Sample data moved to ./dtos/initial-programs

// ────────────────────────────────────────────────
// Modal Form
// ────────────────────────────────────────────────

import { fetchInstitutionsList, fetchIntakesList, fetchSubjectsList } from './api/program.api.client';
import { StudyLevel, ProgramStatus } from './enums';

function ProgramFormModal({ program, onSave, onClose, programs }: ProgramFormProps & { programs: Program[] }) {
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
    const rawLocation = base.location ?? base.institutionLocation ?? base.institution_location ?? base.raw?.institution_location ?? base.raw?.location ?? base.raw?.institution_city ?? base.raw?.institution_country ?? base.institutionCountry ?? null;
    base.location = typeof rawLocation === 'string' || typeof rawLocation === 'number' ? String(rawLocation) : '';
    // Normalize intake to a string. If `raw.intake` is an object, prefer its `name`.
    const rawIntake = base.raw?.intake;
    let rawIntakeName: string | undefined;
    if (typeof rawIntake === 'string') {
      rawIntakeName = rawIntake;
    } else if (rawIntake && typeof rawIntake === 'object') {
      const obj = rawIntake as Record<string, unknown>;
      rawIntakeName = String((obj['name'] ?? obj['intake_name'] ?? '') || undefined) || undefined;
    } else {
      rawIntakeName = undefined;
    }
    base.intake = String(base.intake ?? base.intakeName ?? base.intake_name ?? rawIntakeName ?? base.raw?.intake_name ?? base.raw?.intake ?? '');
    // ensure popularityRank is a number or undefined
    if (base.popularityRank === null) base.popularityRank = undefined;
    setForm(base as Omit<Program, 'id'>);
  }, [program]);

  // dropdown option state (prefer DB lists, fall back to existing programs)
  const [universities, setUniversities] = React.useState<string[]>(() => Array.from(new Set((programs ?? []).map(p => p.university).filter(Boolean))).sort());
  const [intakes, setIntakes] = React.useState<string[]>(() => Array.from(new Set((programs ?? []).map(p => String(p.intake ?? p.intakeName ?? '')).filter(Boolean))).sort());
  const [, setRankings] = React.useState<string[]>(() => Array.from(new Set((programs ?? []).map(p => p.ranking).filter(Boolean))).sort());
  const [locations, setLocations] = React.useState<string[]>(() => Array.from(new Set((programs ?? []).map(p => p.location).filter(Boolean))).sort());
  const [institutionsList, setInstitutionsList] = React.useState<Array<{id: string; name: string; country?: string; ranking?: string}>>([]);
  const [intakesList, setIntakesList] = React.useState<Array<{id: string; name: string}>>([]);
  const [subjectsList, setSubjectsList] = React.useState<Array<{id: string; name: string}>>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const insts = await fetchInstitutionsList();
        if (!mounted) return;
        if (insts && insts.length) {
          setInstitutionsList(insts);
          const u = Array.from(new Set(insts.map(i => i.name).filter(Boolean))).sort();
          setUniversities(u);
          const r = Array.from(new Set(insts.map(i => i.ranking).filter((v): v is string => Boolean(v)))).sort();
          setRankings(r);
          const locs = Array.from(new Set(insts.map(i => i.country).filter((v): v is string => Boolean(v)))).sort();
          setLocations(locs);
        }

        const ints = await fetchIntakesList();
        if (!mounted) return;
        if (ints && ints.length) {
          setIntakesList(ints);
          setIntakes(Array.from(new Set(ints.map(i => i.name).filter(Boolean))).sort());
        }
        const subs = await fetchSubjectsList();
        if (!mounted) return;
        if (subs && subs.length) {
          setSubjectsList(subs);
        }
      } catch {
        console.error('Failed loading dropdown lists:');
      }
    })();
    return () => { mounted = false; };
  }, [programs]);

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
    // resolve institutionId and intakeId from the fetched lists (backend expects IDs)
    const selectedInstitution = institutionsList.find(i => i.name === (form.university ?? ''));
    const selectedIntake = intakesList.find(i => i.name === (form.intake ?? ''));

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
      institutionId: selectedInstitution?.id ?? undefined,
      status: form.status ?? undefined,
      // keep some legacy fields for UI but backend DTO covers main columns
    };

    if (program?.id) (payload as Record<string, unknown>).id = program.id;
    console.info('[program.form] payload before onSave:', payload);
    try {
      await onSave(payload as ProgramFormDto);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  value={form.university}
                  onChange={e => {
                    setForm({ ...form, university: e.target.value });
                    if (errors.university) setErrors(prev => { const n = { ...prev }; delete (n as Record<string,string>).university; return n; });
                  }}
                  aria-invalid={errors.university ? 'true' : undefined}
                  className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.university ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select university</option>
                  {universities.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                {errors.university && <div className="text-sm text-red-600 mt-1">{errors.university}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Location</Label>
                <select value={form.location} onChange={e => {
                    setForm({ ...form, location: e.target.value });
                    if (errors.location) setErrors(prev => { const n = { ...prev }; delete n.location; return n; });
                  }} className={`w-full mt-2 px-4 h-12 rounded-md border ${errors.location ? 'border-red-300' : 'border-orange-200'} bg-transparent focus:ring-2 focus:ring-green-500`}>
                  <option value="">Select country</option>
                  {form.location && form.location !== '' && !locations.includes(form.location) && (
                    <option key="__current" value={form.location}>{form.location}</option>
                  )}
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && <div className="text-sm text-red-600 mt-1">{errors.location}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Tuition (1st year)</Label>
                <Input value={form.tuition} onChange={e => {
                    setForm({ ...form, tuition: e.target.value });
                    if (errors.tuition) setErrors(prev => { const n = { ...prev }; delete n.tuition; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.tuition ? 'border-red-300' : ''}`} placeholder="£37,380 – £62,820" />
                {errors.tuition && <div className="text-sm text-red-600 mt-1">{errors.tuition}</div>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Application Fee</Label>
                <Input value={form.applicationFee} onChange={e => {
                    setForm({ ...form, applicationFee: e.target.value });
                    if (errors.applicationFee) setErrors(prev => { const n = { ...prev }; delete n.applicationFee; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.applicationFee ? 'border-red-300' : ''}`} />
                {errors.applicationFee && <div className="text-sm text-red-600 mt-1">{errors.applicationFee}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Duration</Label>
                <Input value={form.duration} onChange={e => {
                    setForm({ ...form, duration: e.target.value });
                    if (errors.duration) setErrors(prev => { const n = { ...prev }; delete n.duration; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.duration ? 'border-red-300' : ''}`} placeholder="36 months" />
                {errors.duration && <div className="text-sm text-red-600 mt-1">{errors.duration}</div>}
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
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
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">English Test Score</Label>
                <Input value={form.englishTestScore} onChange={e => {
                    setForm({ ...form, englishTestScore: e.target.value });
                    if (errors.englishTestScore) setErrors(prev => { const n = { ...prev }; delete n.englishTestScore; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.englishTestScore ? 'border-red-300' : ''}`} placeholder="e.g. IELTS 6.5" />
                {errors.englishTestScore && <div className="text-sm text-red-600 mt-1">{errors.englishTestScore}</div>}
              </div>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <Checkbox id="scholarship" checked={!!form.scholarship} onCheckedChange={v => setForm({ ...form, scholarship: !!v })} />
                <Label htmlFor="scholarship">Scholarships Available</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
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
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">UCAS Code</Label>
                <Input value={form.ucasCode} onChange={e => {
                    setForm({ ...form, ucasCode: e.target.value });
                    if (errors.ucasCode) setErrors(prev => { const n = { ...prev }; delete n.ucasCode; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.ucasCode ? 'border-red-300' : ''}`} />
                {errors.ucasCode && <div className="text-sm text-red-600 mt-1">{errors.ucasCode}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="flex items-center gap-3 mt-2">
                <Checkbox id="englishWaiver" checked={!!form.englishWaiver} onCheckedChange={v => setForm({ ...form, englishWaiver: !!v })} />
                <Label htmlFor="englishWaiver">English Waiver</Label>
              </div>
              <div className="flex flex-col">
                <Label className="mb-2 text-sm font-medium text-gray-700">Popularity Rank</Label>
                <Input type="number" value={form.popularityRank ?? ''} onChange={e => {
                    setForm({ ...form, popularityRank: e.target.value ? Number(e.target.value) : undefined });
                    if (errors.popularityRank) setErrors(prev => { const n = { ...prev }; delete n.popularityRank; return n; });
                  }} className={`w-full mt-2 h-12 px-4 ${errors.popularityRank ? 'border-red-300' : ''}`} />
                {errors.popularityRank && <div className="text-sm text-red-600 mt-1">{errors.popularityRank}</div>}
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
            <Button type="button" variant="outline" className="border-green-200 text-gray-900" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 shadow-lg" disabled={isSaving}>
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
    programs,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    filtered,
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
  } = usePrograms();

  const [institutionsList, setInstitutionsList] = React.useState<Array<{id:string; name:string; country?:string}>>([]);
  const [intakesList, setIntakesList] = React.useState<Array<{id:string; name:string}>>([]);
  const [subjectsList, setSubjectsList] = React.useState<Array<{id:string; name:string}>>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const insts = await fetchInstitutionsList();
        if (!mounted) return;
        if (Array.isArray(insts)) setInstitutionsList(insts.map(i => ({ id: i.id, name: i.name, country: i.country })));
        const ints = await fetchIntakesList();
        if (!mounted) return;
        if (Array.isArray(ints)) setIntakesList(ints.map(i => ({ id: i.id, name: i.name })));
        const subs = await fetchSubjectsList();
        if (!mounted) return;
        if (Array.isArray(subs)) setSubjectsList(subs.map(s => ({ id: s.id, name: s.name })));
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);
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
            className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 shadow-lg w-full sm:w-auto"
          >
            <Plus size={18} />
            Add New Program
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <aside className="col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">Institution</h3>
                <select value={institutionId ?? ''} onChange={e => setInstitutionId(e.target.value || undefined)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">All Institutions</option>
                  {institutionsList.map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
                </select>
              </div>


              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">Country</h3>
                <select value={country ?? ''} onChange={e => setCountry(e.target.value || undefined)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">All Countries</option>
                  {Array.from(new Set(institutionsList.map(i => i.country).filter(Boolean))).map(c => (<option key={c} value={c}>{c}</option>))}
                </select>

          
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">Study Level</h3>
                <select value={level ?? ''} onChange={e => setLevel(e.target.value || undefined)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">All Levels</option>
                  {Object.values(StudyLevel).map(v => (<option key={v} value={v}>{v}</option>))}
                </select>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">Intake</h3>
                <select value={intakeId ?? ''} onChange={e => setIntakeId(e.target.value || undefined)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Any Intake</option>
                  {intakesList.map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
                </select>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">Subject Area</h3>
                <select value={subjectId ?? ''} onChange={e => setSubjectId(e.target.value || undefined)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">All Subject</option>
                  {subjectsList.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">Scholarship Available</h3>
                <select value={scholarship ?? 'any'} onChange={e => setScholarship(e.target.value || 'any')} className="w-full px-3 py-2 border rounded-md">
                  <option value="any">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-sm font-medium mb-3">English Waiver</h3>
                <select value={englishWaiver ?? 'any'} onChange={e => setEnglishWaiver(e.target.value || 'any')} className="w-full px-3 py-2 border rounded-md">
                  <option value="any">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

                <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setInstitutionId(undefined); setCountry(undefined); setLevel(undefined); setIntakeId(undefined); setSubjectId(undefined); setScholarship(undefined); setEnglishWaiver(undefined); setSearch('');
                }} className="w-full bg-white text-gray-900 border-green-200">Reset Filters</Button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="col-span-3">
            {/* Cards Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No programs found. Try adjusting your search or add a new one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(program => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onEdit={(p) => {
                      setEditing(p);
                      setModalOpen(true);
                    }}
                    onDelete={(id) => handleDelete(id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
        {/* Pagination */}
        <div className="max-w-7xl mx-auto">
          <ProgramPagination pagination={{ page, size, total }} onPageChange={(p) => setPage(p)} />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProgramFormModal
          program={editing ?? undefined}
          programs={programs}
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