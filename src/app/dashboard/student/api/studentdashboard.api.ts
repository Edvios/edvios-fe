/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

// Development-only logger: prints request path and payload when running on localhost
const isDev =
  (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) ||
  process.env.NODE_ENV !== 'production';

function debugLog(path: string, payload: any) {
  if (!isDev) return;
  try {
    // eslint-disable-next-line no-console
    console.debug('[studentdashboard.api]', path, payload);
  } catch {}
}

/**
 * Determine whether it's safe to call the configured API server.
 * When running on a development host without a configured remote API
 * (e.g. baseURL is empty or points to the same origin that has no
 * backend), we skip probing multiple endpoints to avoid browser
 * network errors (404/403) during client-side probing and instead
 * rely on Supabase fallbacks where available.
 */
function canCallApi(): boolean {
  try {
    const base = (axiosInstance && (axiosInstance as any).defaults && (axiosInstance as any).defaults.baseURL) || '';
    if (!base) return false;
    if (typeof window !== 'undefined') {
      try {
        const origin = window.location.origin;
        // If the API base equals the current origin, it's likely the developer didn't configure
        // an external backend — skip server probes to avoid 404/403 spam.
        if (base === origin || base.startsWith(origin)) return false;

        // do not auto-disable API based on differing local ports — allow
        // axios baseURL to determine reachability. Keeping the more conservative
        // checks caused valid backends to be skipped and prevented data from
        // loading in development.
      } catch {}
    }
    return true;
  } catch {
    return false;
  }
}

/* ---------------------------------- TYPES --------------------------------- */
import type { StudentDashboardStats, RecentActivity, EnrolledProgram } from '../types/dashboard.types';

/* ------------------------------ HELPERS ----------------------------------- */

