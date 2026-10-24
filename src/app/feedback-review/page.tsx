import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Section, Tag } from "@/components/ds";
import { feedbackKinds, feedbackStatuses, showOnPageHref } from "@/lib/feedback";
import { isReviewer, reviewConfigured, reviewOpenLocally } from "@/lib/server/review-auth";
import { listRows, type Row, storeMode } from "@/lib/server/store";
import { setStatus, signOut } from "./actions";
import { SignIn } from "./SignIn";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Feedback review",
  robots: { index: false, follow: false },
};

const kindLabel = Object.fromEntries(feedbackKinds.map((k) => [k.id, k.label])) as Record<string, string>;
const statusLabel = Object.fromEntries(feedbackStatuses.map((k) => [k.id, k.label])) as Record<string, string>;
const leadStatusLabel: Record<string, string> = { new: "New", contacted: "Contacted", visit_booked: "Visit booked", closed: "Closed", spam: "Spam" };

const when = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
const str = (v: unknown) => (typeof v === "string" ? v : "");

/*
 * Where the team reads and sorts what visitors said, and every lead the site recorded. Filters are a
 * plain form (they work without scripts); each note links back to the exact part of the page.
 */
export default async function FeedbackReview(props: PageProps<"/feedback-review">) {
  if (!(await isReviewer())) {
    return (
      <>
        <PageIntro title="Feedback review" line="For the Disha Habitat team. Enter the review key to see feedback and leads." />
        <Section space="tight">
          {reviewConfigured ? (
            <SignIn />
          ) : (
            <p className={s.notice}>
              Review is switched off: set FEEDBACK_REVIEW_KEY in the site’s environment variables to open it.
            </p>
          )}
        </Section>
      </>
    );
  }

  const q = await props.searchParams;
  const one = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : undefined);
  const view = one("view") === "leads" ? "leads" : "feedback";
  const status = one("status");
  const kind = one("kind");
  const page = one("page");
  const sort = one("sort") ?? "newest";

  const all = await listRows(view, { limit: 1000 });
  let rows: Row[] = all.filter((r) => (!status || r.status === status) && (!kind || r.kind === kind) && (!page || r.page_path === page));
  if (sort === "oldest") rows = [...rows].reverse();
  if (sort === "page") rows = [...rows].sort((a, b) => str(a.page_path).localeCompare(str(b.page_path)));

  const pages = [...new Set(all.map((r) => str(r.page_path)).filter(Boolean))].sort();
  const counts = (view === "feedback" ? feedbackStatuses.map((x) => x.id) : Object.keys(leadStatusLabel)).map((id) => ({
    id,
    n: all.filter((r) => r.status === id).length,
  }));
  const labels = view === "feedback" ? statusLabel : leadStatusLabel;

  return (
    <>
      <PageIntro
        title={view === "feedback" ? "Feedback" : "Leads"}
        line={
          view === "feedback"
            ? "Every note visitors left, with the page and the part they pointed at. Open one on its page to see exactly what they meant."
            : "Every enquiry, site-visit request and message the site recorded before handing the visitor to WhatsApp, email or a call."
        }
      />
      <Section space="tight">
        <div className={s.top}>
          <nav className={s.tabs} aria-label="What to review">
            <Link href="/feedback-review" aria-current={view === "feedback" ? "page" : undefined}>
              Feedback
            </Link>
            <Link href="/feedback-review?view=leads" aria-current={view === "leads" ? "page" : undefined}>
              Leads
            </Link>
          </nav>
          <div className={s.meta}>
            <span>
              {storeMode === "supabase" ? "Stored in Supabase" : storeMode === "local" ? "Stored on this computer (.data/), not yet in Supabase" : "Not connected to a database yet"}
            </span>
            {!reviewOpenLocally && (
              <form action={signOut}>
                <button type="submit" className={s.linkButton}>
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>

        <ul className={s.counts}>
          {counts.map((c) => (
            <li key={c.id}>
              <Link href={`/feedback-review?view=${view}&status=${c.id}`} aria-current={status === c.id ? "true" : undefined}>
                <span className={s.countN}>{c.n}</span>
                <span>{labels[c.id]}</span>
              </Link>
            </li>
          ))}
        </ul>

        <form className={s.filters} method="get">
          <input type="hidden" name="view" value={view} />
          <label>
            <span>Status</span>
            <select name="status" defaultValue={status ?? ""}>
              <option value="">All</option>
              {Object.entries(labels).map(([id, l]) => (
                <option key={id} value={id}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          {view === "feedback" && (
            <label>
              <span>Kind</span>
              <select name="kind" defaultValue={kind ?? ""}>
                <option value="">All</option>
                {feedbackKinds.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </label>
          )}
          <label>
            <span>Page</span>
            <select name="page" defaultValue={page ?? ""}>
              <option value="">All pages</option>
              {pages.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Order</span>
            <select name="sort" defaultValue={sort}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="page">By page</option>
            </select>
          </label>
          <button type="submit" className="btn btn-dark">
            Apply
          </button>
          <Link className="btn btn-soft" href={`/feedback-review${view === "leads" ? "?view=leads" : ""}`}>
            Clear
          </Link>
        </form>

        <p className={s.total} aria-live="polite">
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </p>

        <ol className={s.list}>
          {rows.map((r) => (
            <li key={str(r.id)} className={s.item}>
              <div className={s.itemHead}>
                <Tag tone={r.status === "new" ? "ink" : "grey"}>{labels[str(r.status)] ?? str(r.status)}</Tag>
                <Tag tone="grey">{view === "feedback" ? (kindLabel[str(r.kind)] ?? "Other") : str(r.kind)}</Tag>
                <span className={s.when}>{r.created_at ? when.format(new Date(str(r.created_at))) : ""}</span>
                {r.device ? <span className={s.when}>{str(r.device)}</span> : null}
              </div>

              {view === "feedback" ? (
                <>
                  <p className={s.message}>{str(r.message)}</p>
                  <p className={s.where}>
                    <span className={s.path}>{str(r.page_path)}</span>
                    {r.whole_page ? " · the whole page" : ` · ${[str(r.section), str(r.target_label)].filter(Boolean).join(" › ")}`}
                  </p>
                  {r.target_text && !r.whole_page ? <p className={s.quote}>“{str(r.target_text).slice(0, 220)}”</p> : null}
                </>
              ) : (
                <>
                  <p className={s.message}>
                    {[str(r.name), str(r.phone), str(r.email)].filter(Boolean).join(" · ")}
                  </p>
                  <p className={s.where}>
                    {[str(r.interest), str(r.channel) && `via ${str(r.channel)}`, str(r.page_path)].filter(Boolean).join(" · ")}
                  </p>
                  {r.message ? <p className={s.quote}>{str(r.message)}</p> : null}
                  {r.details && typeof r.details === "object" ? (
                    <dl className={s.details}>
                      {Object.entries(r.details as Record<string, string>).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </>
              )}

              {(r.name || r.email) && view === "feedback" ? (
                <p className={s.who}>
                  From {[str(r.name), str(r.email)].filter(Boolean).join(", ")}
                </p>
              ) : null}

              <div className={s.itemFoot}>
                {view === "feedback" && (
                  <a className="text-link" href={showOnPageHref({ page_path: str(r.page_path), selector: str(r.selector) || null, target_label: str(r.target_label), section: str(r.section), rect: r.rect })} target="_blank" rel="noopener">
                    Show on the page
                  </a>
                )}
                <form action={setStatus} className={s.statusForm}>
                  <input type="hidden" name="table" value={view} />
                  <input type="hidden" name="id" value={str(r.id)} />
                  <label className="sr-only" htmlFor={`st-${str(r.id)}`}>
                    Status
                  </label>
                  <select id={`st-${str(r.id)}`} name="status" defaultValue={str(r.status)}>
                    {Object.entries(labels).map(([id, l]) => (
                      <option key={id} value={id}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor={`nt-${str(r.id)}`}>
                    Team note
                  </label>
                  <input id={`nt-${str(r.id)}`} name="team_note" defaultValue={str(r.team_note)} placeholder="Team note (optional)" />
                  <button type="submit" className="btn btn-soft">
                    Save
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ol>
        {rows.length === 0 && <p className={s.notice}>Nothing here yet.</p>}
      </Section>
    </>
  );
}
