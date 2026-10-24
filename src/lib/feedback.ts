/*
 * The feedback tool's shared vocabulary, used by the widget in the browser and by the server that
 * stores each note (src/app/api/feedback/route.ts). Kinds and statuses match the database's checks
 * (supabase/migrations/20261023000000_feedback_and_leads.sql).
 */
export const feedbackKinds = [
  { id: "problem", label: "Something’s wrong", hint: "A mistake, a broken link, something that doesn’t work" },
  { id: "content", label: "Words or facts", hint: "Text, figures or pictures to change" },
  { id: "design", label: "Look and layout", hint: "How it looks or where things sit" },
  { id: "idea", label: "An idea", hint: "Something to add or do differently" },
  { id: "praise", label: "I like this", hint: "Keep it as it is" },
] as const;

export type FeedbackKind = (typeof feedbackKinds)[number]["id"] | "other";

export const feedbackStatuses = [
  { id: "new", label: "New" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
  { id: "wont_fix", label: "Won’t change" },
] as const;

export type FeedbackStatus = (typeof feedbackStatuses)[number]["id"];

/* What the widget sends: the note, and where on which page it points. */
export type FeedbackInput = {
  kind: FeedbackKind;
  message: string;
  name?: string;
  email?: string;
  page_path: string;
  page_title?: string;
  section?: string;
  target_label?: string;
  target_kind?: string;
  target_text?: string;
  selector?: string;
  whole_page: boolean;
  rect?: { x: number; y: number; width: number; height: number };
  viewport?: { width: number; height: number; dpr: number; scrollY: number };
  device?: "phone" | "tablet" | "computer";
  language?: string;
  visitor_id?: string;
  /* A field people never see; anything in it means a bot filled the form. */
  website?: string;
};

export const LIMITS = {
  message: 4000,
  name: 120,
  email: 200,
  short: 300,
  text: 600,
  selector: 1000,
} as const;

/*
 * The page address a stored note points back to. Opening it highlights the part the visitor pointed
 * at (found again by its selector, or by its position if the page has changed since).
 */
export function showOnPageHref(row: { page_path: string; selector?: string | null; target_label?: string | null; section?: string | null; rect?: unknown }) {
  const q = new URLSearchParams();
  if (row.selector) q.set("fb", row.selector);
  const label = [row.section, row.target_label].filter(Boolean).join(" › ");
  if (label) q.set("fbl", label);
  const r = row.rect as { x?: number; y?: number; width?: number; height?: number } | null | undefined;
  if (r && typeof r.x === "number" && typeof r.y === "number") q.set("fbr", [r.x, r.y, r.width ?? 0, r.height ?? 0].join(","));
  const qs = q.toString();
  return qs ? `${row.page_path}${row.page_path.includes("?") ? "&" : "?"}${qs}` : row.page_path;
}
