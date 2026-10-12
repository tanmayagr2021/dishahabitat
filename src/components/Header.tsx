"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/site";
import { buttonClass } from "@/components/ui";

const nav = [
  { href: "/homes", label: "Our homes" },
  { href: "/story", label: "Our story" },
  { href: "/#homeowners", label: "Homeowners" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      // Keep keyboard focus inside the open menu.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
          Boolean,
        ) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-rule/80 bg-ivory/90 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-18 items-center justify-between gap-6 md:h-22">
          <Link href="/" className="relative z-10 -ml-1 p-1" aria-label="Disha Habitat — home">
            <Logo className="h-10 w-auto text-ink md:h-12" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative py-2 text-[0.82rem] font-medium tracking-[0.04em] text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out-soft group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact#enquire" className={buttonClass("solid", "hidden min-h-11 px-5 sm:inline-flex")}>
              Enquire
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 -mr-2 inline-flex size-12 items-center justify-center text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-18 z-40 overflow-y-auto bg-ivory md:top-22 lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex min-h-full flex-col justify-between gap-12 pb-10 pt-8">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-baseline justify-between py-5 text-ink"
                >
                  <span className="display text-[2.6rem] leading-none">{item.label}</span>
                  <span className="text-xs tabular-nums text-ink-mute">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <Link href="/contact#enquire" onClick={() => setOpen(false)} className={buttonClass("solid", "w-full")}>
              Enquire now
            </Link>
            <div className="space-y-1 text-sm text-ink-soft">
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="block py-1.5">
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${company.email}`} className="block py-1.5">
                {company.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
