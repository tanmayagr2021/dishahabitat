"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";

/*
 * The logo film (supplied, 8 s, 1920×1080): a cyan line draws the roof and the name resolves
 * on forest green. It plays whenever someone arrives at the site, starting from the HTML itself,
 * never with reduced motion (layout.tsx decides before paint). As the film's logo settles, the official SVG logo is laid
 * exactly over it, then glides into its place in the header while the film dissolves into the
 * hero, one continuous movement. Any key, click, scroll or "Skip intro" ends it at once.
 *
 * Where the logo sits in the film, measured from its pixels (film px, 1920×1080). The film keeps a
 * slow push-in going to the end, DISHA narrows from 772 px at 5.3 s to 745 px at 7.9 s, about the
 * frame's centre, so the box is scaled for the exact frame at which the film is frozen.
 */
const FILM = { w: 1920, h: 1080, cx: 960, cy: 540 };
const LOGO_AT_7_6 = { x: 579.3, y: 300.8, w: 64 * 12.03, dishaWidth: 748.1 };
const dishaWidthAt = (t: number) => 772 - 10.4 * (t - 5.3);
const SETTLED_AT = 4.9; // seconds of film: the name has resolved and the light sweep has passed
const RATE = 2.2;

export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "on") return;
    const v = video.current!;
    const el = root.current!;
    let ended = false;
    let handing = false;

    const close = () => {
      if (ended) return;
      ended = true;
      try {
        sessionStorage.setItem("disha-intro", "1");
      } catch {}
      html.dataset.intro = "off";
      setGone(true);
    };

    /* Skip: a quick dissolve, no choreography. */
    const skip = () => {
      if (ended || handing) return;
      handing = true;
      v.pause();
      html.dataset.intro = "handover";
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: "ease-out", fill: "forwards" }).finished.then(close);
    };

    /* Hand-over: official logo over the film's logo, then into the header. */
    const handover = () => {
      if (ended || handing) return;
      handing = true;
      v.pause();
      const box = v.getBoundingClientRect();
      const s = box.width / FILM.w;
      const k = dishaWidthAt(v.currentTime) / LOGO_AT_7_6.dishaWidth;
      const fx = FILM.cx + (LOGO_AT_7_6.x - FILM.cx) * k;
      const fy = FILM.cy + (LOGO_AT_7_6.y - FILM.cy) * k;
      const from = { x: box.left + fx * s, y: box.top + fy * s, w: LOGO_AT_7_6.w * k * s };
      const lg = logo.current!;
      Object.assign(lg.style, { left: `${from.x}px`, top: `${from.y}px`, width: `${from.w}px` });

      const target = document.querySelector<HTMLElement>("[data-header-logo]")?.getBoundingClientRect();
      const fade = lg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out", fill: "forwards" });

      // 1. The official logo is in place over the frozen frame. 2. The film dissolves beneath it, so
      // only the official logo remains on forest green. 3. It flies to the header as the green lifts.
      const film = el.querySelector<HTMLElement>("[data-film]")!;
      fade.finished
        .then(() => film.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: "ease-out", fill: "forwards" }).finished)
        .then(() => {
          html.dataset.intro = "handover"; // the hero begins its entrance underneath
          el.animate([{ backgroundColor: "rgb(8 22 15 / 1)" }, { backgroundColor: "rgb(8 22 15 / 0)" }], {
            duration: 800,
            easing: "cubic-bezier(0.7,0,0.2,1)",
            fill: "forwards",
          });
          const move = target
            ? lg.animate(
                [
                  { transform: "translate(0,0) scale(1)" },
                  {
                    transform: `translate(${target.left - from.x}px, ${target.top - from.y}px) scale(${target.width / from.w})`,
                  },
                ],
                { duration: 850, easing: "cubic-bezier(0.7,0,0.2,1)", fill: "forwards" },
              )
            : lg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" });
          return move.finished;
        })
        .then(close);
    };

    const onTime = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, v.currentTime / SETTLED_AT)})`;
      if (v.currentTime >= SETTLED_AT) handover();
    };

    // The layout's inline script normally sets the source before this runs; this covers anything else.
    if (!v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src;
    v.playbackRate = RATE;
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", handover);
    v.addEventListener("error", skip);
    // The film has usually been playing since the HTML arrived; if it is already past the
    // settle point by the time this runs, hand over at once.
    if (v.currentTime >= SETTLED_AT || v.ended) handover();
    else v.play()?.catch(skip);
    // If the film has not started within 1.5 s (slow network, autoplay blocked), go straight in.
    const stall = window.setTimeout(() => {
      if (v.currentTime < 0.1) skip();
    }, 1500);
    // Whatever happens (a stalled network, a blocked autoplay mid-way), the site appears about 5 s
    // after the page began loading, however long the scripts took to arrive.
    const cap = window.setTimeout(skip, Math.max(800, 5000 - performance.now()));

    const interrupt = (e: Event) => {
      if (e.type === "keydown" && (e as KeyboardEvent).key === "Tab") return;
      skip();
    };
    window.addEventListener("keydown", interrupt);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });

    return () => {
      window.clearTimeout(stall);
      window.clearTimeout(cap);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", handover);
      v.removeEventListener("error", skip);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} onClick={(e) => !(e.target as HTMLElement).closest("button") && video.current?.dispatchEvent(new Event("error"))} className="intro fixed inset-0 z-[70] overflow-hidden bg-forest-deep">
      <div data-film className="absolute inset-0">
        {/* Cover on landscape screens; on portrait the film is sized so the whole logo fits. */}
        <div className="absolute left-1/2 top-1/2 aspect-video w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 portrait:w-[200vw] portrait:[mask-image:linear-gradient(transparent,black_18%,black_82%,transparent)]">
          <video
            ref={video}
            data-src="/media/logo-intro.mp4"
            suppressHydrationWarning
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 size-full"
          />
          {/* Softens the generator's sparkle mark in the lower right of the frame. */}
          <span
            aria-hidden
            className="absolute left-[90.6%] top-[83.3%] size-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(7_21_12)_60%,rgb(7_21_12/0))]"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(8_22_15/0.65))]" />
      </div>

      <div ref={logo} aria-hidden className="fixed left-0 top-0 origin-top-left text-paper opacity-0">
        <Logo className="block h-auto w-full" title="" />
      </div>

      <button
        type="button"
        onClick={() => {
          const v = video.current;
          v?.dispatchEvent(new Event("error"));
        }}
        className="label absolute bottom-6 right-5 flex items-center gap-3 px-3 py-3 text-paper/70 transition-colors hover:text-paper md:bottom-10 md:right-10"
      >
        Skip intro
        <span aria-hidden className="relative h-px w-10 overflow-hidden bg-paper/20">
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-cyan" />
        </span>
      </button>
    </div>
  );
}
