import { useEffect, useMemo, useState } from 'react';
import type { Program } from '../types';
import {
  fetchProgramsPage,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../api/program.api.client';
import AppToast from '../../../utils/toast-utils';
import type { ProgramFormDto } from '../dtos/program.dto';

export function useProgramsWithRemote() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState('');
  // filter state exposed to UI
  const [institutionId, setInstitutionId] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [intakeId, setIntakeId] = useState<string | undefined>(undefined);
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [scholarship, setScholarship] = useState<string | undefined>(undefined); // 'any' | 'true' | 'false' stored as string
  const [englishWaiver, setEnglishWaiver] = useState<string | undefined>(undefined); // 'any' | 'true' | 'false'
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch when page, search or any filter changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const filters: Record<string, unknown> = {};
        if (institutionId) filters.institutionId = institutionId;
        if (country) filters.country = country;
        if (level) filters.level = level;
        if (intakeId) filters.intakeId = intakeId;
        if (subjectId) filters.subjectId = subjectId;
        if (scholarship && scholarship !== 'any') filters.scholarship = scholarship === 'true';
        if (englishWaiver && englishWaiver !== 'any') filters.englishWaiver = englishWaiver === 'true';

        const resp = await fetchProgramsPage(page, size, search || undefined, filters);
        if (!mounted) return;
        setPrograms(resp.items);
        setTotal(resp.total ?? 0);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [page, size, search, institutionId, country, level, intakeId, subjectId, scholarship, englishWaiver]);

  // Reset to page 1 when filters/search change to ensure UX consistency
  useEffect(() => {
    setPage(1);
  }, [search, institutionId, country, level, intakeId, subjectId, scholarship, englishWaiver]);

  const filtered = useMemo(() => {
    const q = String(search || '').trim().toLowerCase();
    return programs.filter(p => {
      // text search
      if (q) {
        const matchesText = (p.title || '').toLowerCase().includes(q) || (p.university || '').toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      if (institutionId && String(p.institutionId ?? '') !== String(institutionId)) return false;
      if (country && !(String(p.institutionCountry ?? p.location ?? '').toLowerCase() === String(country).toLowerCase())) return false;
      if (level && String(p.level ?? '').toLowerCase() !== String(level).toLowerCase()) return false;
      if (intakeId && String(p.intakeId ?? '') !== String(intakeId)) return false;
      if (subjectId && String(p.subjectId ?? '') !== String(subjectId)) return false;
      if (scholarship && scholarship !== 'any') {
        const want = scholarship === 'true';
        if (Boolean(p.scholarship) !== want) return false;
      }
      if (englishWaiver && englishWaiver !== 'any') {
        const want = englishWaiver === 'true';
        if (Boolean(p.englishWaiver) !== want) return false;
      }

      return true;
    });
  }, [programs, search, institutionId, country, level, intakeId, subjectId, scholarship, englishWaiver]);

  const handleSave = async (data: ProgramFormDto) => {
    try {
      if (data.id) {
        await updateProgram(data.id, data as Partial<ProgramFormDto>);
        AppToast.success('Program updated successfully');
      } else {
        await createProgram(data);
        AppToast.success('Program created successfully');
      }

      // Refresh current page
      const refreshed = await fetchProgramsPage(page, size, search || undefined);
      setPrograms(refreshed.items);
      setTotal(refreshed.total ?? 0);
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Save program failed:', err);
      AppToast.error('Failed to save program');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProgram(id);
      AppToast.success('Program deleted successfully');
      const refreshed = await fetchProgramsPage(page, size, search || undefined);
      setPrograms(refreshed.items);
      setTotal(refreshed.total ?? 0);
    } catch (err) {
      console.error('Delete program failed:', err);
      AppToast.error('Failed to delete program');
    }
  };

  return {
    programs,
    search,
    setSearch,
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
    page,
    setPage,
    size,
    total,
    loading,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    filtered,
    handleSave,
    handleDelete,
  };
}
