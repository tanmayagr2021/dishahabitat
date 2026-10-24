import { clientAddress, clip, rateLimited, readJson } from "@/lib/server/guard";
import { insertRow } from "@/lib/server/store";

/*
 * Records an enquiry, site-visit request or message at the moment the visitor confirms it, before
 * they are handed to WhatsApp, email or a call (see src/lib/leads.ts). The visitor never waits on
 * this and never sees an error from it; failures go to the server log with the details, so the
 * team can still follow up.
 */
const kinds = new Set(["enquiry", "site-visit", "message", "callback", "guide"]);
const channels = new Set(["whatsapp", "email", "call"]);
const CONSENT_TEXT = "I agree to Disha Habitat storing these details to reply to me.";

export async function POST(req: Request) {
  if (rateLimited(`lead:${clientAddress(req)}`, 15, 10 * 60_000)) return Response.json({ ok: false }, { status: 429 });
  const body = await readJson(req, 16_000);
  if (!body || typeof body !== "object") return Response.json({ ok: false }, { status: 400 });
  const b = body as Record<string, unknown>;

  const kind = typeof b.kind === "string" && kinds.has(b.kind) ? b.kind : null;
  const phone = clip(b.phone, 40);
  const email = clip(b.email, 200);
  if (!kind || b.consent !== true || (!phone && !email && !clip(b.name, 120))) {
    return Response.json({ ok: false }, { status: 422 });
  }

  /* Details: short strings only, at most 20 of them. */
  const details: Record<string, string> = {};
  if (b.details && typeof b.details === "object") {
    for (const [k, v] of Object.entries(b.details as Record<string, unknown>).slice(0, 20)) {
      const key = clip(k, 40);
      const val = clip(v, 300);
      if (key && val) details[key] = val;
    }
  }

  const row = {
    kind,
    name: clip(b.name, 120),
    phone,
    email,
    interest: clip(b.interest, 200),
    message: clip(b.message, 4000),
    channel: typeof b.channel === "string" && channels.has(b.channel) ? b.channel : null,
    details: Object.keys(details).length ? details : null,
    consent: true,
    consent_text: CONSENT_TEXT,
    page_path: clip(b.page, 500),
    referrer: clip(b.referrer, 500),
    browser: clip(req.headers.get("user-agent"), 400),
  };

  try {
    const { id } = await insertRow("leads", row);
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("[disha:leads] could not store", err, JSON.stringify(row));
    return Response.json({ ok: false }, { status: 503 });
  }
}
