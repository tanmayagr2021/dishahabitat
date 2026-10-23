import type { ReactNode } from "react";
import { type Cta, CtaLink } from "./CtaLink";
import s from "./PageIntro.module.css";

type Props = {
  title: string;
  line?: ReactNode;
  /* Breadcrumbs or a short word above the title. */
  above?: ReactNode;
  actions?: Cta[];
  children?: ReactNode;
};

/* A page that opens on white: a large serif title, one line, and at most two buttons. */
export function PageIntro({ title, line, above, actions, children }: Props) {
  return (
    <header className={s.intro}>
      {above && <div className={s.above}>{above}</div>}
      <h1 className={`display ${s.title}`}>{title}</h1>
      {line && <p className={s.line}>{line}</p>}
      {actions && actions.length > 0 && (
        <div className={s.ctas}>
          {actions.map((a, i) => (
            <CtaLink key={a.label} href={a.href} className={`btn ${i === 0 ? "btn-primary" : "btn-soft"}`}>
              {a.label}
            </CtaLink>
          ))}
        </div>
      )}
      {children}
    </header>
  );
}