function toNumber(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function extractCount(payload: any): number {
  if (!payload) return 0;
  if (typeof payload === 'number') return payload;
  if (Array.isArray(payload)) return payload.length;

  return (
    payload.count ??
    payload.total ??
    payload.totalCount ??
    payload.total_count ??
    payload.applicationsCount ??
    payload.applications_count ??
    payload.meta?.total ??
    payload.pagination?.total ??
    0
  );
}

/* ------------------------- DASHBOARD STATS ------------------------- */

export async function fetchStudentDashboardStats(
  _studentId?: string
): Promise<StudentDashboardStats> {
  // Avoid making axios probes from the browser — these often trigger
  // noisy 404/403 network errors in development when the backend
  // doesn't expose all dashboard endpoints. Server-side callers
  // continue to probe the configured API or fall back to Supabase.
  if (typeof window !== 'undefined') {
    // client-side: return defaults without logging
    return {
      totalPrograms: 0,
      enrolledPrograms: 0,
      applicationCount: 0,
      acceptedCount: 0,
      enrolledCount: 0,
    };
  }

  // Avoid probing API endpoints when API is not configured or likely same-origin dev server
  if (!canCallApi()) {
    // API unavailable: return defaults without logging
    return {
      totalPrograms: 0,
      enrolledPrograms: 0,
      applicationCount: 0,
      acceptedCount: 0,
      enrolledCount: 0,
    };
  }
  const paths = [
    '/dashboard/student/stats',
  ] as string[];

  for (const path of paths) {
    try {
      const res = await axiosInstance.get(path);
    const data = res.data?.data ?? res.data;

    debugLog(path, data);

      if (!data) continue;

      return {
        totalPrograms: toNumber(
          data.totalPrograms ??
            data.programs ??
            data.programs_count
        ),
        applicationCount: toNumber(
          data.applicationCount ??
            data.applications ??
            data.applicationsCount
        ),
        acceptedCount: toNumber(
          data.acceptedCount ?? data.accepted
        ),
        enrolledCount: toNumber(
          data.enrolledCount ??
            data.enrolled ??
            data.enrolledPrograms
        ),
        enrolledPrograms: toNumber(
          data.enrolledPrograms ??
            data.enrolledCount
        ),
        unreadNotifications: toNumber(data.unreadNotifications),
        gpa: data.gpa ?? null,
      };
    } catch {
      continue;
    }
  }

  return {
    totalPrograms: 0,
    enrolledPrograms: 0,
    applicationCount: 0,
    acceptedCount: 0,
    enrolledCount: 0,
  };
}

/* ------------------------- APPLICATION COUNT ------------------------- */

export async function fetchApplicationsCount(
  studentId?: string
): Promise<number> {
  // Avoid performing any axios probes from the browser — return 0 client-side
  if (typeof window !== 'undefined') {
    return 0;
  }

  // If API is not available, fall back directly to Supabase to avoid repeated failed axios probes
  if (!canCallApi()) {
    try {
      const supabase = createSupabaseClient();
      const res = await supabase.from('applications').select('*', { count: 'exact', head: true });
      const count = (res as any).count ?? 0;
      if (typeof count === 'number' && count > 0) {
        return count;
      }
    } catch {
      // supabase fallback failed — swallow to keep client quiet
    }
    return 0;
  }
  // Try student-scoped endpoints first when a studentId is provided
  const candidates: string[] = [];
  if (studentId) {
    candidates.push(`/applications/student/me`);
    candidates.push(`/applications/student/${encodeURIComponent(studentId)}`);
    candidates.push(`/students/${encodeURIComponent(studentId)}/applications`);
    candidates.push(`/applications?studentId=${encodeURIComponent(studentId)}`);
  }

  // Only try global endpoints when no studentId provided. When a studentId is
  // available we must avoid probing DB-wide endpoints that can 404/403 in many
  // deployments — prefer student-scoped endpoints and Supabase fallback.
  if (!studentId) {
    // Global endpoints fallback
    candidates.push('/applications/count', '/pai/applications/count', '/applications/counts', '/applications');
  }

  for (const path of candidates) {
    try {
      // If path contains querystring already, request as-is
      const res = path.includes('?') ? await axiosInstance.get(path) : await axiosInstance.get(path);
      const payload = res.data?.data ?? res.data ?? null;

      debugLog(path, payload);

      // prefer numeric payload or common shapes
      const count = extractCount(payload);
      if (count > 0) return count;

      // Some endpoints return full arrays at `/applications` — use length
      if (Array.isArray(payload) && payload.length) return payload.length;
    } catch {
      continue;
    }
  }

  // Fallback to Supabase count query
  try {
    // Avoid performing Supabase requests from the browser — these can produce
    // noisy 404/403 network errors when the project/table isn't available.
    if (typeof window !== 'undefined') {
      // skip supabase fallback in browser silently
    } else {
      const supabase = createSupabaseClient();
      // head:true with count:'exact' returns only count in `count`
      const res = await supabase.from('applications').select('*', { count: 'exact', head: true });
      const count = (res as any).count ?? 0;
      if (typeof count === 'number' && count > 0) {
        return count;
      }
    }
  } catch {
    // supabase fallback failed — keep silent
  }

  return 0;
}

/**
 * Fetch count of accepted applications.
 * Tries several endpoint shapes and falls back to Supabase filtered count.
 */
export async function fetchAcceptedApplicationsCount(studentId?: string): Promise<number> {
  // Avoid performing axios probes from the browser — return 0 client-side
  if (typeof window !== 'undefined') {
    return 0;
  }

  // If API is not available, prefer Supabase to compute accepted count and avoid axios probes
  if (!canCallApi()) {
    try {
      const supabase = createSupabaseClient();
      const res = await supabase.from('applications').select('*', { count: 'exact', head: true }).ilike('status', '%accept%');
      const count = (res as any).count ?? 0;
      if (typeof count === 'number' && count > 0) {
        return count;
      }
    } catch {
      // supabase fallback failed — keep silent
    }
    return 0;
  }

  // Prefer student-scoped/filtered logic when studentId provided. If no studentId,
  // try a small set of global endpoints.
  const candidates = studentId
    ? ['/applications/accepted/count', `/applications?studentId=${encodeURIComponent(studentId)}&status=accepted`] // small student-scoped probe
    : ['/applications/accepted/count', '/applications/count?status=accepted', '/pai/applications/count?status=accepted', '/applications'];

  for (const path of candidates) {
    try {
      const res = await axiosInstance.get(path);
      const payload = res.data?.data ?? res.data ?? null;

      debugLog(path, payload);

      // if payload is an array, count items with accepted status
      if (Array.isArray(payload)) {
        const matched = payload.filter((p: any) => String((p.status ?? p.state ?? '').toLowerCase()).includes('accept'));
        if (matched.length) return matched.length;
      }

      // otherwise try extractCount for numeric shapes
      const count = extractCount(payload);
      if (count > 0) return count;
    } catch {
      continue;
    }
  }

  // Supabase fallback: count rows where status LIKE 'accept'
  try {
    if (typeof window !== 'undefined') {
      // skip supabase fallback in browser silently
    } else {
      const supabase = createSupabaseClient();
      // Use head/count to get exact count with filter
      const res = await supabase.from('applications').select('*', { count: 'exact', head: true }).ilike('status', '%accept%');
      const count = (res as any).count ?? 0;
      if (typeof count === 'number' && count > 0) {
        return count;
      }
    }
  } catch {
    // supabase fallback failed — keep silent
  }

  return 0;
}

/* ------------------------- ALL APPLICATIONS ------------------------- */

export async function fetchAllApplications(
  studentId?: string
): Promise<any[]> {
  // Avoid performing axios probes from the browser — return empty list client-side
  if (typeof window !== 'undefined') {
    return [];
  }

  // If API is not available, use Supabase fallback directly to avoid axios probes
  if (!canCallApi()) {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('applications').select('*');
      if (!error && Array.isArray(data)) {
        if (studentId) {
          const normalizedId = String(studentId).toLowerCase();
          const filtered = (data as any[]).filter((it: any) => {
            try {
              const vals = [
                it.studentId,
                it.student_id,
                it.userId,
                it.user_id,
                it.applicantId,
                it.applicant_id,
                it.ownerId,
                it.owner_id,
                it.createdBy,
                it.created_by,
                it.student?.id,
                it.student?.studentId,
                it.metadata?.studentId,
                it.metadata?.student_id,
                it.metadata?.userId,
                it.user?.id,
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
          // supabase fallback total removed for quiet client
          return filtered;
        }

        // supabase fallback total removed for quiet client
        return data;
      }
    } catch {
      // supabase fallback failed — keep silent
    }

    return [];
  }

  // Try student-scoped endpoints first when studentId provided
  const candidates: string[] = [];
  if (studentId) {
    candidates.push('/applications/student/me');
    candidates.push(`/applications/student/${encodeURIComponent(studentId)}`);
    candidates.push(`/students/${encodeURIComponent(studentId)}/applications`);
    candidates.push(`/applications?studentId=${encodeURIComponent(studentId)}`);
  }

  // Global endpoints fallback — only probe these when no studentId is provided.
  if (!studentId) {
    candidates.push('/applications', '/pai/applications', '/applications/list', '/applications/all');
  }

  for (const path of candidates) {
    try {
      const res = path.includes('?') ? await axiosInstance.get(path) : await axiosInstance.get(path);
      const payload = res.data?.data ?? res.data ?? [];

      debugLog(path, payload);

      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.rows)) return payload.rows;
    } catch {
      // try next candidate
      continue;
    }
  }

  // Fallback to Supabase direct query for `applications` table
  try {
    if (typeof window !== 'undefined') {
      // skip supabase fallback in browser silently
    } else {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('applications').select('*');
      if (!error && Array.isArray(data)) {
        // If caller provided a studentId, try to filter the returned rows
        if (studentId) {
          const normalizedId = String(studentId).toLowerCase();
          const filtered = (data as any[]).filter((it: any) => {
            try {
              const vals = [
                it.studentId,
                it.student_id,
                it.userId,
                it.user_id,
                it.applicantId,
                it.applicant_id,
                it.ownerId,
                it.owner_id,
                it.createdBy,
                it.created_by,
                it.student?.id,
                it.student?.studentId,
                it.metadata?.studentId,
                it.metadata?.student_id,
                it.metadata?.userId,
                it.user?.id,
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
          return filtered;
        }

        return data;
      }
    }
  } catch {
    // supabase fallback failed — keep silent
  }

  return [];
}

/**
 * Direct call to the student-scoped endpoint that relies on the JWT on the request
 * (i.e. `/applications/student/me`). Use when you want the backend to resolve
 * the student from the token rather than passing an id.
 */
export async function fetchApplicationsForCurrentStudent(): Promise<any[]> {
  // Skip server probe when API unavailable
  if (!canCallApi()) {
    // skip silently when API unavailable
    return [];
  }

    try {
      const res = await axiosInstance.get('/applications/student/me');
      const payload = res.data?.data ?? res.data ?? [];

      debugLog('/applications/student/me', payload);

      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.rows)) return payload.rows;
    } catch {
      // fallthrough to return empty
    }

  return [];
}

/* ------------------------- RECENT ACTIVITY ------------------------- */

export async function fetchStudentRecentActivities(
  studentId?: string,
  limit = 10
): Promise<RecentActivity[]> {
  const paths = [
    '/dashboard/student/activities',
  ] as string[];

  // Avoid performing axios probes from the browser — return empty list client-side
  if (typeof window !== 'undefined') {
    return [];
  }

  if (!canCallApi()) {
    return [];
  }

  for (const path of paths) {
    try {
      const res = await axiosInstance.get(path, { params: { limit } });
      const rows = res.data?.data ?? res.data;

      debugLog(path, rows);

      if (!Array.isArray(rows)) continue;

      return rows.map((r: any) => ({
        id: String(r.id ?? r._id),
        type: r.type ?? 'activity',
        message: r.message ?? r.text ?? '',
        createdAt: r.createdAt ?? r.created_at,
        metadata: r.metadata,
      }));
    } catch {
      continue;
    }
  }

  return [];
}

/* ------------------------- ENROLLED PROGRAMS ------------------------- */

export async function fetchStudentEnrolledPrograms(
  _studentId?: string
): Promise<EnrolledProgram[]> {
  const paths = [] as string[];

  if (!canCallApi()) {
    return [];
  }

  for (const path of paths) {
    try {
      const res = await axiosInstance.get(path);
      const rows = res.data?.data ?? res.data;

      debugLog(path, rows);

      if (!Array.isArray(rows)) continue;

      return rows.map((r: any) => ({
        id: String(r.id ?? r._id),
        // keep both canonical (school/program/startDate) and raw API aliases
        school: r.university ?? r.institution ?? r.school,
        program: r.title ?? r.name,
        term: r.term ?? r.intake,
        startDate: r.startedAt ?? r.start_date,
        // raw aliases for compatibility
        title: r.title ?? r.name,
        university: r.university ?? r.institution,
        startedAt: r.startedAt ?? r.start_date,
        status: r.status,
        raw: r,
      }));
    } catch {
      continue;
    }
  }

  return [];
}

/* ------------------------- DASHBOARD AGGREGATE ------------------------- */

export async function fetchStudentDashboardAll(studentId?: string) {
  const [stats, activities, programs] = await Promise.all([
    fetchStudentDashboardStats(studentId),
    fetchStudentRecentActivities(studentId),
    fetchStudentEnrolledPrograms(studentId),
  ]);

  return { stats, activities, programs };
}
