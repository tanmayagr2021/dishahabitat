import Image from "next/image";
import { communities, communityHref, company, handedOverBy, homesHandedOver, whatsappVisit } from "@/lib/content";
import { Arrow } from "./Arrow";
import { StaticCity, StaticHood } from "./StaticMap";
import s from "./Atlas.module.css";

/*
 * The words, as plain server-rendered HTML: the opening, one chapter per community and the close,
 * each with its still map and photograph. The moving map (AtlasStage) reads these sections by their
 * data-step and marks the one in view; nothing here needs JavaScript.
 */

const mappedCommunities = communities.filter((c) => c.mapped);
const numberOf = (slug: string) => String(communities.findIndex((c) => c.slug === slug) + 1).padStart(2, "0");

export function Chapters() {
  return (
    <div className={s.flow}>
      {/* The opening plate */}
      <header className={`${s.section} ${s.opening}`} data-step="city" data-active="">
        <div className={`${s.text} ${s.head}`}>
          <p className="t-label">Disha Habitat · East Bengaluru · Since 2014</p>
          <h1 className={`${s.title} t-display`}>
            A city, <em>made of homes.</em>
          </h1>
          <p className={s.lede}>
            Since 2014 Disha has built five communities across East Bengaluru and handed over{" "}
            {homesHandedOver.toLocaleString("en-IN")} homes. A sixth is rising at Gunjur. This is where each one stands.
          </p>
        </div>
        <ol id="communities" className={`${s.text} ${s.key}`} aria-label="The communities">
          {communities.map((c) => (
            <li key={c.slug}>
              <a href={c.mapped ? `#${c.slug}` : communityHref(c.slug)} data-current={c.current ? "" : undefined}>
                <span className={s.keyNo}>{numberOf(c.slug)}</span>
                <span className={s.keyName}>{c.name}</span>
                <span className={s.keyYear}>{c.mapped ? c.year : "Not mapped"}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className={`${s.text} ${s.actions}`}>
          <a className="button" href={`#${mappedCommunities[0]!.slug}`}>
            Walk the map <Arrow className={s.down} />
          </a>
          <a className="link" href={whatsappVisit} target="_blank" rel="noopener noreferrer">
            Plan a visit on WhatsApp<span className="sr-only"> (opens WhatsApp with a message ready to send)</span>
          </a>
        </div>
        <div className={s.still}>
          <StaticCity />
        </div>
      </header>

      {mappedCommunities.map((c) => {
        const tally = handedOverBy(c.slug);
        return (
          <article
            key={c.slug}
            id={c.slug}
            className={`${s.section} ${s.chapter}`}
            data-step={c.slug}
            aria-labelledby={`${c.slug}-title`}
          >
            <div className={s.text}>
              <p className={`${s.chapterNo} t-label`}>
                {numberOf(c.slug)} · {c.current ? "Now selling" : `Handed over ${c.year}`}
              </p>
              <h2 id={`${c.slug}-title`} className="t-title">
                {c.name}
              </h2>
              <p className={s.locality}>{c.locality}</p>
              <dl className={s.figures}>
                {c.homes ? (
                  <div>
                    <dt>Homes</dt>
                    <dd>{c.homes}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Acres</dt>
                  <dd>{c.acres.replace(" acres", "")}</dd>
                </div>
                {c.built ? (
                  <div>
                    <dt>Built</dt>
                    <dd>
                      <span aria-hidden="true">
                        {c.built.start.slice(-4)}–{c.built.handover.slice(-2)}
                      </span>
                      <span className="sr-only">
                        {c.built.start} to {c.built.handover}
                      </span>
                    </dd>
                  </div>
                ) : null}
              </dl>
              {c.homeTypes ? <p className={s.types}>{c.homeTypes}</p> : null}
              {c.current ? (
                <p className={s.note}>
                  Registered with Karnataka RERA: {company.rera.map((r) => `${r.phase} ${r.no}`).join("; ")}.
                </p>
              ) : (
                <p className={s.tally}>
                  <strong>{tally.toLocaleString("en-IN")}</strong> homes handed over in all by {c.built?.handover}
                  {c.slug === "disha-central-park" ? (
                    <span className={s.aside}>
                      {" "}
                      including Park West’s 118, handed over the same month. Park West’s location is not yet on this
                      map.
                    </span>
                  ) : null}
                </p>
              )}
              <a className="link" href={communityHref(c.slug)}>
                See {c.name} <Arrow />
              </a>
            </div>
            <div className={s.still}>
              <StaticHood slug={c.slug} />
              <figure className={s.stillPhoto}>
                <div className={s.stillPhotoImage}>
                  <Image
                    src={c.photo.src}
                    alt={c.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 42vw, (min-width: 700px) 50vw, 100vw"
                    quality={78}
                    style={{ objectFit: "cover", objectPosition: c.photo.focus }}
                  />
                </div>
                <figcaption>{c.photo.caption}</figcaption>
              </figure>
            </div>
          </article>
        );
      })}

      <section className={`${s.section} ${s.closing}`} data-step="closing" aria-labelledby="closing-title">
        <div className={s.text}>
          <p className="t-label">The whole map</p>
          <h2 id="closing-title" className="t-title">
            Five lived in. <em>One rising.</em>
          </h2>
          <p className={s.lede}>
            Visits to Pursuit of the Elements in Gunjur are planned with Disha’s sales team. The WhatsApp message opens
            ready for you to send; nothing leaves this page on its own.
          </p>
          <div className={s.actions}>
            <a className="button" href={whatsappVisit} target="_blank" rel="noopener noreferrer">
              Plan a visit on WhatsApp <Arrow />
            </a>
            <a className="link" href={company.sales.tel}>
              Call {company.sales.display}
            </a>
          </div>
          <details className={s.method}>
            <summary>How this map was made</summary>
            <p>
              Every street, lake, railway and building is from OpenStreetMap, drawn as it was mapped in October 2026.
              The blue plot outlines were drawn by volunteer mappers and are approximate; the land areas quoted are
              Disha’s own published figures. Pursuit of Sunshine is the plot named “Disha” beside Budigere Road (4.1
              mapped acres against a published 4). Park West is counted but not shown, because its address is not
              published.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
