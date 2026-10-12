"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { ArrowLink, Label, Reveal } from "@/components/ui";
import { useScrollProgress } from "@/lib/useScrollProgress";

/* Disha Habitat's own words, from dishahabitat.com/our-journey. */
const line =
  "We began exactly where you are right now. Looking for a house that would become a home.";

export function Manifesto() {
  const textRef = useRef<HTMLDivElement>(null);
  useScrollProgress(textRef, "enter", { end: 0.4 });
  const words = line.split(" ");

  return (
    <section data-tone="light" aria-labelledby="manifesto-title" className="relative bg-paper py-28 md:py-44">
      <div className="shell">
        <div ref={textRef} className="grid gap-12 [--p:1] lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-4">
            <Label n="01" className="text-mute">
              Where we began
            </Label>
          </div>

          <div className="lg:col-span-9">
            {/* Each word inks in as the line scrolls up the page. */}
            <h2
              id="manifesto-title"
              className="serif text-[clamp(2.6rem,6.4vw,6.6rem)] leading-[0.98] text-ink"
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  style={
                    {
                      opacity: `clamp(0.12, calc(var(--p) * ${words.length * 1.25} - ${i}), 1)`,
                    } as CSSProperties
                  }
                >
                  {w.startsWith("home") ? <em>{w}</em> : w}{" "}
                </span>
              ))}
            </h2>

            <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-9 md:gap-8">
              <Reveal variant="bloom" className="relative aspect-[4/3] overflow-hidden bg-paper-3 md:col-span-5">
                <Image
                  src="/images/community/leadership-team.jpg"
                  alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-[60%_50%]"
                />
              </Reveal>
              <Reveal delay={150} className="flex flex-col justify-end md:col-span-4">
                <p className="text-[1.05rem] leading-relaxed text-mute">
                  Homebuyers first, then investors, then builders. Every stumble opened a new window of understanding — and
                  every Disha home since 2014 has been planned by people who remember what it was like to be looking.
                </p>
                <ArrowLink href="/story" className="mt-6 text-ink">
                  Read our story
                </ArrowLink>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
