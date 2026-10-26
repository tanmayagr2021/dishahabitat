import Image from "next/image";
import { type Community, type Img, links } from "@/lib/content";
import { focusPoint } from "@/lib/focus";
import s from "./Cards.module.css";

/* A card is taller than it is wide on a phone, so its landscape picture is drawn about 900px wide. */
const SIZES = "(min-width: 1100px) 1024px, 900px";

function Photo({ image }: { image: Img }) {
  return (
    <Image
      className={s.media}
      src={image.src}
      alt={image.alt}
      fill
      sizes={SIZES}
      quality={78}
      style={focusPoint(image)}
    />
  );
}

/* A community card: what it is top left, its name, one fact and the buttons at the foot. */
export function CommunityCard({ c }: { c: Community }) {
  return (
    <article className={s.card} data-tone="dark" aria-labelledby={`card-${c.slug}`}>
      <Photo image={c.image} />
      <div className={s.scrim} aria-hidden="true" />
      <div className={s.top}>
        <div>
          <p className={s.eyebrow}>{c.eyebrow}</p>
          <p className={s.place}>{c.place}</p>
        </div>
        {c.render && <p className={s.tag}>Artist’s impression</p>}
      </div>
      <div className={s.bottom}>
        <h3 id={`card-${c.slug}`} className={`display ${s.name}`}>
          {c.name}
        </h3>
        <p className={s.line}>{c.line}</p>
        <div className={s.ctas}>
          {c.ctas.map((cta) => (
            <a
              key={cta.label}
              className={`btn ${cta.href === links.bookVisit ? "btn-primary" : "btn-ghost"}`}
              href={cta.href}
            >
              {cta.label}
              {cta.href !== links.bookVisit && <span className="sr-only">: {c.name}</span>}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
