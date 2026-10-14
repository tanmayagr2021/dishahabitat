"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dishaFamily } from "@/lib/site";

/*
 * Two stacks of prints, like an album left open on the coffee table: one of homeowners, one of the
 * team. Tap the top print and it is tossed to the back of its pile; the arrows go either way.
 */
const captions: Record<string, string> = {
  "/images/people/family-1.jpg": "Home is where the giggles are",
  "/images/people/family-2.jpg": "Three generations, one sofa",
  "/images/people/family-3.jpg": "The whole gang",
  "/images/people/family-4.jpg": "Welcome home, little one",
  "/images/people/team-1.jpg": "All smiles at Disha",
  "/images/people/team-2.jpg": "The site team",
  "/images/people/team-4.jpg": "Going over the plans",
  "/images/people/team-3.jpg": "Checkmate!",
};

const piles = [
  { kind: "Homeowners", note: "the families who live in our homes", photos: dishaFamily.filter((f) => f.kind === "Homeowners"), tilt: [-3, 5, -7, 9] },
  { kind: "The team", note: "the people who build them", photos: dishaFamily.filter((f) => f.kind === "The team"), tilt: [3, -5, 7, -9] },
];

export function FamilyStacks() {
  return (
    <div className="grid gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-14">
      {piles.map((p, i) => (
        <Pile key={p.kind} {...p} delay={i * 160} />
      ))}
    </div>
  );
}

function Pile({ kind, note, photos, tilt, delay }: (typeof piles)[number] & { delay: number }) {
  const n = photos.length;
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [tossing, setTossing] = useState<{ index: number; dir: 1 | -1 } | null>(null);
  const busy = useRef(false);
  const touched = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  // Toss the top print to the back of the pile. Uses the latest order, so timers can call it too.
  const toss = () => {
    if (busy.current) return;
    busy.current = true;
    setOrder((o) => {
      setTossing({ index: o[0], dir: 1 });
      return o;
    });
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setTossing(null);
      busy.current = false;
    }, 380);
  };
  const next = () => {
    touched.current = true;
    toss();
  };
  const prev = () => {
    touched.current = true;
    if (busy.current) return;
    setOrder((o) => [o[n - 1], ...o.slice(0, n - 1)]);
  };

  // A short demo when the album first comes into view: two prints go over on their own, then it
  // waits for the visitor. Any tap stops it.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ts: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        [1400, 3600].forEach((ms) => ts.push(window.setTimeout(() => !touched.current && toss(), ms + delay * 4)));
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top = order[0];

  return (
    <div ref={root} className="mx-auto w-full max-w-[26rem]">
      <p className="font-[family-name:var(--font-caveat)] text-[2rem] leading-none text-brass">{kind}</p>
      <p className="mt-1 text-sm text-paper/60">{note}</p>

      <div className="stack-pile mt-8 grid" style={{ "--d": `${delay}ms` } as CSSProperties}>
        {photos.map((f, i) => {
          const depth = order.indexOf(i);
          const isTop = depth === 0;
          const out = tossing?.index === i;
          const style = {
            gridArea: "1 / 1",
            zIndex: n - depth,
            rotate: `${out ? tilt[0] + 16 : tilt[depth]}deg`,
            translate: out ? "62% -8%" : `${depth * 4}px ${depth * 6}px`,
          } as CSSProperties;
          return (
            <button
              key={f.src}
              type="button"
              tabIndex={isTop ? 0 : -1}
              aria-hidden={!isTop}
              aria-label={isTop ? `${f.alt}. Photo ${i + 1} of ${n}. Press for the next photo.` : undefined}
              onClick={isTop ? next : undefined}
              className={`stack-print block bg-[#fbf8f1] p-3 pb-0 text-left text-ink shadow-[0_16px_28px_-16px_rgb(0_0_0/0.6)] ${isTop ? "cursor-pointer" : "pointer-events-none"}`}
              style={style}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-ink">
                <Image src={f.src} alt="" fill sizes="(min-width: 640px) 26rem, 90vw" className="object-cover" />
              </span>
              <span className="block py-3 text-center font-[family-name:var(--font-caveat)] text-[1.6rem] leading-none text-ink/80">{captions[f.src]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="label tabular-nums text-paper/60">
          {String(top + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={prev} aria-label={`Previous ${kind.toLowerCase()} photo`} className="inline-flex size-11 items-center justify-center rounded-full border border-paper/20 transition-colors hover:bg-paper hover:text-ink">
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button type="button" onClick={next} aria-label={`Next ${kind.toLowerCase()} photo`} className="inline-flex size-11 items-center justify-center rounded-full border border-paper/20 transition-colors hover:bg-paper hover:text-ink">
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
