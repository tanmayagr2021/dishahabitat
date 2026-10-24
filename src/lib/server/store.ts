import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * Where feedback and leads are kept.
 *
 *   supabase  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set: rows go to Supabase over its REST
 *             API with the service-role key (server only; the tables allow nothing to the public
 *             keys). Schema: supabase/migrations/20261023000000_feedback_and_leads.sql.
 *   local     development without Supabase: a JSON file per table in .data/ (git-ignored), so the
 *             whole flow can be tried end to end.
 *   log       production without Supabase: each row is written to the server log (Vercel runtime
 *             logs) so nothing is lost before the database is connected; nothing can be listed.
 */
export type Table = "feedback" | "leads";
export type Row = Record<string, unknown> & { id?: string; created_at?: string; updated_at?: string };

const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const storeMode: "supabase" | "local" | "log" =
  supabaseUrl && serviceKey ? "supabase" : process.env.NODE_ENV === "production" ? "log" : "local";

/* ---------- Supabase (PostgREST) ---------- */

async function rest(query: string, init: RequestInit & { prefer?: string } = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${query}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${init.method ?? "GET"} ${query.split("?")[0]} failed: ${res.status} ${await res.text()}`);
  return res;
}

/* ---------- Local JSON files (development) ---------- */

const dataDir = path.join(process.cwd(), ".data");
const fileFor = (table: Table) => path.join(dataDir, `${table}.json`);
let queue: Promise<unknown> = Promise.resolve();

/* One write at a time, so two submissions in the same moment never overwrite each other. */
function serial<T>(job: () => Promise<T>): Promise<T> {
  const next = queue.then(job, job);
  queue = next.catch(() => {});
  return next;
}

async function readLocal(table: Table): Promise<Row[]> {
  try {
    return JSON.parse(await readFile(fileFor(table), "utf8")) as Row[];
  } catch {
    return [];
  }
}

async function writeLocal(table: Table, rows: Row[]) {
  await mkdir(dataDir, { recursive: true });
  const tmp = `${fileFor(table)}.tmp`;
  await writeFile(tmp, JSON.stringify(rows, null, 2));
  await rename(tmp, fileFor(table));
}

/* ---------- The three operations the site needs ---------- */

export async function insertRow(table: Table, row: Row): Promise<{ id: string | null; stored: boolean }> {
  if (storeMode === "supabase") {
    const res = await rest(`${table}?select=id`, { method: "POST", body: JSON.stringify(row), prefer: "return=representation" });
    const [created] = (await res.json()) as { id: string }[];
    return { id: created?.id ?? null, stored: true };
  }
  const now = new Date().toISOString();
  const full = { id: randomUUID(), created_at: now, updated_at: now, ...row };
  if (storeMode === "local") {
    await serial(async () => writeLocal(table, [full, ...(await readLocal(table))]));
    return { id: full.id, stored: true };
  }
  console.log(`[disha:${table}] ${JSON.stringify(full)}`);
  return { id: full.id, stored: false };
}

export type ListOptions = {
  filters?: Record<string, string | undefined>;
  limit?: number;
  order?: "newest" | "oldest";
};

export async function listRows(table: Table, { filters = {}, limit = 500, order = "newest" }: ListOptions = {}): Promise<Row[]> {
  const active = Object.entries(filters).filter((e): e is [string, string] => !!e[1]);
  if (storeMode === "supabase") {
    const q = new URLSearchParams({ select: "*", order: `created_at.${order === "newest" ? "desc" : "asc"}`, limit: String(limit) });
    for (const [k, v] of active) q.append(k, `eq.${v}`);
    const res = await rest(`${table}?${q.toString()}`);
    return (await res.json()) as Row[];
  }
  if (storeMode === "log") return [];
  const rows = (await readLocal(table)).filter((r) => active.every(([k, v]) => String(r[k] ?? "") === v));
  const sorted = order === "newest" ? rows : [...rows].reverse();
  return sorted.slice(0, limit);
}

export async function updateRow(table: Table, id: string, patch: Row): Promise<boolean> {
  if (storeMode === "supabase") {
    await rest(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch), prefer: "return=minimal" });
    return true;
  }
  if (storeMode === "log") return false;
  return serial(async () => {
    const rows = await readLocal(table);
    const i = rows.findIndex((r) => r.id === id);
    if (i < 0) return false;
    rows[i] = { ...rows[i], ...patch, updated_at: new Date().toISOString() };
    await writeLocal(table, rows);
    return true;
  });
}
