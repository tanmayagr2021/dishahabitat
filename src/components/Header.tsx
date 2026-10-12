"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/site";
import { buttonClass, ButtonInner } from "@/components/ui";

const nav = [
  { href: "/homes", label: "Our homes" },
  { href: "/plan", label: "Plan your home" },
  { href: "/story", label: "Our story" },
  { href: "/#homeowners", label: "Homeowners" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Solid after leaving the top; tucks away while scrolling down, returns on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 640 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y <= 640) setHidden(false);
      last = y;
    };
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
        const focusables = [
          toggleRef.current,
          ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
        ].filter(Boolean) as HTMLElement[];
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
        data-tone="dark"
        className={`fixed inset-x-0 top-0 z-50 text-ivory transition-[background-color,transform,border-color] duration-500 ease-out-soft ${
          solid ? "border-b border-ivory/10 bg-forest-950/90 backdrop-blur-md" : "border-b border-transparent"
        } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        {!solid && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-forest-950/70 to-transparent"
          />
        )}
        <div className="shell flex h-18 items-center justify-between gap-6 md:h-22">
          <Link href="/" className="relative z-10 -ml-1 p-1" aria-label="Disha Habitat — home">
            <Logo className="h-10 w-auto md:h-12" />
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-10">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative py-2 text-[0.8rem] font-medium tracking-[0.06em] text-ivory/75 transition-colors hover:text-ivory aria-[current=page]:text-ivory"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brass-light transition-transform duration-500 ease-out-soft group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/contact#enquire" className={buttonClass("brass", "hidden min-h-11 px-5 sm:inline-flex")}>
              <ButtonInner icon={false}>Enquire</ButtonInner>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 -mr-2 inline-flex size-12 items-center justify-center xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden className="relative block h-3 w-7">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-soft ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px bg-current transition-all duration-500 ease-out-soft ${
                    open ? "top-1.5 w-full -rotate-45" : "top-3 w-4"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        data-tone="dark"
        className="topo fixed inset-x-0 bottom-0 top-18 z-40 overflow-y-auto bg-forest-900 text-ivory [--topo-opacity:0.22] md:top-22 xl:hidden"
      >
        <nav aria-label="Mobile" className="shell flex min-h-full flex-col justify-between gap-12 pb-10 pt-6">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
              <li
                key={item.href}
                className="anim-rise border-b border-ivory/12"
                style={{ "--d": `${80 + i * 60}ms` } as CSSProperties}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="group flex items-baseline justify-between py-4"
                >
                  <span className="display text-[2.6rem] leading-none transition-colors group-hover:text-brass-light group-aria-[current=page]:text-brass-light">
                    {item.label}
                  </span>
                  <span className="font-display text-base italic text-brass">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="anim-fade space-y-6" style={{ "--d": "500ms" } as CSSProperties}>
            <Link href="/contact#enquire" onClick={() => setOpen(false)} className={buttonClass("brass", "w-full")}>
              <ButtonInner>Enquire now</ButtonInner>
            </Link>
            <div className="grid grid-cols-2 gap-x-4 text-sm text-ivory/70">
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="py-2 hover:text-ivory">
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${company.email}`} className="col-span-2 py-2 hover:text-ivory">
                {company.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
