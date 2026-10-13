"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { CompactProjectCard } from "@/components/ProjectCards";
import { buttonClass, ButtonInner, Label, MediaBadge } from "@/components/ui";
import { portfolio, type PortfolioItem } from "@/lib/portfolio";

/*
 * Browse every community. Filters use only attributes published for all of them (status);
 * sorting uses published figures (handover year, homes, land). Where a figure isn't published
 *, the number of homes at Pursuit of the Elements, the project sorts last rather than being
 * given an invented number.
 */
const statuses = ["All", "Now selling", "Delivered"] as const;
const sorts = {
  newest: { label: "Newest", fn: (a: PortfolioItem, b: PortfolioItem) => (b.handoverYear ?? 9999) - (a.handoverYear ?? 9999) },
  homes: { label: "Most homes", fn: (a: PortfolioItem, b: PortfolioItem) => (b.homes ?? -1) - (a.homes ?? -1) },
  land: { label: "Largest site", fn: (a: PortfolioItem, b: PortfolioItem) => b.acres - a.acres },
} as const;
type SortKey = keyof typeof sorts;

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  count,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  count?: (v: T) => number;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-x-1 gap-y-2">
      <span className="mr-3 text-[0.92rem] text-paper/55">{label}</span>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-[0.92rem] transition-colors ${
              on ? "border-paper bg-paper text-ink" : "border-paper/20 text-paper/75 hover:border-paper/60 hover:text-paper"
            }`}
          >
            {o.label}
            {count && <span className={on ? "text-ink/50" : "text-paper/40"}>{count(o.value)}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Selected({ p }: { p: PortfolioItem }) {
  const [shot, setShot] = useState(0);
  const m = p.gallery[shot] ?? p.gallery[0];
  const enquireHref = p.status === "Now selling" ? `${p.href}#enquire` : "/contact#book";

  return (
    <article key={p.slug} aria-labelledby="explorer-name" className="swap-in card-dark overflow-hidden p-3 md:p-4" style={{ "--hue": p.hue } as CSSProperties}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-forest-deep">
        {p.gallery.map((g, i) => (
          <Image
            key={g.src}
            src={g.src}
            alt={i === shot ? g.alt : ""}
            aria-hidden={i !== shot}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`object-cover transition-[opacity,scale] duration-[900ms] ease-out-expo ${i === shot ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
          />
        ))}
        <MediaBadge kind={m.kind} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-deep/80 to-transparent" />
        <p className="absolute bottom-4 left-4 right-4 text-sm text-paper/85 md:left-6">{m.caption}</p>
        <span aria-hidden className="absolute bottom-0 left-0 h-[3px] w-full bg-[var(--hue)]" />
      </div>
      <div role="group" aria-label="Photographs" className="mt-2 grid grid-cols-5 gap-2">
        {p.gallery.map((g, i) => (
          <button
            key={g.src}
            type="button"
            aria-pressed={i === shot}
            aria-label={`Show: ${g.caption}`}
            onClick={() => setShot(i)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-opacity ${i === shot ? "opacity-100 ring-2 ring-cyan ring-offset-2 ring-offset-forest-deep" : "opacity-55 hover:opacity-100"}`}
          >
            <Image src={g.src} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="grid gap-8 px-2 pb-3 pt-8 md:grid-cols-12 md:px-4">
        <div className="md:col-span-7">
          <p className="label flex items-center gap-2 text-paper/70">
            <span aria-hidden className="size-2" style={{ background: p.hue }} />
            {p.status === "Now selling" ? "Now selling" : `Delivered ${p.handoverYear}`} · {p.locality}
          </p>
          <h3 id="explorer-name" className="serif mt-3 text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[0.95]">
            {p.name}
          </h3>
          {p.configurations && <p className="mt-3 text-paper/80">{p.configurations}</p>}
          <p className="mt-4 leading-relaxed text-paper/70">{p.intro}</p>
        </div>
        <div className="md:col-span-5">
          <dl className="border-t border-paper/15">
            {p.facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-paper/10 py-3">
                <dt className="label text-[0.8rem] text-paper/55">{f.label}</dt>
                <dd className="serif text-[1.5rem] leading-none">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={p.href} className={buttonClass("paper")}>
              <ButtonInner>Visit {p.shortName}</ButtonInner>
            </Link>
            <Link href={enquireHref} className={buttonClass("outline-light")}>
              <ButtonInner>Enquire about this</ButtonInner>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectExplorer() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [picked, setPicked] = useState(portfolio[0].slug);

  const list = useMemo(
    () => portfolio.filter((p) => status === "All" || p.status === status).sort(sorts[sort].fn),
    [status, sort],
  );
  const selected = list.find((p) => p.slug === picked) ?? list[0];

  return (
    <section id="explore" data-tone="dark" aria-labelledby="explore-title" className="surface-deep grain py-16 md:py-24">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label n="08" className="text-paper/60">
              Project explorer
            </Label>
            <h2 id="explore-title" className="serif mt-8 text-[clamp(2.3rem,4.4vw,4.4rem)] leading-[1.02]">
              Every Disha community, <em>side by side.</em>
            </h2>
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-paper/70 lg:col-span-4 lg:col-start-9">
            Filter, sort and select a community to see its photographs and published facts, then visit its page or start an
            enquiry.
          </p>
        </div>

        <div className="card-dark mt-12 flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
          <Segmented
            label="Status"
            options={statuses.map((s) => ({ value: s, label: s }))}
            value={status}
            onChange={setStatus}
            count={(v) => portfolio.filter((p) => v === "All" || p.status === v).length}
          />
          <Segmented
            label="Sort"
            options={(Object.keys(sorts) as SortKey[]).map((k) => ({ value: k, label: sorts[k].label }))}
            value={sort}
            onChange={setSort}
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="mb-3 text-[0.92rem] text-paper/55" aria-live="polite">
              {list.length} {list.length === 1 ? "community" : "communities"}
            </p>
            <ul className="flex flex-col gap-1">
              {list.map((p) => (
                <li key={p.slug}>
                  <CompactProjectCard p={p} selected={p.slug === selected.slug} onSelect={() => setPicked(p.slug)} controls="explorer-selected" />
                </li>
              ))}
            </ul>
          </div>
          <div id="explorer-selected" className="min-w-0 lg:col-span-8">
            <Selected key={selected.slug} p={selected} />
          </div>
        </div>
      </div>
    </section>
  );
}
