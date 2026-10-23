/*
 * Every enquiry, site-visit request and message the site helps a visitor send is also recorded, so
 * none is lost if the visitor never presses Send in WhatsApp or their email app.
 *
 * Call recordLead() from the browser at the moment the visitor confirms (before opening WhatsApp or
 * email). It never blocks or delays that hand-off: the request is fire-and-forget, survives the page
 * being left (keepalive), and a failure is silent to the visitor. The server stores it (see
 * src/app/api/leads/route.ts).
 */
export type LeadKind = "enquiry" | "site-visit" | "message" | "callback" | "guide";

export type Lead = {
  kind: LeadKind;
  name?: string;
  phone?: string;
  email?: string;
  /* What it is about: a community, a home type, a topic. */
  interest?: string;
  /* Free text the visitor wrote. */
  message?: string;
  /* The channel the visitor chose to continue on. */
  channel?: "whatsapp" | "email" | "call";
  /* Anything else the form collected (preferred date, time, place, budget…), as short strings. */
  details?: Record<string, string>;
  /* The visitor ticked the consent line on the form. */
  consent: boolean;
};

export function recordLead(lead: Lead) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ ...lead, page: location.pathname, referrer: document.referrer || undefined });
    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* recording must never get in the visitor's way */
  }
}
