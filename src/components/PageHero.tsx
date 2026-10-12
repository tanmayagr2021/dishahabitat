import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Eyebrow, MediaBadge } from "@/components/ui";
import type { Media } from "@/lib/projects";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/* Dark opening for inner pages: a full-bleed photograph, or forest with the contour texture. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imagePosition = "50% 50%",
  aside,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  image?: Pick<Media, "src" | "alt" | "caption" | "kind">;
  imagePosition?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      data-tone="dark"
      className={`grain relative isolate overflow-hidden bg-forest-900 text-ivory ${image ? "" : "topo [--topo-opacity:0.35]"}`}
    >
      {image && (
        <>
          <div aria-hidden={!image.alt} className="anim-settle absolute inset-0 -z-10">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: imagePosition }}
            />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/35 to-forest-950/10" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/70 via-forest-950/20 to-transparent" />
          <MediaBadge kind={image.kind} className="left-auto right-5 top-24 md:right-10 md:top-28" />
        </>
      )}

      <div
        className={`shell flex flex-col justify-end pb-14 pt-36 md:pb-20 md:pt-44 ${image ? "min-h-[82svh] lg:min-h-[88svh]" : ""}`}
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Eyebrow className="anim-fade text-ivory/70">{eyebrow}</Eyebrow>
            <h1
              className="display anim-rise mt-7 text-[3.4rem] leading-[0.9] min-[400px]:text-[3.9rem] sm:text-[5.4rem] xl:text-[7.4rem]"
              style={d(120)}
            >
              {title}
            </h1>
          </div>
          {(intro || aside) && (
            <div className="anim-rise lg:col-span-4 lg:pb-3" style={d(300)}>
              {intro && <div className="max-w-md leading-relaxed text-ivory/75">{intro}</div>}
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>

      {image?.caption && (
        <p className="absolute right-5 top-28 hidden max-w-xs text-right text-[0.65rem] uppercase tracking-[0.2em] text-ivory/55 md:block md:right-10 md:top-32 xl:right-[4.5rem]">
          {image.caption}
        </p>
      )}
    </section>
  );
}
