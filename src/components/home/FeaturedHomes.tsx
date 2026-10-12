import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArrowLink, Eyebrow, Reveal } from "@/components/ui";
import { getProject, type Project } from "@/lib/projects";

function factLine(p: Project) {
  const homes = p.facts.find((f) => f.label === "Homes")?.value;
  const size = p.facts.find((f) => f.label === "Project size")?.value;
  return [homes && `${homes} homes`, size].filter(Boolean).join(" · ");
}

function HomeCard({
  project,
  aspect,
  sizes,
  className = "",
  delay = 0,
}: {
  project: Project;
  aspect: string;
  sizes: string;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} as="article" className={className}>
      <Link href={`/homes/${project.slug}`} className="group block">
        <div className={`img-zoom relative overflow-hidden bg-linen ${aspect}`}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.7rem] tabular-nums uppercase tracking-[0.16em] text-ink-mute">
              {project.index} · Handover {project.handoverYear}
            </p>
            <h3 className="display mt-2 text-[2rem] leading-none text-ink md:text-[2.4rem]">{project.name}</h3>
            <p className="mt-2 text-sm text-ink-soft">
              {project.locality} — {factLine(project)}
            </p>
          </div>
          <span
            aria-hidden
            className="mt-1 inline-flex size-11 shrink-0 items-center justify-center border border-ink/20 text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
          >
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function FeaturedHomes() {
  const sunshine = getProject("disha-pursuit-of-sunshine")!;
  const courtyard = getProject("disha-courtyard")!;
  const centralPark = getProject("disha-central-park")!;
  const parkWest = getProject("disha-park-west")!;
  const windsor = getProject("disha-windsor-gardens")!;

  return (
    <section aria-labelledby="homes-title" className="bg-paper py-24 md:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow className="text-ink-mute">Our homes</Eyebrow>
            <h2 id="homes-title" className="display mt-6 text-[2.9rem] sm:text-[3.8rem] xl:text-[4.8rem]">
              Five communities, <br className="hidden sm:block" />
              <em className="text-olive">one way</em> of building.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-ink-soft">
              From 92 homes among the palms on Panathur–Varthur Road to 322 homes on Budigere Road, each community
              has been shaped by the same founding team, with the same care.
            </p>
          </Reveal>
        </div>

        {/* Lead feature: the most recent community */}
        <Reveal as="article" className="mt-16 md:mt-20">
          <Link href={`/homes/${sunshine.slug}`} className="group grid gap-0 lg:grid-cols-12">
            <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[16/10] lg:col-span-8 lg:aspect-auto lg:min-h-[36rem]">
              <Image
                src={sunshine.cover.src}
                alt={sunshine.cover.alt}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between gap-10 bg-olive-deep p-7 text-paper sm:p-10 lg:col-span-4 lg:p-12">
              <div>
                <p className="text-[0.7rem] tabular-nums uppercase tracking-[0.16em] text-paper/60">
                  {sunshine.index} · Most recent handover
                </p>
                <h3 className="display mt-4 text-[2.6rem] leading-[0.95] xl:text-[3.4rem]">{sunshine.name}</h3>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-paper/75">
                  Where the Sun smiles upon you. Every home opens onto an 8 ft × 12 ft sundeck.
                </p>
              </div>
              <div>
                <dl className="grid grid-cols-3 gap-4 border-t border-paper/20 pt-6">
                  {[
                    ["Homes", "322"],
                    ["Acres", "4"],
                    ["Handover", "2025"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-paper/55">{k}</dt>
                      <dd className="display mt-1 text-[2rem] leading-none">{v}</dd>
                    </div>
                  ))}
                </dl>
                <span className="mt-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em]">
                  Discover the community
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Staggered editorial grid */}
        <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-x-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24">
          <HomeCard
            project={courtyard}
            aspect="aspect-[4/5]"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="lg:col-span-6"
          />
          <HomeCard
            project={centralPark}
            aspect="aspect-[4/3]"
            sizes="(min-width: 768px) 42vw, 100vw"
            className="md:mt-24 lg:col-span-5 lg:col-start-8 lg:mt-40"
            delay={120}
          />
          <HomeCard
            project={parkWest}
            aspect="aspect-square"
            sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
            className="lg:col-span-4 lg:col-start-2"
          />
          <HomeCard
            project={windsor}
            aspect="aspect-[16/10]"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="md:mt-24 lg:col-span-6 lg:col-start-7 lg:-mt-8"
            delay={120}
          />
        </div>

        <div className="mt-20 flex justify-center">
          <ArrowLink href="/homes" className="text-ink">
            Compare all five communities
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
