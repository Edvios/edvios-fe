import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchStudentDashboardStats,
  fetchStudentRecentActivities,
  fetchStudentEnrolledPrograms,

  fetchApplicationsCount,
  fetchAcceptedApplicationsCount,
  fetchAllApplications,
  fetchApplicationsForCurrentStudent,
} from "../api/studentdashboard.api";
// removed fetchPrograms usage to avoid calling DB-wide programs/count endpoint

/* -------------------- FALLBACK DATA -------------------- */

const statCardsData = [
  { key: "applications", label: "Applications", value: "0", change: "+0%", changeLabel: "vs last month", direction: "up", accent: "blue" },
  { key: "accepted", label: "Accepted", value: "0", change: "+0%", changeLabel: "from total", direction: "up", accent: "emerald" },
  { key: "interviews", label: "Interviews", value: "0", change: "+0%", changeLabel: "vs last week", direction: "down", accent: "purple" },
  { key: "programs", label: "Programs", value: "0", change: "+0%", changeLabel: "enrolled", direction: "up", accent: "indigo" },
];

type AnyObj = Record<string, unknown>;

const emptyArr: AnyObj[] = [];

function normalizeProgramLabel(p: AnyObj | string | number | undefined): string {
  if (!p && p !== 0) return '';
  if (typeof p === 'string') return p;
  if (typeof p === 'number') return String(p);
  try {
    const obj = p as AnyObj;
    return String(obj.title ?? obj.name ?? obj.program ?? obj.programName ?? obj.program_name ?? obj.intake ?? JSON.stringify(obj));
  } catch {
    return '';
  }
}

/* -------------------- HOOK -------------------- */

