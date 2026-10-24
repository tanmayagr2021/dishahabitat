import { type FeedbackKind, feedbackKinds, LIMITS } from "@/lib/feedback";
import { clientAddress, clip, finite, rateLimited, readJson } from "@/lib/server/guard";
import { insertRow } from "@/lib/server/store";

/*
 * Receives one feedback note from the widget on any page and stores it with where it points:
 * the page, the section, the element and the visitor's screen. Public, so every field is checked
 * and clipped here, and the database checks them again.
 */
const kinds = new Set<string>([...feedbackKinds.map((k) => k.id), "other"]);
const devices = new Set(["phone", "tablet", "computer"]);

export async function POST(req: Request) {
  if (rateLimited(`fb:${clientAddress(req)}`, 20, 10 * 60_000)) {
    return Response.json({ ok: false, error: "Too many notes in a short time. Please try again in a few minutes." }, { status: 429 });
  }
  const body = await readJson(req, 24_000);
  if (!body || typeof body !== "object") return Response.json({ ok: false, error: "That didn’t arrive in one piece." }, { status: 400 });
  const b = body as Record<string, unknown>;

  /* A bot fills the field people never see; accept quietly and keep nothing. */
  if (clip(b.website, 200)) return Response.json({ ok: true }, { status: 201 });

  const message = clip(b.message, LIMITS.message);
  const page = clip(b.page_path, 500);
  if (!message) return Response.json({ ok: false, error: "Please write a few words first." }, { status: 422 });
  if (!page || !page.startsWith("/")) return Response.json({ ok: false, error: "Which page is this about?" }, { status: 422 });

  const email = clip(b.email, LIMITS.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "That email address doesn’t look complete." }, { status: 422 });
  }

  const rect = b.rect && typeof b.rect === "object" ? (b.rect as Record<string, unknown>) : null;
  const vp = b.viewport && typeof b.viewport === "object" ? (b.viewport as Record<string, unknown>) : null;

  const row = {
    kind: (typeof b.kind === "string" && kinds.has(b.kind) ? b.kind : "other") as FeedbackKind,
    message,
    name: clip(b.name, LIMITS.name),
    email,
    page_path: page,
    page_title: clip(b.page_title, LIMITS.short),
    section: clip(b.section, LIMITS.short),
    target_label: clip(b.target_label, LIMITS.short),
    target_kind: clip(b.target_kind, 60),
    target_text: clip(b.target_text, LIMITS.text),
    selector: clip(b.selector, LIMITS.selector),
    whole_page: b.whole_page === true,
    rect: rect ? { x: finite(rect.x), y: finite(rect.y), width: finite(rect.width), height: finite(rect.height) } : null,
    viewport: vp ? { width: finite(vp.width), height: finite(vp.height), dpr: typeof vp.dpr === "number" ? vp.dpr : undefined, scrollY: finite(vp.scrollY) } : null,
    device: typeof b.device === "string" && devices.has(b.device) ? b.device : null,
    browser: clip(req.headers.get("user-agent"), 400),
    language: clip(b.language, 40),
    visitor_id: clip(b.visitor_id, 64),
  };

  try {
    const { id, stored } = await insertRow("feedback", row);
    return Response.json({ ok: true, id, stored }, { status: 201 });
  } catch (err) {
    console.error("[disha:feedback] could not store", err, JSON.stringify(row));
    return Response.json({ ok: false, error: "We couldn’t save that just now. Please try again in a moment." }, { status: 503 });
  }
}
