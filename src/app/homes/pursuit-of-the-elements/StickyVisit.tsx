"use client";

import { useEffect, useState } from "react";
import { links } from "@/lib/content";
import s from "./StickyVisit.module.css";

/*
 * A phone-only "Book a visit" bar. It shows once the hero has scrolled away and hides again over the
 * enquiry form and the footer, so it never repeats the form's ask or covers the footer. It sits to the
 * right of the Feedback tab and below the cookie bar.
 */
export function StickyVisit() {
  const [heroGone, setHeroGone] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("page-title")?.closest("section");
    const covers = [document.getElementById("enquire"), document.querySelector("footer")].filter(Boolean) as Element[];
    if (!hero) return;
    const seen = new Set<Element>();
    const heroObs = new IntersectionObserver(([en]) => setHeroGone(!en.isIntersecting));
    const coverObs = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) seen.add(en.target);
        else seen.delete(en.target);
      }
      setBlocked(seen.size > 0);
    });
    heroObs.observe(hero);
    covers.forEach((c) => coverObs.observe(c));
    return () => {
      heroObs.disconnect();
      coverObs.disconnect();
    };
  }, []);

  return (
    <a href={links.bookVisit} className={`btn btn-primary ${s.bar}`} data-show={heroGone && !blocked} tabIndex={heroGone && !blocked ? 0 : -1}>
      Book a visit
    </a>
  );
}
