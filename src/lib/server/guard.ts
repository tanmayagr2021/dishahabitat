import "server-only";

/*
 * Light protection for the public form endpoints: a size cap, and a per-address limit on how often
 * one visitor can send. The limit lives in the memory of each server instance, so it is a speed bump
 * against floods, not a hard quota; the database's own checks bound every field.
 */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return recent.length > max;
}

export function clientAddress(req: Request) {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/* Reads a JSON body of at most `maxBytes`, or null if it is larger or not JSON. */
export async function readJson(req: Request, maxBytes: number): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) || undefined : undefined);

export const finite = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : undefined);
