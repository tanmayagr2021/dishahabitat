"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { communities, homesHandedOver, thresholds, type Picture, type ThresholdKey } from "@/lib/content";
import { drawFrame, drawGate, type Drawing, type Rect } from "@/lib/geometry";
import { links, whatsappVisit } from "@/lib/site";
import { Arrow } from "./Arrow";
import s from "./Thresholds.module.css";

/*
 * THE WORLD BETWEEN FOUR WALLS
 *
 * Three thresholds, from public to private: the gate, the courtyard, the door. The opening
 * photograph looks through three concrete portals; the page clips it to the outermost one and
 * draws three more in front, so the visitor stands inside the gate with the headline carved
 * over it. Scrolling on, those drawn portals gather into the four walls around each next picture,
 * while the page moves from morning paper to dusk stone to evening navy. The frame then becomes
 * the viewer for Disha's six communities.
 *
 * All words sit in the normal page flow and scroll naturally; only the frame is sticky. On large
 * screens with motion allowed (html.cine, set before first paint in layout.tsx) the frame is the
 * sticky stage below. Everywhere else, including without JavaScript, each act shows its own
 * picture inline, so nothing depends on the animation.
 */

type Act = ThresholdKey | "communities" | "closing";
type StageAct = Exclude<Act, "closing">;

/* Inline and stage copies of a picture share `sizes`, so the browser fetches one file, once. */
const sizes: Record<ThresholdKey | "community", string> = {
  gate: "(min-width: 1024px) 60vw, 145vw",
  courtyard: "(min-width: 1024px) 60vw, 100vw",
  door: "(min-width: 1024px) 40vw, 100vw",
  community: "(min-width: 1024px) 50vw, 100vw",
};

const order: ThresholdKey[] = ["gate", "courtyard", "door"];

function Photo({
  picture,
  sizes,
  decorative = false,
  eager = false,
  fit = "cover",
}: {
  picture: Picture;
  sizes: string;
  decorative?: boolean;
  eager?: boolean;
  fit?: "cover" | "fill";
}) {
  return (
    <Image
      src={picture.src}
      alt={decorative ? "" : picture.alt}
      fill
      sizes={sizes}
      quality={80}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "low"}
      style={{ objectFit: fit, objectPosition: picture.focus }}
    />
  );
}

/* A picture inside its nested frames, for the static composition. */
function Framed({
  picture,
  sizes,
  className = "",
  eager = false,
}: {
  picture: Picture;
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <figure className={`${s.framed} ${className}`}>
      <div className={s.framedImage}>
        <div className={s.framedClip}>
          <Photo picture={picture} sizes={sizes} eager={eager} />
        </div>
      </div>
      <figcaption className={`${s.framedCaption} t-label`}>{picture.caption}</figcaption>
    </figure>
  );
}

const px = (n: number) => `${Math.round(n * 10) / 10}px`;
const place = (el: HTMLElement | null, r: Rect) => {
  if (!el) return;
  el.style.left = px(r.left);
  el.style.top = px(r.top);
  el.style.width = px(r.width);
  el.style.height = px(r.height);
};
const box = (el: Element): Rect => {
  const cs = getComputedStyle(el);
  return {
    left: parseFloat(cs.left),
    top: parseFloat(cs.top),
    width: parseFloat(cs.width),
    height: parseFloat(cs.height),
  };
};