export function useStudentDashboard() {
  const [statCards, setStatCards] = useState(statCardsData);
  const [applications, setApplications] = useState<AnyObj[]>(emptyArr);
  const [applicationIds, setApplicationIds] = useState<string[]>([]);
  const [programs, setPrograms] = useState<AnyObj[]>(emptyArr); // enrolled programs
  const [allPrograms, setAllPrograms] = useState<AnyObj[]>(emptyArr); // all DB programs
  const [programsCountValue, setProgramsCountValue] = useState<number>(0);
  const [acceptedCountValue, setAcceptedCountValue] = useState<number>(0);
  const [interviews] = useState<AnyObj[]>(emptyArr);
  const [documents] = useState<AnyObj[]>(emptyArr);
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async (studentId?: string) => {
    try {
      // Ensure we use the student-scoped applications endpoint first (server may rely on JWT)
      // Build a list of candidate IDs from the provided id and `user-session` so we can try multiple shapes
      const candidateIds: string[] = [];
      if (studentId) candidateIds.push(studentId);
      try {
        const raw = sessionStorage.getItem("user-session");
        if (raw) {
          const parsed = JSON.parse(raw || "{}");
          const alt = [parsed?.id, parsed?._id, parsed?.userId, parsed?.user_id, parsed?.uid, parsed?.sub, parsed?.studentId, parsed?.email, parsed?.user?.id];
          for (const a of alt) {
            if (a && typeof a === 'string' && !candidateIds.includes(a)) candidateIds.push(a);
          }
        }
      } catch {}

      let studentScopedApplications: AnyObj[] = [];

      // First, try the JWT-resolved endpoint
      try {
        const byMe = await fetchApplicationsForCurrentStudent().catch(() => []);
        if (Array.isArray(byMe) && byMe.length) {
          studentScopedApplications = byMe;
          console.info('[useStudentDashboard] /applications/student/me returned', studentScopedApplications.length);
        } else {
          console.info('[useStudentDashboard] /applications/student/me returned empty, will try candidate IDs', candidateIds);
        }
      } catch (e) {
        console.info('[useStudentDashboard] /applications/student/me threw', e);
      }

      // If JWT endpoint returned nothing, try per-candidate fetches
      if (!Array.isArray(studentScopedApplications) || !studentScopedApplications.length) {
        for (const cid of candidateIds) {
          try {
            console.info('[useStudentDashboard] trying fetchAllApplications with id:', cid);
            const res = await fetchAllApplications(cid).catch(() => []);
            if (Array.isArray(res) && res.length) {
              studentScopedApplications = res;
              console.info('[useStudentDashboard] fetchAllApplications succeeded for id', cid, 'count', res.length);
              break;
            } else {
              console.info('[useStudentDashboard] fetchAllApplications returned empty for id', cid);
            }
          } catch (e) {
            console.info('[useStudentDashboard] fetchAllApplications error for id', cid, e);
          }
        }
      }

      const [
        stats,
        activities,
        enrolled,
        programsCountFromApi,
        acceptedCountFromApi,
        fetchedApplicationsCount,
      ] = await Promise.all([
        fetchStudentDashboardStats(studentId).catch(() => null),
        fetchStudentRecentActivities(studentId).catch(() => []),
        fetchStudentEnrolledPrograms(studentId).catch(() => []),
        // call programs count endpoint (removed) - keep null for backward compatibility
        Promise.resolve(null),
        // accepted applications count
        fetchAcceptedApplicationsCount(studentId).catch(() => 0),
        // fetch applications count (may return global or student-scoped depending on backend)
        fetchApplicationsCount(studentId).catch(() => 0),
      ]);

      const allApplications = Array.isArray(studentScopedApplications) && studentScopedApplications.length ? studentScopedApplications : [];

      // Prefer explicit programs count returned by the /pai/programs/count endpoint.
      // Fallback to enrolled array length or other dashboard stats when API value is not available.
      const programsCount = typeof programsCountFromApi === 'number'
        ? programsCountFromApi
        : Array.isArray(enrolled)
        ? enrolled.length
        : typeof stats?.totalPrograms === "number"
        ? stats.totalPrograms
        : typeof stats?.enrolledCount === "number"
        ? stats.enrolledCount
        : stats?.enrolledPrograms ?? 0;

      /* -------------------- APPLICATION COUNT -------------------- */

      // If backend returned a global list, try to filter by studentId to ensure UI shows only student's applications.
      const filterByStudent = (items: AnyObj[] | unknown[], id?: string) => {
        if (!id || !Array.isArray(items)) return Array.isArray(items) ? items : [];
        const normalizedId = String(id).toLowerCase();
        return items.filter((it: unknown) => {
          try {
            const obj = it as AnyObj;
            const vals = [
              obj['studentId'],
              obj['student_id'],
              obj['userId'],
              obj['user_id'],
              obj['applicantId'],
              obj['applicant_id'],
              obj['ownerId'],
              obj['owner_id'],
              obj['createdBy'],
              obj['created_by'],
              (obj['student'] as AnyObj | undefined)?.['id'],
              (obj['student'] as AnyObj | undefined)?.['studentId'],
              (obj['metadata'] as AnyObj | undefined)?.['studentId'],
              (obj['metadata'] as AnyObj | undefined)?.['student_id'],
              (obj['metadata'] as AnyObj | undefined)?.['userId'],
              (obj['user'] as AnyObj | undefined)?.['id'],
            ];
            for (const v of vals) {
              if (v == null) continue;
              if (String(v).toLowerCase() === normalizedId) return true;
            }
            return false;
          } catch {
            return false;
          }
        });
      };

      // debug: log raw payloads to help diagnose why no student apps appear
      try {
        console.info('[useStudentDashboard] studentId', studentId);
        console.info('[useStudentDashboard] fetchedApplicationsCount', fetchedApplicationsCount);
        console.info('[useStudentDashboard] raw allApplications length', Array.isArray(allApplications) ? allApplications.length : typeof allApplications);
        console.debug('[useStudentDashboard] sample allApplications item', Array.isArray(allApplications) && allApplications.length ? allApplications[0] : null);
      } catch {}

      const filteredAllApplications = Array.isArray(allApplications) ? filterByStudent(allApplications, studentId) : [];

      // Prefer actual returned application items for the student; do not synthesize placeholders
      const resolvedApplicationsCount = Array.isArray(filteredAllApplications) ? filteredAllApplications.length : (stats?.applicationCount ?? 0);
      setApplicationsCount(resolvedApplicationsCount);

      // Derive program IDs from the student's applications (many backends store program id on application)
      const programIdSet = new Set<string>();
      if (Array.isArray(filteredAllApplications) && filteredAllApplications.length) {
        for (const a of filteredAllApplications) {
          try {
            const obj = a as AnyObj;
            const candidates = [
              obj['programId'],
              obj['program_id'],
              (obj['program'] as AnyObj | undefined)?.['id'],
              (obj['program'] as AnyObj | undefined)?.['_id'],
              (obj['program'] as AnyObj | undefined)?.['programId'],
              (obj['program'] as AnyObj | undefined)?.['program_id'],
              obj['program'],
              (obj['metadata'] as AnyObj | undefined)?.['programId'],
              (obj['metadata'] as AnyObj | undefined)?.['program_id'],
              (obj['metadata'] as AnyObj | undefined)?.['program'],
            ];
            for (const v of candidates) {
              if (v == null) continue;
              const s = String(typeof v === 'object' ? ((v as AnyObj).id ?? (v as AnyObj)._id ?? (v as AnyObj).programId ?? (v as AnyObj).program_id ?? '') : v).toLowerCase();
              if (s) programIdSet.add(s);
            }
          } catch {}
        }
      }

      // Determine programs count: only count programs when DB programs are available.
      const resolvedProgramsCountValue = programIdSet.size > 0 ? programIdSet.size : (Array.isArray(enrolled) ? enrolled.length : 0);
      setProgramsCountValue(resolvedProgramsCountValue);

      // Update stat card for programs immediately
      setStatCards((prev) => prev.map((s) => (s.key === 'programs' ? { ...s, value: String(resolvedProgramsCountValue) } : s)));
      // compute accepted count from available application items as a fallback
      let acceptedFromApplications = 0;
      try {
        if (Array.isArray(filteredAllApplications) && filteredAllApplications.length) {
          acceptedFromApplications = filteredAllApplications.filter((a: unknown) => {
            const obj = a as AnyObj;
            return /accept/i.test(String(obj['status'] ?? (obj['metadata'] as AnyObj | undefined)?.['status'] ?? obj['state'] ?? ''));
          }).length;
        }
      } catch {}

      // expose accepted applications count (prefer API count, then derived count, then stats)
      const resolvedAccepted = (typeof acceptedCountFromApi === 'number' && acceptedCountFromApi > 0)
        ? acceptedCountFromApi
        : (acceptedFromApplications > 0 ? acceptedFromApplications : (stats?.acceptedCount ?? 0));
      setAcceptedCountValue(resolvedAccepted);

      // Log applications count in same style as other API logs
      console.info("[studentdashboard.api] GET /applications/count", { count: resolvedApplicationsCount });

      /* -------------------- STAT CARDS -------------------- */

      setStatCards(
        statCardsData.map((s) => {
          if (s.key === "applications") {
            return { ...s, value: String(resolvedApplicationsCount) };
          }

          if (s.key === "accepted") {
            return {
              ...s,
              value: String(resolvedAccepted ?? (stats?.acceptedCount ?? 0)),
            };
          }

          if (s.key === "programs") {
            return {
              ...s,
              value: String(resolvedProgramsCountValue ?? (typeof programsCount === "number" ? programsCount : stats?.enrolledCount ?? 0)),
            };
          }

          return s;
        })
      );

      /* -------------------- APPLICATIONS -------------------- */

      if (Array.isArray(allApplications) && allApplications.length) {
        const filtered = filterByStudent(allApplications, studentId);
        if (filtered.length) {
          const mapped = filtered.map((a: unknown) => {
            const obj = a as AnyObj;
            return {
              id: String(obj['id'] ?? obj['_id']),
              school: obj['school'] ?? obj['institution'] ?? "",
              program: normalizeProgramLabel((obj['program'] ?? obj['title'] ?? obj) as AnyObj | string | number | undefined),
              status: obj['status'] ?? "",
              stage: obj['stage'] ?? "",
              date: obj['createdAt'] ?? obj['submittedAt'] ?? "",
              raw: obj,
            };
          });
          setApplications(mapped);
          setApplicationIds(mapped.map((m) => String(m.id)));
          console.info('[useStudentDashboard] setApplications from API, count:', filtered.length);
        } else {
          // No applications returned for this student — do not synthesize unknown placeholders.
          setApplications([]);
          setApplicationIds([]);
          console.info('[useStudentDashboard] setApplications empty after filtering');
        }
      } else if (Array.isArray(activities) && activities.length) {
        const mapped = activities.map((a: unknown) => {
          const obj = a as AnyObj;
          const meta = obj['metadata'] as AnyObj | undefined;
          return {
            id: String(obj['id']),
            school: meta ? meta['school'] ?? "" : "",
            program: normalizeProgramLabel((meta ? (meta['program'] ?? meta['programName'] ?? meta['program_name'] ?? meta) : obj['metadata']) as AnyObj | string | number | undefined),
            status: meta ? meta['status'] ?? "" : "",
            stage: meta ? meta['stage'] ?? "" : "",
            date: obj['createdAt'] ?? "",
          };
        });
        setApplications(mapped);
        setApplicationIds(mapped.map((m) => String(m.id)));
        console.info('[useStudentDashboard] setApplications from activities, count:', activities.length);
      } else {
        // No activities and no application items — show empty list and zero count.
        setApplications([]);
        setApplicationIds([]);
        console.info('[useStudentDashboard] no applications found; setApplications empty');
      }

      /* -------------------- PROGRAMS -------------------- */

      if (Array.isArray(enrolled) && enrolled.length) {
        setPrograms(
          enrolled.map((p: unknown) => {
            const obj = p as AnyObj;
            return {
              id: String(obj['id'] ?? obj['programId']),
              school: obj['university'] ?? obj['institution'] ?? "",
              program: obj['title'] ?? obj['name'] ?? "",
              term: obj['term'] ?? obj['intake'] ?? "",
              startDate: obj['startedAt'] ?? "",
            };
          })
        );
      } else if (programIdSet.size > 0 && Array.isArray(filteredAllApplications) && filteredAllApplications.length) {
        // Synthesize allocated programs from the student's application payload when `enrolled` is not available.
        const seen = new Set<string>();
        const synthesized = Array.from(programIdSet).map((pid) => {
          const match = filteredAllApplications.find((a: unknown) => {
            try {
              const obj = a as AnyObj;
              const vals = [
                obj['programId'],
                obj['program_id'],
                (obj['program'] as AnyObj | undefined)?.['id'],
                (obj['program'] as AnyObj | undefined)?.['_id'],
                (obj['program'] as AnyObj | undefined)?.['programId'],
                (obj['program'] as AnyObj | undefined)?.['program_id'],
                obj['program'],
                (obj['metadata'] as AnyObj | undefined)?.['programId'],
                (obj['metadata'] as AnyObj | undefined)?.['program_id'],
                (obj['metadata'] as AnyObj | undefined)?.['program'],
              ];
              for (const v of vals) {
                if (v == null) continue;
                if (String(v).toLowerCase() === String(pid).toLowerCase()) return true;
              }
            } catch {}
            return false;
          }) as AnyObj | undefined;

          const label = normalizeProgramLabel((match ? (match['program'] ?? (match['metadata'] as AnyObj | undefined)?.['program'] ?? match['title'] ?? (match['metadata'] as AnyObj | undefined)?.['programName'] ?? '') : '') as AnyObj | string | number | undefined);
          const school = match ? (match['school'] ?? match['institution'] ?? (match['metadata'] as AnyObj | undefined)?.['school'] ?? '') : '';
          const id = String(pid);
          if (seen.has(id)) return null;
          seen.add(id);
          return {
            id,
            school,
            program: label || `Program ${pid}`,
            term: '',
            startDate: '',
          } as AnyObj;
        }).filter(Boolean) as AnyObj[];

        setPrograms(synthesized);
      } else {
        setPrograms([]);
      }

      // We no longer fetch DB-wide programs here; keep `allPrograms` empty so UI shows zero when unavailable
      setAllPrograms([]);

      console.info("[useStudentDashboard] resolved", {
        applicationsCount: resolvedApplicationsCount,
        programsCount,
        applications: allApplications?.length ?? 0,
      });
    } catch (err) {
      console.error("[useStudentDashboard] failed", err);
      setStatCards(statCardsData);
      setApplications([]);
      setPrograms([]);
      setAllPrograms([]);
      setApplicationsCount(0);
    }
  }, []);

  const refresh = useCallback(
    (studentId?: string) => {
      load(studentId);
      setRefreshKey((v) => v + 1);
    },
    [load]
  );

  // expose a global helper for callers that run before hook is ready (page load race conditions)
  // This lets the page call `window.__studentDashboardRefresh(id)` to force a load with id.
  useEffect(() => {
    try {
      (window as unknown as Record<string, unknown>).__studentDashboardRefresh = refresh;
      return () => {
        try {
          delete (window as unknown as Record<string, unknown>).__studentDashboardRefresh;
        } catch {}
      };
    } catch {}
  }, [refresh]);

  /* -------------------- INITIAL LOAD -------------------- */

  useEffect(() => {
    let studentId: string | undefined;

    try {
      const raw = sessionStorage.getItem("user-session");
      if (raw) {
        const parsed = JSON.parse(raw);
        studentId = parsed?.id;
      }
    } catch {}

    void (async () => {
      try {
        await load(studentId);
      } catch {}
    })();
  }, [load]);

  return useMemo(
    () => ({
      statCards,
      applications,
      applicationIds,
      interviews,
      documents,
      programs,
      allPrograms,
      programsCountValue,
      acceptedCountValue,
      applicationsCount,
      refresh,
      refreshKey,
    }),
    [statCards, applications, applicationIds, interviews, documents, programs, allPrograms, programsCountValue, acceptedCountValue, applicationsCount, refresh, refreshKey]
  );
}
