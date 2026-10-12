"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/*
 * The brand film from dishahabitat.com, played muted as an ambient loop.
 * It never autoplays for visitors who prefer reduced motion or have Save-Data on,
 * and it can always be paused (WCAG 2.2.2).
 */
export function HeroFilm({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    video.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <div className={`relative overflow-hidden bg-linen ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        poster="/media/brand-film-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Film of life in Disha Habitat communities: gardens, sports courts, residents at home and an aerial view"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/media/brand-film.mp4" type="video/mp4" />
      </video>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 bg-paper/90 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-sm transition-colors hover:bg-paper"
        aria-label={playing ? "Pause film" : "Play film"}
      >
        {playing ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="size-3.5" />}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
