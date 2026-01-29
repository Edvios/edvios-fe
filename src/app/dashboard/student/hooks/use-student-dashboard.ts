import { useCallback, useEffect, useState } from 'react';
import { Application } from '@/app/dashboard/student/types/dashboard.types';
import { studentDashboardApi } from '@/app/dashboard/student/api/studentdashboard.api';
import AppToast from '@/utils/toast-utils';
import type { Program as FinderProgram } from '@/app/program-finder/types/program';

export function useStudentDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [programs, setPrograms] = useState<FinderProgram[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoadingApplications(true);
    setError(null);
    try {
      const items = await studentDashboardApi.getMyApplications();
      setApplications(items);
      return items;
    } catch (err) {
      console.error('Failed to load student applications', err);
      setError('Failed to load applications');
      AppToast.error('Failed to load applications');
    } finally {
      setLoadingApplications(false);
    }
  }, []);

  const fetchPrograms = useCallback(async (page = 1, limit = 6, apps?: Application[]) => {
    setLoadingPrograms(true);
    try {
      const rows = await studentDashboardApi.getPrograms({ page, limit });
      // map loosely to FinderProgram where possible
      const mapped: FinderProgram[] = [];
      if (Array.isArray(rows)) {
        for (const item of rows) {
          const r = item as Record<string, unknown>;
          mapped.push({
            id: String(r.id ?? r.programId ?? r._id ?? ''),
            title: String(r.title ?? r.name ?? r.program ?? r['program_name'] ?? ''),
            institution: String(r.university ?? r.institution_name ?? r.institution ?? r.institutionName ?? ''),
            location: String(r.location ?? r.institution_city ?? r.city ?? ''),
            country: String(r.country ?? r.institution_country ?? r.countryCode ?? ''),
            level: String(r.level ?? r.degree ?? ''),
            intake: String(r.intake ?? r.intake_name ?? ''),
            duration: String(r.duration ?? r.program_duration ?? ''),
            tuitionFee: String(r.tuitionFee ?? r.tuition ?? r.fee ?? ''),
            applicationFee: String(r.applicationFee ?? r.application_fee ?? ''),
            englishTestScore: String(r.englishTestScore ?? ''),
            status: (String(r.status ?? r.program_status ?? 'available') as unknown) as FinderProgram['status'],
            subject: String(r.subject ?? r.subject_name ?? ''),
            ranking: Number(r.ranking ?? r.rank ?? 0),
            scholarship: Boolean(r.scholarship ?? false),
            lastUpdated: String(r.updated_at ?? r.lastUpdated ?? ''),
            applicationDeadline: String(r.applicationDeadline ?? r.application_deadline ?? ''),
          });
        }
      }

      // If we have applications, filter programs to those referenced by the student's applications
      if (Array.isArray(apps) && apps.length > 0) {
        const programIds = new Set<string>();
        for (const a of apps) {
          if (a.programId) programIds.add(String(a.programId));
          else if (a.program && typeof a.program === 'object') {
            const progObj = a.program as Record<string, unknown>;
            if (progObj.id) programIds.add(String(progObj.id));
          } else if (typeof a.program === 'string') {
            // cannot reliably match by string title -> skip
          }
        }

        if (programIds.size > 0) {
          setPrograms(mapped.filter((p) => programIds.has(String(p.id))));
        } else {
          setPrograms(mapped);
        }
      } else {
        setPrograms(mapped);
      }
    } catch (err) {
      console.error('Failed to load programs', err);
      AppToast.error('Failed to load programs');
    } finally {
      setLoadingPrograms(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    // fetch applications first so we can filter programs to only relevant ones
    const apps = await fetchApplications();
    await fetchPrograms(1, 6, apps ?? undefined);
  }, [fetchApplications, fetchPrograms]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refreshAll();
    })();
    return () => { mounted = false; };
  }, [refreshAll]);

  return {
    applications,
    programs,
    loadingApplications,
    loadingPrograms,
    error,
    fetchApplications,
    fetchPrograms,
    refreshAll,
  } as const;
}
