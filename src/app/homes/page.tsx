import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, CtaBand, Feature, PageIntro, Section, SectionHead } from "@/components/ds";
import { ArrowRight } from "@/components/showroom/Icons";
import { links } from "@/lib/content";
import { elements } from "@/lib/elements";
import { pageMeta } from "@/lib/launch";
import { projectsNewestFirst } from "@/lib/projects";
import { formatIndian } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: "Our homes",
  description:
    "Pursuit of the Elements, selling now in Gunjur, and the five communities Disha Habitat has built since 2014.",
  path: "/homes",
});

const fact = (facts: { label: string; value: string }[], label: string) => facts.find((f) => f.label === label)?.value ?? "";
const totalHomes = projectsNewestFirst.reduce((n, p) => n + Number(fact(p.facts, "Homes")), 0);

/* The index of Disha's homes: the one selling now, then the five that are lived in today. */
export default function HomesPage() {
  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Our homes" }]} />}
        title="Our homes"
        line={`One community is selling now. The five we have built since 2014, ${formatIndian(totalHomes)} homes in all, are lived in today.`}
      />

      <Section labelledBy="now-title" space="tight">
        <h2 id="now-title" className="sr-only">
          Selling now
        </h2>
        <Feature image={elements.cover} tag="Artist’s impression" reverse ratio="wide">
          <p className="eyebrow">
            {elements.status} · {elements.locality}
          </p>
          <p className={`display ${s.featureName}`}>{elements.shortName}</p>
          <p>{elements.offer} and 4 &amp; 5 BHK villas, on 20 acres with over 40 amenities.</p>
          <div className={s.actions}>
            <Link href={elements.href} className="btn btn-dark">
              See the project
            </Link>
            <Link href={links.bookVisit} className="btn btn-primary">
              Book a visit
            </Link>
          </div>
        </Feature>
      </Section>

      <Section tone="surface" labelledBy="built-title">
        <SectionHead
          id="built-title"
          title="Handed over, and lived in today"
          line="Every start and handover date is published on each community’s page."
        />
        <ul className={s.grid}>
          {projectsNewestFirst.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/homes/${p.slug}`} className={s.card}>
                <span className={s.media}>
                  <Image
                    src={p.cover.src}
                    alt={p.cover.alt}
                    fill
                    priority={i < 3}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={78}
                    className={s.img}
                  />
                </span>
                <span className={s.body}>
                  <span className={`display ${s.name}`}>{p.shortName}</span>
                  <span className={s.place}>{p.locality}</span>
                  <span className={s.figures}>
                    {fact(p.facts, "Homes")} homes · {fact(p.facts, "Project size")} · handed over {p.handoverYear}
                  </span>
                  <span className="text-link" aria-hidden="true">
                    See the community <ArrowRight />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="See them for yourself"
        line="Walk a handed-over community, then the one being built. Our team will show you both."
        actions={[
          { label: "Book a visit", href: links.bookVisit },
          { label: `See ${elements.shortName}`, href: elements.href },
        ]}
      />
    </>
  );
}
