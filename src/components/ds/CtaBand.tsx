import { type Cta, CtaLink } from "./CtaLink";
import s from "./CtaBand.module.css";

/* A page ends on its one action: a hairline, the invitation, and at most two buttons right under it. */
export function CtaBand({ title, line, actions, id = "cta-title" }: { title: string; line?: string; actions: Cta[]; id?: string }) {
  return (
    <section className={s.section} aria-labelledby={id}>
      <div className={s.inner}>
        <div>
          <h2 id={id} className={`display ${s.title}`}>
            {title}
          </h2>
          {line && <p className={s.line}>{line}</p>}
        </div>
        <div className={s.buttons}>
          {actions.map((a, i) => (
            <CtaLink key={a.label} href={a.href} className={`btn ${i === 0 ? "btn-primary" : "btn-soft"}`}>
              {a.label}
            </CtaLink>
          ))}
        </div>
      </div>
    </section>
  );
}
