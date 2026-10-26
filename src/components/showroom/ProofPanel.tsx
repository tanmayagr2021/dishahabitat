import type { CSSProperties } from "react";
import { proof } from "@/lib/content";
import { FilmPlayer } from "./FilmPlayer";
import s from "./ProofPanel.module.css";

/*
 * A figure that counts up once as it scrolls into view, in CSS alone. The real text stays in the page (and for
 * screen readers); where the counter cannot run, it is simply what is shown.
 */
function Figure({ value }: { value: string }) {
  const m = /^(\d+)(?:\.(\d))?(.*)$/.exec(value);
  if (!m) return value;
  const [, whole = "0", tenth = "0", rest = ""] = m;
  const style = { "--to-a": Number(whole), "--to-b": Number(tenth), "--rest": JSON.stringify(rest) } as CSSProperties;
  return (
    <>
      <span className={s.real}>{value}</span>
      <span className={s.count} style={style} data-decimal={m[2] ? "" : undefined} aria-hidden="true" />
    </>
  );
}

/*
 * Where tesla.com shows Full Self-Driving: a grey panel with a headline, two figures, a button
 * and a film. Here: the ET award, the handover count, the residents' rating and Disha's own film.
 */
export function ProofPanel() {
  return (
    <section className={s.section} aria-labelledby="proof-title">
      <div className={s.panel}>
        <div className={`${s.content} reveal`}>
          <h2 id="proof-title" className={`display ${s.title}`}>
            {proof.title}
          </h2>
          <p className={s.line}>{proof.line}</p>
        </div>
        <div className={s.media}>
          <FilmPlayer src={proof.film.src} poster={proof.film.poster} label={proof.film.label} />
        </div>
        <div className={s.cta}>
          <dl className={s.badges}>
            {proof.badges.map((b) => (
              <div key={b.label} className={s.badge}>
                <dt>
                  {b.label}
                  {"note" in b && (
                    <sup>
                      <a href={`#note-${b.note}`} aria-label={`Note ${b.note}`}>
                        {b.note}
                      </a>
                    </sup>
                  )}
                </dt>
                <dd>
                  <Figure value={b.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
