import { proof } from "@/lib/content";
import { FilmPlayer } from "./FilmPlayer";
import s from "./ProofPanel.module.css";

/*
 * Where tesla.com shows Full Self-Driving: a grey panel with a headline, two figures, a button
 * and a film. Here: the ET award, the handover count, the residents' rating and Disha's own film.
 */
export function ProofPanel() {
  return (
    <section className={s.section} aria-labelledby="proof-title">
      <div className={s.panel}>
        <div className={s.content}>
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
                <dd>{b.value}</dd>
              </div>
            ))}
          </dl>
          <div className={s.buttons}>
            <a className="btn btn-primary" href={proof.primary.href}>
              {proof.primary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
