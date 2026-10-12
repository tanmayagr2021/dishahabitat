import { Label, Reveal } from "@/components/ui";
import { projectsByHandover } from "@/lib/projects";

/* "Our Core", Disha Habitat's own manifesto (dishahabitat.com/our-journey), set as one still page. */
const hues = projectsByHandover.map((p) => p.hue);
const spectrum = `linear-gradient(90deg, ${hues.join(", ")})`;

export function BlackWhite({ n = "06", full = false }: { n?: string; full?: boolean }) {
  return (
    <section data-tone="dark" aria-labelledby="core-title" className="relative bg-ink py-24 text-paper md:py-36">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3 lg:pt-3">
          <Label n={n} className="text-paper/60">
            Our core
          </Label>
        </div>
        <div className="lg:col-span-9">
          {full && (
            <Reveal className="mb-10 max-w-2xl space-y-4 text-[1.15rem] leading-relaxed text-paper/60">
              <p>Life is colourful. With every hue open to its own interpretation.</p>
              <p>
                Your turmeric yellow could be someone’s mustard, their sea-green could be your teal. You both could be right;
                you both could also be completely off the mark.
              </p>
              <p>
                Then there’s Black. And there’s White. Black is never to be doubted. White is invariably spotless. Both
                definitive. Both unrelenting.
              </p>
            </Reveal>
          )}
          <Reveal as="h2" className="serif text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[1.02]">
            <span id="core-title">
              Our promises are inked in <em>Black.</em> Our approach is clear <em className="text-paper/60">White.</em>
            </span>
          </Reveal>
          <Reveal delay={150} className="mt-10 flex flex-col gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">
              Bring in your own{" "}
              <em className="bg-clip-text pr-[0.06em] text-transparent" style={{ backgroundImage: spectrum }}>
                colours.
              </em>
            </p>
            <div aria-hidden className="flex h-1.5 w-full max-w-xs gap-1.5">
              {hues.map((h) => (
                <span key={h} className="flex-1 rounded-full" style={{ background: h }} />
              ))}
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-paper/50">We are Disha Habitat. We have no coloured cover-ups.</p>
        </div>
      </div>
    </section>
  );
}
