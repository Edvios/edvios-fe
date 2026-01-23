export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    // Accept studentId from query or fallback to user.id
    const candidateTables = ["students", "student", "profiles"];
    let updated = null;
    let updateError = null;
    const debug: Array<Record<string, unknown>> = [];
    for (const t of candidateTables) {
      // Always use 'id' column for matching
      const matchId = user.id;
      try {
        const { data, error, status, statusText } = await supabase
          .from(t)
          .update(body)
          .eq('id', matchId)
          .select()
          .maybeSingle();
        debug.push({ table: t, column: 'id', matchId, error, data, status, statusText });
        if (!error && data) {
          updated = data;
          break;
        }
        if (error) updateError = error;
      } catch (err) {
        debug.push({ table: t, column: 'id', matchId, exception: String(err) });
      }
      if (updated) break;
    }
    if (updated) {
      return new Response(JSON.stringify(updated), { status: 200, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: updateError?.message || "Update failed", debug }), { status: 400 });
    } catch {
      return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AnyRecord = Record<string, unknown> | null;

async function tryGetFromTable(supabase: Awaited<ReturnType<typeof createClient>>, table: string, userId: string) {
  // Try common column names to locate the student's row.
  const columnsToTry = ["user_id", "auth_id", "id", "student_id"];
  for (const col of columnsToTry) {
    try {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore Select result typing is dynamic depending on table
      const { data, error } = await supabase.from(table).select("*").eq(col, userId).maybeSingle();
      if (!error && data) return data as AnyRecord;
    } catch {
      // ignore and continue
    }
  }

  return null;
}

async function tryGetByStudentId(supabase: Awaited<ReturnType<typeof createClient>>, table: string, studentId: string) {
  const columns = ["STUDENTId", "student_id", "studentId", "id", "studentid"];
  for (const col of columns) {
    try {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore Select result typing is dynamic depending on table
      const { data, error } = await supabase.from(table).select("*").eq(col, studentId).maybeSingle();
      if (!error && data) return data as AnyRecord;
    } catch {
      // ignore
    }
  }
  return null;
}

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Gather auth user info
    const authInfo = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      user_metadata: user.user_metadata,
    } as AnyRecord;

    // If client provided a studentId via query param, prefer that lookup
    const url = _req.nextUrl;
    const providedStudentId = url.searchParams.get("studentId");

    const candidateTables = ["students", "student", "profiles"];
    let studentData: AnyRecord = null;
    if (providedStudentId) {
      for (const t of candidateTables) {
        studentData = await tryGetByStudentId(supabase, t, providedStudentId);
        if (studentData) break;
      }
    }

    // Fallback: lookup by auth user id
    if (!studentData) {
      for (const t of candidateTables) {
        studentData = await tryGetFromTable(supabase, t, user.id);
        if (studentData) break;
      }
    }

    // Derive a display `fullName` from common schema fields or auth metadata
    function computeFullName(userObj: unknown, row: AnyRecord) {
      const src = (row ?? {}) as Record<string, unknown>;
      const srcRec = src as Record<string, unknown>;
      const candidates = [
        srcRec["fullName"],
        srcRec["full_name"],
        srcRec["name"],
        srcRec["student_name"],
        srcRec["display_name"],
      ];

      // try first/last pairs
      const first = srcRec["first_name"] ?? srcRec["firstname"] ?? srcRec["firstName"];
      const last = srcRec["last_name"] ?? srcRec["lastname"] ?? srcRec["lastName"];
      if (first && last) candidates.push(`${first} ${last}`);

      // auth metadata (userObj may be Supabase User or other shape)
      const meta = (typeof userObj === "object" && userObj !== null
        ? (userObj as Record<string, unknown>)
        : {})["user_metadata"] as Record<string, unknown> | undefined;
      candidates.push((meta && (meta["full_name"] ?? meta["fullName"] ?? meta["name"])) ?? undefined);

      return candidates.find((c) => typeof c === "string" && c.trim().length > 0) ?? null;
    }

    const computedFullName = computeFullName(user, studentData);

    const merged = {
      ...authInfo,
      ...(studentData || {}),
      fullName: (studentData && (studentData.fullName ?? studentData.full_name)) ?? computedFullName,
    };

    return new Response(JSON.stringify(merged), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

