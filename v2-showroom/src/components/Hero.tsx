"use client";

import Image from "next/image";
import { Fragment, type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { Slide } from "@/lib/content";
import { focusPoint } from "@/lib/focus";
import { MOTION_OK, useMedia } from "@/lib/useMedia";
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "./Icons";
import s from "./Hero.module.css";

/* tesla.com's hero changes every ten seconds; so does this one, unless motion is reduced or paused. */
const DELAY = 10_000;

export function Hero({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  /* Slides two and three load once the first picture has, so they never compete with it. */
  const [rest, setRest] = useState(false);
  const motionOk = useMedia(MOTION_OK);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Holds still while the visitor points at it, works inside it, or has scrolled past it. */
  const playing = motionOk && !paused && !hover && !focusWithin && onScreen;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % n), DELAY);
    return () => window.clearTimeout(t);
  }, [playing, index, n]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* A fallback in case the first picture's load event was missed (cached, or before hydration). */
  useEffect(() => {
    const t = window.setTimeout(() => setRest(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    setRest(true);
    setIndex(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    go(to, true);
  };

  return (
    <section
      ref={root}
      className={s.hero}
      data-tone="dark"
      aria-roledescription="carousel"
      aria-label="Featured"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div className={s.slides} aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.id}
              id={`hero-slide-${slide.id}`}
              className={s.slide}
              data-active={active || undefined}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!active}
              inert={!active}
            >
              {(i === 0 || rest) && (
                <Image
                  className={s.media}
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  sizes="100vw"
                  quality={78}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  onLoad={i === 0 ? () => setRest(true) : undefined}
                  style={focusPoint(slide.image)}
                />
              )}
              <div className={s.scrim} aria-hidden="true" />
              <div className={s.copy}>
                <h2 className={`display ${s.title}`}>{slide.title}</h2>
                <p className={s.line}>{slide.line}</p>
                {slide.proof && (
                  <p className={s.proof}>
                    {slide.proof.split("·").map((part, k) => (
                      <Fragment key={k}>
                        {k > 0 && (
                          <span className={s.dot} aria-hidden="true">
                            {" · "}
                          </span>
                        )}
                        <span className={s.phrase}>{part.trim()}</span>
                      </Fragment>
                    ))}
                  </p>
                )}
                <div className={s.ctas}>
                  <a className="btn btn-primary" href={slide.primary.href}>
                    {slide.primary.label}
                  </a>
                  <a className="btn btn-ghost" href={slide.secondary.href}>
                    {slide.secondary.label}
                    <span className="sr-only">: {slide.title}</span>
                  </a>
                </div>
              </div>
              <p className={s.note}>{slide.note}</p>
            </div>
          );
        })}
      </div>

      <div className={s.controls}>
        <div className={s.tabs} role="tablist" aria-label="Choose a slide">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              className={s.tab}
              aria-selected={i === index}
              aria-controls={`hero-slide-${slide.id}`}
              aria-label={slide.title}
              tabIndex={i === index ? 0 : -1}
              onClick={() => go(i)}
              onKeyDown={onTabKey}
            />
          ))}
        </div>
        {motionOk && (
          <button
            type="button"
            className={s.pause}
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play the slideshow" : "Pause the slideshow"}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>

      <button type="button" className={`${s.arrow} ${s.prev}`} onClick={() => go(index - 1)} aria-label="Previous slide">
        <ChevronLeft />
      </button>
      <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => go(index + 1)} aria-label="Next slide">
        <ChevronRight />
      </button>
    </section>
  );
}
