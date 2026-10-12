import Image from "next/image";
import { ViewTransition, type CSSProperties, type ReactNode } from "react";
import { Label, MediaBadge } from "@/components/ui";
import type { Media } from "@/lib/projects";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * Opening for inner pages. With a photograph, it develops from black & white into colour;
 * `morph` names the image so it can travel in from the page that linked here.
 */
export function PageHero({
  label,
  title,
  intro,
  image,
  imagePosition = "50% 50%",
  morph,
  aside,
  compact = false,
  children,
}: {
  label: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  image?: Pick<Media, "src" | "alt" | "caption" | "kind">;
  imagePosition?: string;
  morph?: string;
  aside?: ReactNode;
  /* A shorter opening for tool pages, so the tool itself shows on first screen. */
  compact?: boolean;
  children?: ReactNode;
}) {
  const photo = image && (
    <div aria-hidden={!image.alt} className="absolute inset-0">
      <div className="anim-develop absolute inset-0">
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
    </div>
  );

  return (
    <section
      data-tone="dark"
      className={`surface-deep grain relative isolate overflow-hidden ${image ? "min-h-[88svh] lg:min-h-[100svh]" : ""} flex flex-col`}
    >
      {image && (
        <>
          <div className="absolute inset-0 -z-10">
            {morph ? (
              <ViewTransition name={morph} share="morph" default="none">
                {photo}
              </ViewTransition>
            ) : (
              photo
            )}
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/30 to-forest-deep/35" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/65 via-forest-deep/10 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-forest-deep/75 to-transparent" />
          <MediaBadge kind={image.kind} className="left-auto right-5 top-24 md:right-10 md:top-28" />
        </>
      )}

      <div className={`shell flex flex-1 flex-col justify-end ${compact ? "pb-10 pt-28 md:pt-32" : `pb-12 md:pb-16 ${image ? "pt-36" : "pt-40 md:pt-48"}`}`}>
        <Label className="anim-fade text-paper/70" as="p">
          {label}
        </Label>
        <h1 className={`serif ${compact ? "mt-5 text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95]" : "mt-6 max-w-[16ch] text-[clamp(2.8rem,5.8vw,6rem)] leading-[0.9]"}`}>
          <span className="line">
            <span className="anim-rise" style={d(150)}>
              {title}
            </span>
          </span>
        </h1>
        {(intro || aside) && (
          <div
            className={`anim-fade-up relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between ${compact ? "mt-5" : "mt-10 border-t border-paper/20 pt-6 md:mt-12"}`}
            style={d(450)}
          >
            {!compact && <span aria-hidden className="anim-draw absolute -top-px left-0 h-px w-32 bg-cyan" style={d(600)} />}
            {intro && <div className="max-w-xl text-[1.08rem] leading-relaxed text-paper/80">{intro}</div>}
            {aside}
          </div>
        )}
        {children}
      </div>

      {image?.caption && (
        <p className="label absolute right-5 top-24 hidden max-w-xs text-right text-paper/60 md:right-10 md:top-28 md:block xl:right-14">
          {image.kind === "photo" && image.caption}
        </p>
      )}
    </section>
  );
}
