import { CountUp } from "@/components/home/CountUp";
import { Eyebrow, Reveal } from "@/components/ui";
import { stats } from "@/lib/site";

export function Stats() {
  return (
    <section aria-labelledby="stats-title" className="py-24 md:py-32 lg:py-40">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow className="text-ink-mute">This is us</Eyebrow>
              <h2 id="stats-title" className="display mt-6 text-[2.9rem] sm:text-[3.6rem] xl:text-[4.2rem]">
                Our homeowners are our <em className="text-olive">brand</em>.
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-ink-soft">
                We have been building since 2014, largely in East Bengaluru. Our first four properties sold out without
                any concentrated brand marketing. Build quality and mindfulness have been our biggest strengths, and
                our resident community grows with every new project.
              </p>
            </Reveal>
          </div>
        </div>

        <dl className="lg:col-span-7 lg:col-start-6">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="grid grid-cols-[1fr_auto] items-end gap-6 border-t border-ink/15 py-6 last:border-b md:grid-cols-[3rem_1fr_auto] md:py-8"
            >
              <span aria-hidden className="hidden pb-2 text-xs tabular-nums text-ink-mute md:block">
                0{i + 1}
              </span>
              <dt className="order-2 max-w-[9rem] pb-2 text-right text-[0.8rem] font-medium uppercase leading-snug tracking-[0.14em] text-ink-soft md:order-3 md:max-w-none">
                {s.label}
              </dt>
              <dd className="display order-1 text-[2.7rem] leading-none text-ink min-[400px]:text-[3.1rem] sm:text-[4.2rem] md:order-2 xl:text-[5.4rem]">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
