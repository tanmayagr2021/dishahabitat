import Image from "next/image";
import { promos } from "@/lib/content";
import { ArrowRight } from "./Icons";
import s from "./PromoGrid.module.css";

/* Two grey cards side by side, where tesla.com shows its offers and inventory. */
export function PromoGrid() {
  return (
    <section className={s.section} aria-label="More from Disha Habitat">
      <div className={s.grid}>
        {promos.map((p) => (
          <article key={p.title} className={s.card}>
            <div className={s.text}>
              <div>
                <h2 className={`display ${s.title}`}>{p.title}</h2>
                <p className={s.line}>{p.line}</p>
              </div>
              <a className={s.link} href={p.cta.href}>
                {p.cta.label}
                <ArrowRight />
              </a>
            </div>
            <div className={s.media}>
              <Image
                className={s.img}
                src={p.image.src}
                alt={p.image.alt}
                fill
                sizes="(min-width: 960px) 25vw, (min-width: 600px) 50vw, calc(100vw - 32px)"
                quality={78}
                style={{ objectPosition: p.image.position }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
