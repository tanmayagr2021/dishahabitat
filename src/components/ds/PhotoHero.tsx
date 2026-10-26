import Image from "next/image";
import type { Img } from "@/lib/content";
import { focusPoint } from "@/lib/focus";
import { type Cta, CtaLink } from "./CtaLink";
import s from "./PhotoHero.module.css";

export type Spec = { value: string; label: string };

type Props = {
  title: string;
  /* A short line under the title: what it is, where, for whom. */
  line?: string;
  /* A word above the title, such as "Now selling" or "Handed over 2018". */
  eyebrow?: string;
  image: Img;
  /* Up to three figures along the foot of the picture, as tesla.com shows range and speed. */
  specs?: Spec[];
  /* The first is the brass button; any second is dark glass. */
  actions?: Cta[];
  /* Small print in the corner, such as "Artist's impression". */
  note?: string;
};

/*
 * A page that opens on a photograph, the way tesla.com opens each model: the name at the top over a
 * soft scrim, three figures and the buttons at the foot. The header floats over it in white.
 */
export function PhotoHero({ title, line, eyebrow, image, specs, actions, note }: Props) {
  return (
    <section className={s.hero} data-tone="dark" aria-labelledby="page-title">
      <Image
        className={s.media}
        src={image.src}
        alt={image.alt}
        fill
        sizes="(orientation: portrait) 70vh, 100vw"
        quality={78}
        loading="eager"
        fetchPriority="high"
        style={focusPoint(image)}
      />
      <div className={s.scrim} aria-hidden="true" />
      <div className={s.copy}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h1 id="page-title" className={`display ${s.title}`}>
          {title}
        </h1>
        {line && <p className={s.line}>{line}</p>}
      </div>
      {(specs?.length || actions?.length) && (
        <div className={s.foot}>
          {specs && specs.length > 0 && (
            <dl className={s.specs}>
              {specs.map((sp) => (
                <div key={sp.label} className={s.spec}>
                  <dt>{sp.label}</dt>
                  <dd>{sp.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {actions && actions.length > 0 && (
            <div className={s.ctas}>
              {actions.map((a, i) => (
                <CtaLink key={a.label} href={a.href} className={`btn ${i === 0 ? "btn-primary" : "btn-ghost"}`}>
                  {a.label}
                </CtaLink>
              ))}
            </div>
          )}
        </div>
      )}
      {note && <p className={s.note}>{note}</p>}
    </section>
  );
}
