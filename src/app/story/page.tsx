import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Accordion, CtaBand, Feature, Gallery, PhotoHero, Section, SectionHead } from "@/components/ds";
import { ArrowRight } from "@/components/showroom/Icons";
import { company, dishaFamily, formatIndian, homemakerProfiles, homemakers, poem, stats } from "@/lib/site";
import { links } from "@/lib/content";
import { pageMeta } from "@/lib/launch";
import { projects, projectsByHandover } from "@/lib/projects";
import s from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: "Our story",
  description:
    "The Disha Habitat story in the founders’ own words: how two homebuyers became builders, and the five communities built since 2014.",
  path: "/story",
});

/* First-person passages are drafted from the founders’ published profiles; they should approve the wording. */
const voices: Record<string, string> = {
  "Gunaranjan J":
    "Fifteen years in software, consulting for businesses in the USA, and a practising horticulturist: you will find that in every garden we plant.",
  "K Raja Sekhar":
    "Built mobile-tower infrastructure for Airtel, Vodafone, Idea and Reliance, then years with HCL Technologies. He explains the structure plainly until the maths is clear.",
};

const promises = [
  ["Explain everything.", "No question is too small. If something needs explaining, we sit down and explain it."],
  ["Build it properly.", "Build quality has always been our biggest strength, and our residents are the ones who tell people so."],
  ["Price it mindfully.", "Every home, from an apartment to an independent villa, is created, and priced, with the same care."],
] as const;

const artists = ["Shankar Ehsaan Loy", "Shreya Ghoshal", "Armaan Malik", "Piyush Mishra", "K S Chithra", "Sunil Grover"];

const family = dishaFamily.slice(0, 6).map((f) => ({
  src: f.src,
  width: 1920,
  height: f.src.endsWith("team-1.jpg") ? 1445 : 1280,
  alt: f.alt,
  caption: f.kind,
  kind: "photo" as const,
}));

const homesOf = (p: (typeof projects)[number]) => p.facts.find((f) => f.label === "Homes")?.value;

