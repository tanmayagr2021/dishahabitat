"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { links, whatsappVisit } from "@/lib/site";
import { Logo } from "./Logo";
import s from "./SiteNav.module.css";

const items = [
  { label: "Communities", href: links.communities },
  { label: "Our story", href: links.story },
  { label: "Homebuyer’s checklist", href: links.checklist },
  { label: "Contact", href: links.contact },
];

/* Quiet by design: small, set in the page's own colour, and always one tap from a visit. */
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
      <Link className={s.brand} href="/" aria-label="Disha Habitat, home">
        <Logo className={s.logo} />
      </Link>
      <nav aria-label="Main" className={s.links}>
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
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
      <div id="site-menu" className={s.panel} hidden={!open}>
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
