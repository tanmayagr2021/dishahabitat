"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fullSite, whatsappVisit } from "@/lib/content";
import { Logo } from "./Logo";
import s from "./SiteNav.module.css";

const items = [
  { label: "Communities", href: "#communities" },
  { label: "Our story", href: `${fullSite}/story` },
  { label: "Homebuyer’s checklist", href: `${fullSite}/checklist` },
  { label: "Contact", href: `${fullSite}/contact` },
];

/* Quiet by design, and always one tap from a visit. Below the width the links need, they fold into a menu. */
export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={s.nav} data-open={open ? "" : undefined}>
      <Link className={s.brand} href="/" prefetch={false} aria-label="Disha Habitat, home">
        <Logo className={s.logo} />
      </Link>
      <nav aria-label="Main" className={s.links}>
        <ul>
          {items.map((i) => (
            <li key={i.label}>
              <a href={i.href}>{i.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a className={s.visit} href={whatsappVisit} target="_blank" rel="noopener noreferrer">
        Plan a visit<span className="sr-only"> on WhatsApp</span>
      </a>
      <button
        type="button"
        className={s.menuButton}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav id="site-menu" aria-label="Menu" className={s.panel} hidden={!open}>
        <ul>
          {items.map((i) => (
            <li key={i.label}>
              <a href={i.href} onClick={() => setOpen(false)}>
                {i.label}
              </a>
            </li>
          ))}
          <li>
            <a className={s.panelVisit} href={whatsappVisit} target="_blank" rel="noopener noreferrer">
              Plan a visit on WhatsApp
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
