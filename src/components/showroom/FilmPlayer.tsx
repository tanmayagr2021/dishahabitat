"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MOTION_OK, useMedia } from "@/lib/useMedia";
import { PauseIcon, PlayIcon } from "./Icons";
import s from "./ProofPanel.module.css";

type Connection = { saveData?: boolean };

/*
 * The brand film, silent and looping like tesla.com's: it loads nothing until it is on screen, plays only
 * while it is, and never starts by itself for visitors who reduce motion or save data.
 */
export function FilmPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [stopped, setStopped] = useState(false);
  const motionOk = useMedia(MOTION_OK);

  useEffect(() => {
    const v = video.current;
    const saveData = (navigator as Navigator & { connection?: Connection }).connection?.saveData;
    if (!v || !motionOk || stopped || saveData) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          v.preload = "auto";
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [motionOk, stopped]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      setStopped(false);
      v.play().catch(() => {});
    } else {
      setStopped(true);
      v.pause();
    }
  };

  return (
    <div className={s.film}>
      {/* The still before the film plays: optimised and lazy, unlike a video poster attribute. */}
      <Image
        className={s.poster}
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        quality={78}
      />
      <video
        ref={video}
        className={s.video}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button type="button" className={s.toggle} onClick={toggle} aria-label={playing ? "Pause the film" : "Play the film"}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}
