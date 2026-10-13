"use client";

import { useEffect, useState } from "react";

/*
 * A bookmark ribbon for the memoir: one mark per chapter down the right edge (wide screens only),
 * the current chapter lit, its title shown on hover or focus. Jumping is a plain anchor link.
 */
export function ChapterRibbon({ chapters }: { chapters: { id: string; n: string; title: string }[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const first = els[0];
    const onScroll = () => setVisible(!!first && first.getBoundingClientRect().top < window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [chapters]);

  return (
    <nav
      aria-label="Chapters"
      className={`fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 min-[1480px]:block ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ol className="flex flex-col items-end gap-2 rounded-full bg-forest-deep/70 px-2 py-3 backdrop-blur-md">
        {chapters.map((c, i) => {
          const on = current === c.id;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={on ? "true" : undefined}
                className="group relative flex size-7 items-center justify-center rounded-full text-[0.7rem] font-semibold tabular-nums text-paper/60 transition-colors hover:text-paper focus-visible:text-paper"
              >
                <span className={`absolute inset-0 rounded-full transition-colors ${on ? "bg-paper" : "group-hover:bg-paper/15"}`} />
                <span className={`relative ${on ? "text-forest-deep" : ""}`}>{i + 1}</span>
                <span className="pointer-events-none absolute right-10 whitespace-nowrap rounded-full bg-forest-deep px-3 py-1.5 text-[0.8rem] font-medium text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {c.title}
                </span>
                <span className="sr-only">Chapter {c.n}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
