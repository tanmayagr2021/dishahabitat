"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/*
 * The Disha Habitat brand film (from dishahabitat.com) as a muted ambient loop.
 * Loads only when near the viewport, never autoplays for reduced-motion or Save-Data
 * visitors, and can always be paused (WCAG 2.2.2). The poster stands in otherwise.
 */
export function AmbientFilm({ className = "", label }: { className?: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.preload = "auto";
          video.play().catch(() => setPlaying(false));
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className={`absolute inset-0 size-full object-cover ${className}`}
        poster="/media/brand-film-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/media/brand-film.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="label absolute bottom-5 right-5 z-20 inline-flex h-10 items-center gap-2 bg-forest-deep/55 px-3.5 text-paper backdrop-blur-md transition-colors hover:bg-paper hover:text-ink md:bottom-8 md:right-8"
        aria-label={playing ? "Pause film" : "Play film"}
      >
        {playing ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="size-3.5" />}
        {playing ? "Pause film" : "Play film"}
      </button>
    </>
  );
}
