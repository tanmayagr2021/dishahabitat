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
  children,
}: {
  label: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  image?: Pick<Media, "src" | "alt" | "caption" | "kind">;
  imagePosition?: string;
  morph?: string;
  aside?: ReactNode;
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
      className={`grain relative isolate overflow-hidden bg-ink text-paper ${image ? "min-h-[88svh] lg:min-h-[100svh]" : ""} flex flex-col`}
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
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-ink/35" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
          <MediaBadge kind={image.kind} className="left-auto right-5 top-24 md:right-10 md:top-28" />
        </>
      )}

      <div className={`shell flex flex-1 flex-col justify-end pb-12 md:pb-16 ${image ? "pt-36" : "pt-40 md:pt-52"}`}>
        <Label className="anim-fade text-paper/70" as="p">
          {label}
        </Label>
        <h1 className="mt-6 serif text-[clamp(3.6rem,10vw,11rem)] leading-[0.86]">
          <span className="line">
            <span className="anim-rise" style={d(150)}>
              {title}
            </span>
          </span>
        </h1>
        {(intro || aside) && (
          <div
            className="anim-fade-up mt-10 flex flex-col gap-8 border-t border-paper/20 pt-6 md:mt-14 md:flex-row md:items-start md:justify-between"
            style={d(450)}
          >
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
