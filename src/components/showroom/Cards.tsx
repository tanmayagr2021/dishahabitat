import Image from "next/image";
import Link from "next/link";
import { Fragment, ViewTransition } from "react";
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
    <article className={`${s.card} lift`} data-tone="dark" aria-labelledby={`card-${c.slug}`}>
      {/* Named like the picture at the top of the community's own page, so a click morphs into it. */}
      <ViewTransition name={`community-${c.slug}`} share="morph" default="none">
        <Photo image={c.image} />
      </ViewTransition>
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
        <p className={s.line}>
          {c.line.split(" · ").map((part, k) => (
            <Fragment key={part}>
              {k > 0 && " · "}
              <span className={s.phrase}>{part}</span>
            </Fragment>
          ))}
        </p>
        <div className={s.ctas}>
          {c.ctas.map((cta) => (
            <Link
              key={cta.label}
              className={`btn ${cta.href === links.bookVisit ? "btn-primary" : "btn-ghost"}`}
              href={cta.href}
            >
              {cta.label}
              {cta.href !== links.bookVisit && <span className="sr-only">: {c.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
