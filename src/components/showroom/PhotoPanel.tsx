import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Cta, Img } from "@/lib/content";
import { focusPoint } from "@/lib/focus";
import s from "./PhotoPanel.module.css";

type Props = {
  id?: string;
  /* Names the picture so a click morphs into the community page's own top picture. */
  morph?: string;
  image: Img;
  eyebrow?: string;
  title: string;
  line: string;
  /* The first is the brass primary, the second a ghost button. */
  ctas: Cta[];
  /* Added to the primary link's spoken name, so six "Explore" links are told apart. */
  about?: string;
  /* Half of the screen's width (the promo tiles) instead of all of it. */
  half?: boolean;
  /* Buttons on a promo tile are white, because the brass belongs to the panels above. */
  light?: boolean;
};

/*
 * One full-screen photograph, as on tesla.com's home page: the title and one line at the top, below
 * the header, and the buttons at the foot, each over the shared shade. The picture is lazy; only the hero's loads at once.
 */
export function PhotoPanel({ id, morph, image, eyebrow, title, line, ctas, about, half, light }: Props) {
  const tid = `${id ?? title}-title`.replace(/\W+/g, "-");
  const photo = (
    <Image
      className={s.media}
      src={image.src}
      alt={image.alt}
      fill
      sizes={half ? "(min-width: 900px) 50vw, 100vw" : "100vw"}
      quality={75}
      style={focusPoint(image)}
    />
  );
  return (
    <section id={id} className={s.panel} data-tone="dark" data-half={half || undefined} aria-labelledby={tid}>
      {morph ? (
        <ViewTransition name={morph} share="morph" default="none">
          {photo}
        </ViewTransition>
      ) : (
        photo
      )}
      <div className={`photo-copy ${s.copy} reveal`}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h2 id={tid} className={`display ${s.title}`}>
          {title}
        </h2>
        <p className={s.line}>
          {line.split(" · ").map((part) => (
            <span key={part} className={s.part}>
              {part}
            </span>
          ))}
        </p>
      </div>
      <div className={`${s.ctas} reveal`}>
        {ctas.map((cta, i) => (
          <Link
            key={cta.label}
            className={`btn ${light ? "btn-white" : i === 0 ? "btn-primary" : "btn-ghost"}`}
            href={cta.href}
          >
            {cta.label}
            {i === 0 && about && <span className="sr-only">: {about}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
