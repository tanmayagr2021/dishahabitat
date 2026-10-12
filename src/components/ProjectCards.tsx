import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { MediaBadge, Reveal } from "@/components/ui";
import type { PortfolioItem } from "@/lib/portfolio";

/*
 * The project-card family. Related, not identical:
 *  - InteractiveProjectCard: a large photograph; details rise into place on hover or focus
 *    (and are always shown on touch screens, where there is no hover).
 *  - EditorialProjectCard: an asymmetric image-and-text spread.
 *  - CompactProjectCard: a practical row for browsing and filtering.
 * The featured card for the project on sale is composed in its own section (Featured.tsx).
 */

function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex items-center ${className}`}>
      <span className="h-px w-5 bg-current transition-[width] duration-700 ease-out-expo group-hover:w-10 group-focus-visible:w-10" />
      <span className="-ml-[7px] size-[7px] rotate-45 border-r border-t border-current" />
    </span>
  );
}

function StatusLine({ p, className = "" }: { p: PortfolioItem; className?: string }) {
  return (
    <span className={`label flex items-center gap-2 ${className}`}>
      <span aria-hidden className="size-2" style={{ background: p.hue }} />
      {p.status === "Now selling" ? "Now selling" : `Delivered ${p.handoverYear}`} · {p.locality.replace(", Bengaluru", "")}
    </span>
  );
}

export function InteractiveProjectCard({
  p,
  aspect = "aspect-[16/11]",
  sizes = "(min-width: 1024px) 60vw, 100vw",
  morph = false,
  delay = 0,
}: {
  p: PortfolioItem;
  aspect?: string;
  sizes?: string;
  morph?: boolean;
  delay?: number;
}) {
  const image = (
    <Image
      src={p.image.src}
      alt={p.image.alt}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
      style={{ objectPosition: p.image.position }}
    />
  );
  return (
    <Reveal variant="mask" delay={delay}>
      <Link
        href={p.href}
        className={`group relative block overflow-hidden bg-forest text-paper ${aspect}`}
        style={{ "--hue": p.hue } as CSSProperties}
      >
        {morph ? (
          <ViewTransition name={`cover-${p.slug}`} share="morph" default="none">
            {image}
          </ViewTransition>
        ) : (
          image
        )}
        <MediaBadge kind={p.image.kind} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/10 to-transparent" />
        {/* A line in the community's colour runs along the base, and lengthens on hover. */}
        <span aria-hidden className="absolute bottom-0 left-0 h-[3px] w-16 bg-[var(--hue)] transition-[width] duration-700 ease-out-expo group-hover:w-full group-focus-visible:w-full" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
          <StatusLine p={p} className="text-paper/80" />
          <div className="mt-3 flex items-end justify-between gap-6">
            <h3 className="serif text-[clamp(2rem,3.4vw,3.6rem)] leading-[0.95]">{p.shortName}</h3>
            <Arrow className="mb-2 shrink-0 text-paper" />
          </div>
          {/* Details: always visible on touch screens; on hover screens they rise on hover or focus. */}
          <div className="grid transition-[grid-template-rows,opacity] duration-700 ease-out-expo [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:grid-rows-[1fr] [@media(hover:hover)]:group-focus-visible:opacity-100">
            <dl className="flex gap-8 overflow-hidden pt-4">
              {p.facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="label mt-1 text-[0.58rem] text-paper/60">{f.label}</dt>
                  <dd className="text-[1.05rem] tabular-nums">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function EditorialProjectCard({ p, index, flip = false }: { p: PortfolioItem; index: string; flip?: boolean }) {
  return (
    <Link href={p.href} className="group grid items-center gap-8 md:grid-cols-12 md:gap-10">
      <Reveal variant="mask" className={`relative aspect-[4/3] overflow-hidden md:col-span-7 ${flip ? "md:order-2" : ""}`}>
        <Image
          src={p.image.src}
          alt={p.image.alt}
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
          style={{ objectPosition: p.image.position }}
        />
        <MediaBadge kind={p.image.kind} />
      </Reveal>
      <div className={`relative md:col-span-5 ${flip ? "md:order-1 md:pr-4" : "md:pl-4"}`}>
        <span aria-hidden className="serif block text-[clamp(5rem,9vw,9rem)] leading-[0.8] text-ink/[0.07]">
          {index}
        </span>
        <StatusLine p={p} className="-mt-6 text-mute" />
        <h3 className="serif mt-4 text-[clamp(2.4rem,4vw,4rem)] leading-[0.95]">{p.shortName}</h3>
        <p className="mt-5 max-w-md leading-relaxed text-ink/75">{p.intro}</p>
        <dl className="mt-7 grid max-w-md grid-cols-3 border-t border-ink/15">
          {p.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse border-r border-ink/10 py-4 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
              <dt className="label mt-1 text-[0.58rem] text-mute">{f.label}</dt>
              <dd className="serif text-[1.6rem] leading-none">{f.value}</dd>
            </div>
          ))}
        </dl>
        <span className="label mt-7 inline-flex items-center gap-3 text-ink">
          Visit {p.shortName}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

export function CompactProjectCard({
  p,
  selected = false,
  onSelect,
  controls,
}: {
  p: PortfolioItem;
  selected?: boolean;
  onSelect?: () => void;
  controls?: string;
}) {
  const body = (
    <>
      <span className="relative block aspect-square w-16 shrink-0 overflow-hidden md:w-20">
        <Image src={p.image.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: p.image.position }} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <StatusLine p={p} className={`text-[0.6rem] ${selected ? "text-paper/70" : "text-current/60"}`} />
        <span className="serif mt-1 block text-[1.45rem] leading-tight">{p.shortName}</span>
        <span className={`mt-0.5 block text-sm ${selected ? "text-paper/65" : "opacity-60"}`}>
          {[p.homes && `${p.homes} homes`, `${p.acres} acres`].filter(Boolean).join(" · ")}
        </span>
      </span>
      <span
        aria-hidden
        className={`h-full w-[3px] self-stretch transition-colors ${selected ? "bg-cyan" : "bg-transparent"}`}
      />
    </>
  );
  const cls = `group flex w-full items-center gap-4 p-2.5 pr-0 transition-colors duration-300 ${
    selected ? "bg-forest-2 text-paper" : "hover:bg-paper/[0.06]"
  }`;
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} aria-pressed={selected} aria-controls={controls} className={cls}>
        {body}
      </button>
    );
  }
  return (
    <Link href={p.href} className={cls}>
      {body}
    </Link>
  );
}
