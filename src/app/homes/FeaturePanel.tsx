import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { Media } from "@/lib/projects";

import s from "./FeaturePanel.module.css";

type Props = {
  id?: string;
  image: Media;
  eyebrow: string;
  title: string;
  line: string;
  /* Where the picture is anchored on a wide screen and on a phone. */
  position?: string;
  mobilePosition?: string;
  /* The one quiet text link. */
  children?: ReactNode;
};

/*
 * A full-bleed photograph, the way tesla.com shows each feature: the title and line at the top, the one
 * link at the foot (as every photo panel on the site). Always below the fold, so the picture loads lazily.
 */
export function FeaturePanel({ id, image, eyebrow, title, line, position = "50% 50%", mobilePosition, children }: Props) {
  return (
    <section id={id} className={s.panel} data-tone="dark" aria-labelledby={id ? `${id}-title` : undefined}>
      <Image
        className={s.media}
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        quality={78}
        loading="lazy"
        style={{ "--pos": position, "--pos-m": mobilePosition ?? position } as CSSProperties}
      />
      <div className={s.scrim} aria-hidden="true" />
      <div className={`photo-copy reveal ${s.copy}`}>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 id={id ? `${id}-title` : undefined} className={`display ${s.title}`}>
          {title}
        </h2>
        <p className={s.line}>{line}</p>
      </div>
      {children && <div className={`photo-foot reveal ${s.link}`}>{children}</div>}
      <p className={s.note}>Artist’s impression</p>
    </section>
  );
}
