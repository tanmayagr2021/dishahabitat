import Image from "next/image";
import { CountUp } from "@/components/home/CountUp";
import { Reveal, SectionMark } from "@/components/ui";
import { stats } from "@/lib/site";

export function Stats() {
  const [first, second, ...rest] = stats;
  return (
    <section
      data-tone="dark"
      aria-labelledby="stats-title"
      className="topo relative overflow-hidden bg-forest-900 py-24 text-ivory [--topo-opacity:0.4] md:py-36"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <SectionMark n="04" label="This is us" tone="dark" />
            <h2 id="stats-title" className="display mt-8 text-[2.8rem] sm:text-[3.8rem] xl:text-[4.6rem]">
              Our homeowners are <em className="text-brass-light">our brand.</em>
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-ivory/70">
              In business since 2014, largely in East Bengaluru. Our first four properties sold out without any
              concentrated brand marketing — our homebuyers have been our ambassadors. Build quality and mindfulness
              remain our biggest strengths.
            </p>
          </Reveal>

          <Reveal variant="image" delay={150} className="relative hidden aspect-[4/3] overflow-hidden lg:col-span-5 lg:col-start-8 lg:block">
            <Image
              src="/images/community/independence-day.jpg"
              alt="Children of a Disha Habitat community gathered with the Indian flag and balloons"
              fill
              sizes="40vw"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-[0.18em] text-ivory/80">
              Independence Day, together
            </span>
          </Reveal>
        </div>

        <div className="mt-20 grid border-t border-ivory/15 lg:mt-28 lg:grid-cols-12">
          <dl className="grid sm:grid-cols-2 lg:col-span-6">
          {[first, second].map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 100}
              className="flex flex-col gap-4 border-b border-ivory/15 py-8 sm:py-12 sm:pr-8 lg:border-b-0 sm:[&:nth-child(2)]:border-l sm:[&:nth-child(2)]:pl-8"
            >
              <dt className="eyebrow text-ivory/55">{s.label}</dt>
              <dd className="display text-[5rem] leading-none text-ivory lg:text-[5.2rem] xl:text-[6.6rem]">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
          </dl>
          <dl className="grid border-ivory/15 lg:col-span-6 lg:border-l lg:pl-8">
            {rest.map((s, i) => (
              <Reveal
                key={s.label}
                delay={200 + i * 100}
                className="flex items-baseline justify-between gap-6 border-b border-ivory/15 py-5 last:border-b-0 lg:py-6"
              >
                <dt className="eyebrow max-w-[9rem] text-ivory/55 sm:max-w-none">{s.label}</dt>
                <dd className="display text-[2.4rem] leading-none text-brass-light sm:text-[3rem] xl:text-[3.6rem]">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