export function Thresholds() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const ground = useRef<HTMLSpanElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState<Act>("gate");
  const [project, setProject] = useState(communities[0]!.slug);
  const pointerPick = useRef(false);

  // The frame keeps the last story act while the page closes, so it never jumps as it leaves.
  const stageAct: StageAct = act === "closing" ? "communities" : act;

  // Which act is in view, and which community, as the visitor scrolls. Each act takes over at its
  // own line on the screen: the frame passes through the gate after a short scroll, and each
  // later act arrives once the words before it have left the frame's side of the screen.
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const find = (selector: string) => document.querySelector<HTMLElement>(selector);
    const lines: [Act, string, number][] = [
      ["courtyard", "[data-step='courtyard']", 0.9],
      ["door", "[data-step='door']", 0.6],
      ["communities", "[data-step='communities']", 0.6],
      ["closing", "[data-step='closing']", 0.5],
    ];
    const triggers = lines.flatMap(([name, selector, line]) => {
      const el = find(selector);
      return el ? [{ name, el, line }] : [];
    });
    const items = Array.from(section.querySelectorAll<HTMLElement>("[data-community]"));

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let next: Act = "gate";
      for (const t of triggers) if (t.el.getBoundingClientRect().top <= vh * t.line) next = t.name;
      setAct(next);
      if (next === "communities" && !pointerPick.current) {
        for (const item of items) {
          const r = item.getBoundingClientRect();
          if (r.top <= vh / 2 && r.bottom > vh / 2 && item.dataset.community) {
            setProject(item.dataset.community);
            break;
          }
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The page tone and the navigation follow the act in view.
  useEffect(() => {
    document.documentElement.dataset.act = act;
  }, [act]);

  // Keep the scroll sequence in step with the screen size and the motion preference.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const sync = () => document.documentElement.classList.toggle("cine", mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Draw the architecture for the act in view: portals at the gate, nested walls after it.
  const draw = useCallback((which: StageAct) => {
    const el = stage.current;
    if (!el || getComputedStyle(el).display === "none") return;
    const layer = el.querySelector(`[data-rect='${which}']`);
    if (!layer) return;
    // Same as --gutter in globals.css: clamp(1.25rem, 6vw, 6.5rem).
    const gutter = Math.min(Math.max(20, el.clientWidth * 0.06), 104);
    const drawing: Drawing =
      which === "gate"
        ? drawGate(box(layer), { width: el.clientWidth, gutter })
        : drawFrame(box(layer));
    drawing.lines.forEach((r, i) => place(lines.current[i] ?? null, r));
    place(ground.current, drawing.ground);
    if (ground.current) ground.current.style.opacity = String(drawing.ground.opacity);
    place(foot.current, drawing.foot);
    if (foot.current) foot.current.dataset.centred = drawing.foot.centred ? "true" : "false";
    el.dataset.ready = "";
  }, []);

  useEffect(() => {
    draw(stageAct);
  }, [stageAct, draw]);

  // Redraw on resize without animating, so the lines never lag behind the frame.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      el.dataset.still = "";
      frame = requestAnimationFrame(() => {
        draw((el.dataset.act as StageAct) ?? "gate");
        requestAnimationFrame(() => delete el.dataset.still);
      });
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [draw]);

  const activeCommunity = communities.find((c) => c.slug === project) ?? communities[0]!;
  const threshold = stageAct === "communities" ? null : thresholds[stageAct];
  const caption = threshold ? threshold.picture.caption : activeCommunity.picture.caption;

  const pick = (slug: string) => {
    pointerPick.current = true;
    setProject(slug);
  };
  const release = () => {
    pointerPick.current = false;
  };

  return (
    <section ref={root} className={s.story} aria-label="A home is never just a place">
      {/* The sticky stage: decorative copies of the pictures, framed. The words are in the flow below. */}
      <div ref={stage} className={s.stage} data-act={stageAct} aria-hidden="true">
        <div className={s.window}>
          {order.map((key, i) => (
            <div key={key} className={s.layer} data-rect={key} data-on={stageAct === key ? "" : undefined}>
              <Photo
                picture={thresholds[key].picture}
                sizes={sizes[key]}
                decorative
                eager={i === 0}
                fit={key === "gate" ? "fill" : "cover"}
              />
            </div>
          ))}
          {communities.map((c) => (
            <div
              key={c.slug}
              className={s.layer}
              data-rect="communities"
              data-on={stageAct === "communities" && c.slug === activeCommunity.slug ? "" : undefined}
            >
              <Photo picture={c.picture} sizes={sizes.community} decorative />
            </div>
          ))}
        </div>
        <span ref={ground} className={s.ground} />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            ref={(el) => {
              lines.current[i] = el;
            }}
            className={s.wall}
            data-i={i}
          />
        ))}
        <div ref={foot} className={s.foot}>
          <span className={`${s.caption} t-label`} key={`k-${caption}`}>
            {caption}
          </span>
        </div>
      </div>

      <div className={s.flow}>
        {/* I · The gate */}
        <article className={`${s.act} ${s.gate}`} data-step="gate" aria-labelledby="gate-title">
          <div className={s.gateHead}>
            <p className={`${s.kicker} t-label`}>Disha Habitat · East Bengaluru · Since 2014</p>
            <h1 id="gate-title" className={`${s.headline} t-display`}>
              <span className={s.line} style={{ "--i": 0 } as CSSProperties}>
                <span>A home is</span>
              </span>{" "}
              <span className={s.line} style={{ "--i": 1 } as CSSProperties}>
                <span>
                  never <em className="it">just</em>
                </span>
              </span>{" "}
              <span className={s.line} style={{ "--i": 2 } as CSSProperties}>
                <span>
                  <em className="it">a place.</em>
                </span>
              </span>
            </h1>
          </div>
          <Framed picture={thresholds.gate.picture} sizes={sizes.gate} className={s.figGate} eager />
          <div className={s.gateFoot}>
            <p className={`${s.lede} t-body`}>
              It is the gate you walk back through, the courtyard you share and the door that opens for you.
              Since 2014 we have built mindful living spaces in East Bengaluru around that idea.
            </p>
            <a className={`${s.cue} t-label`} href="#courtyard">
              Step inside
              <span className={s.cueLine} aria-hidden="true" />
            </a>
            <div className={s.actions}>
              <a className="button" href={links.communities}>
                Explore our communities <Arrow />
              </a>
              <a className="link" href={whatsappVisit} target="_blank" rel="noopener noreferrer">
                Plan a visit on WhatsApp
                <span className="sr-only"> (opens WhatsApp with a message ready to send)</span>
              </a>
            </div>
          </div>
        </article>

        {/* II · The courtyard */}
        <article
          id="courtyard"
          className={`${s.act} ${s.passage} tone-stone`}
          data-step="courtyard"
          aria-labelledby="courtyard-title"
        >
          <div className={s.passageText}>
            <p className={`${s.kicker} t-label`}>II · The courtyard</p>
            <h2 id="courtyard-title" className="t-act">
              It is the courtyard <em className="it">everyone shares,</em>
            </h2>
            <p className="t-body">
              At Disha Courtyard in Hagadur Village, the blocks turn inward, towards a garden and a pool lit at dusk.
            </p>
          </div>
          <Framed picture={thresholds.courtyard.picture} sizes={sizes.courtyard} className={s.figCourtyard} />
        </article>

        {/* III · The door */}
        <article className={`${s.act} ${s.passage} tone-evening`} data-step="door" aria-labelledby="door-title">
          <div className={s.passageText}>
            <p className={`${s.kicker} t-label`}>III · The door</p>
            <h2 id="door-title" className="t-act">
              and the door someone opens <em className="it">before you knock.</em>
            </h2>
            <p className="t-body">
              We have built for that moment one community at a time: {homesHandedOver.toLocaleString("en-IN")} homes
              handed over in East Bengaluru, each one finished, then lived in.
            </p>
          </div>
          <Framed picture={thresholds.door.picture} sizes={sizes.door} className={s.figDoor} />
        </article>

        {/* IV · The communities */}
        <section
          id="communities"
          className={`${s.act} ${s.communities} tone-evening`}
          data-step="communities"
          aria-labelledby="communities-title"
        >
          <div className={s.communitiesHead}>
            <p className={`${s.kicker} t-label`}>IV · The communities</p>
            <h2 id="communities-title" className="t-act">
              Five communities lived in. <em className="it">A sixth rising at Gunjur.</em>
            </h2>
          </div>
          <ol className={s.list} onPointerLeave={release}>
            {communities.map((c, i) => (
              <li
                key={c.slug}
                className={s.item}
                data-community={c.slug}
                data-on={c.slug === activeCommunity.slug ? "" : undefined}
              >
                <a
                  className={s.itemLink}
                  href={links.community(c.slug)}
                  onPointerEnter={() => pick(c.slug)}
                  onFocus={() => pick(c.slug)}
                  onBlur={release}
                >
                  <span className={`${s.itemIndex} t-label`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.itemBody}>
                    <span className={`${s.itemName} t-name`}>
                      {c.name}
                      <Arrow className={s.itemArrow} />
                    </span>
                    <span className={`${s.itemMeta} t-small`}>
                      {c.locality} · {c.facts}
                    </span>
                    <span className={`${s.itemStatus} t-label`} data-current={c.current ? "" : undefined}>
                      {c.status}
                    </span>
                  </span>
                </a>
                <Framed picture={c.picture} sizes={sizes.community} className={s.figCommunity} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