export default function StoryPage() {
  const windsor = projects.find((p) => p.slug === "disha-windsor-gardens")!;
  const families = stats.find((st) => st.label === "Happy families")!;
  const communities = stats.find((st) => st.label === "Communities created")!;

  return (
    <>
      <PhotoHero
        title="Our story"
        line="We began where you are now: looking for a house that would become a home."
        image={{
          src: "/images/community/site-team.jpg",
          width: 1920,
          height: 1280,
          alt: "The Disha Habitat site and engineering team gathered on a landscaped lawn",
          position: "50% 35%",
        }}
        specs={[
          { value: String(company.founded), label: "Building since" },
          { value: String(communities.value), label: communities.label },
          { value: `${formatIndian(families.value)}${families.suffix}`, label: families.label },
        ]}
        actions={[{ label: "Book a visit", href: links.bookVisit }]}
      />

      <Section label="Our poem">
        <p className={`display ${s.poem}`}>
          {poem.opening.map((l) => (
            <span key={l}>{l}</span>
          ))}
          <span className={s.dots} aria-hidden="true">
            …
          </span>
          <span>{poem.closing}</span>
        </p>
      </Section>

      <Section space="tight" labelledBy="five-title">
        <SectionHead
          id="five-title"
          title="Five communities, start to finish."
          line="Our first four sold out by word of mouth: our homebuyers told their friends."
        />
        <ol className={s.list}>
          {projectsByHandover.map((p) => (
            <li key={p.slug}>
              <Link href={`/homes/${p.slug}`} className={s.row}>
                <span className={`display ${s.rowName}`}>{p.shortName}</span>
                <span className={s.rowMeta}>
                  {p.timeline.start} to {p.timeline.completion}
                </span>
                <span className={s.rowMeta}>
                  {homesOf(p)} homes · {p.timeline.months} months
                </span>
                <ArrowRight />
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section width="measure" space="tight" labelledBy="begin-title">
        <SectionHead id="begin-title" title="We were homebuyers first." />
        <div className={s.prose}>
          <p>We asked the questions every buyer asks.</p>
          <p>
            We became homebuyers first, then investors, and then, taking the plunge, developers and builders. We learnt all of it
            coming from a place of not knowing. Every stumble opened a new window of understanding, and we realised what it takes
            to keep a promise and meet an expectation.
          </p>
          <p>
            That is why every home we plan starts from the buyer’s side of the table. We still remember what it felt like to be
            looking.
          </p>
        </div>
      </Section>

      <Section tone="surface" labelledBy="founders-title">
        <SectionHead id="founders-title" title="Two very different careers." line="Neither of us started out building homes. We think that is exactly why we explain everything." />
        <div className={s.founders}>
          {homemakers.map((h) => (
            <article key={h.name} className={s.founder}>
              <div className={s.portrait}>
                <Image src={h.portrait} alt={`Portrait of ${h.name}`} fill sizes="(min-width: 900px) 40vw, 100vw" className={s.portraitImg} />
              </div>
              <p className="eyebrow">{h.role}</p>
              <h3 className={`display ${s.name}`}>{h.name}</h3>
              <p className={`display ${s.signature}`}>{h.signature}</p>
              <p className={s.bio}>{voices[h.name]}</p>
              <Accordion
                defaultOpen={null}
                items={[
                  {
                    title: `How the team describes ${h.short}`,
                    body: (
                      <div className={s.prose}>
                        {homemakerProfiles[h.name].map((t) => (
                          <p key={t}>{t}</p>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="first-title">
        <Feature image={windsor.cover} ratio="wide">
          <p className="eyebrow">Where everything we know began</p>
          <h2 id="first-title" className={`display ${s.h2}`}>
            Ninety-two homes among the palms.
          </h2>
          <p>
            Our first community was {windsor.name}, on Panathur–Varthur Road: {homesOf(windsor)} homes on 1.25 acres, among coconut
            palms. We broke ground in {windsor.timeline.start} and handed over the keys in {windsor.timeline.handover}.
          </p>
          <Link href={`/homes/${windsor.slug}`} className="text-link">
            See {windsor.shortName}
            <ArrowRight />
          </Link>
        </Feature>
      </Section>

      <Section tone="surface" labelledBy="numbers-title">
        <SectionHead
          id="numbers-title"
          title="This is us."
          line="Our homebuyers have been our brand ambassadors from the start. The community grows with every project."
        />
        <dl className={s.stats}>
          {stats.map((st) => (
            <div key={st.label} className={s.stat}>
              <dd>
                {formatIndian(st.value)}
                {st.suffix}
              </dd>
              <dt>{st.label}</dt>
            </div>
          ))}
        </dl>
      </Section>

      <Section labelledBy="promise-title">
        <SectionHead id="promise-title" title="What we promised ourselves." />
        <ol className={s.promises}>
          {promises.map(([t, d], i) => (
            <li key={t}>
              <span className={s.num} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={`display ${s.promise}`}>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className={`display ${s.ink}`}>
          Life is colourful, and every colour is open to interpretation. That is why, when it comes to promises, we only deal in
          two: our promises are inked in black, and our approach is clear white.
        </p>
        <p className={s.sign}>Gunaranjan J and K Raja Sekhar, founders</p>
      </Section>

      <Section tone="surface" labelledBy="family-title">
        <SectionHead id="family-title" title="One big family." line="The families who live in our homes, and the people who build them." />
        <Gallery items={family} layout="grid" />
      </Section>

      <Section labelledBy="events-title">
        <Feature
          image={{
            src: "/images/events/et-award-certificate.webp",
            width: 315,
            height: 227,
            alt: "ET Business Awards 2025 Certificate of Excellence for Disha Pursuit of the Elements, Innovation Real Estate Project of the Year",
          }}
          reverse
        >
          <p className="eyebrow">Recognition and evenings</p>
          <h2 id="events-title" className={`display ${s.h2}`}>
            Innovation Real Estate Project of the Year.
          </h2>
          <p>
            Disha Pursuit of the Elements won this at the ET Business Awards 2025. We have also presented or supported concerts in
            Bengaluru by {artists.slice(0, -1).join(", ")} and {artists.at(-1)}.
          </p>
          <a href={company.brandFilm.youtubeUrl} className="text-link" target="_blank" rel="noopener noreferrer">
            Watch our brand film
            <ArrowRight />
          </a>
        </Feature>
      </Section>

      <CtaBand
        title="Bring every question."
        line="You will find a home with us. Meet us at Pursuit of the Elements in Gunjur or at our office on Whitefield Main Road."
        actions={[
          { label: "Book a visit", href: links.bookVisit },
          { label: "See our homes", href: links.homes },
        ]}
      />
    </>
  );
}
