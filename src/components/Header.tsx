"use client";

import Image from "next/image";
import Link from "next/link";
import { ComposeButton } from "@/components/ComposeButton";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SocialIcons } from "@/components/Socials";
import { company } from "@/lib/site";
import { elements } from "@/lib/elements";
import { projectsNewestFirst } from "@/lib/projects";

const nav = [
  { href: "/homes", label: "Our homes" },
  { href: "/story", label: "Our story" },
  { href: "/story#homemakers", label: "Homemakers" },
  { href: "/checklist", label: "Checklist" },
  { href: "/plan", label: "EMI calculator" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The section under the header sets its colours. An observer watches a thin band at the top
  // of the viewport, so nothing is measured on scroll.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main [data-tone], footer[data-tone]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setTone((e.target as HTMLElement).dataset.tone === "dark" ? "dark" : "light");
        }
      },
      { rootMargin: "-36px 0px -96% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

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
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [
          toggleRef.current,
          ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
        ].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const dark = open || tone === "dark";

  return (
    <>
      <header
        data-header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${dark ? "text-paper" : "text-ink"} ${
          scrolled && !open
            ? dark
              ? "bg-forest-deep/88 shadow-[0_1px_0_rgb(255_255_255/0.07)] backdrop-blur-md"
              : "bg-paper/90 shadow-[0_1px_0_rgb(0_0_0/0.08)] backdrop-blur-md"
            : ""
        }`}
      >
        {/* How far down the page you are */}
        <span aria-hidden className="scroll-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brass" />
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-[5rem]">
          <Link href="/" className="relative z-10 -ml-1 p-1" aria-label="Disha Habitat home">
            <span data-header-logo className="block">
              <Logo className="block h-9 w-auto md:h-11" />
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative inline-flex h-11 items-center px-3 text-[0.95rem]"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-2 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact#book"
              className={`hidden h-11 items-center gap-3 rounded-lg px-5 text-[0.95rem] font-medium transition-colors sm:inline-flex ${
                dark ? "bg-paper font-semibold text-ink hover:bg-white" : "bg-forest font-semibold text-paper hover:bg-forest-2"
              }`}
            >
              Book a site visit
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className={`relative z-10 inline-flex h-11 items-center gap-3 rounded-lg pl-4 pr-3.5 text-[0.95rem] lg:hidden ${
                dark ? "bg-paper/10" : "bg-ink/6"
              }`}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden className="relative block h-2.5 w-4">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${
                    open ? "top-[5px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${
                    open ? "top-[5px] -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu (mobile and tablet). */}
      <div
        id="site-menu"
        ref={panelRef}
        hidden={!open}
        data-tone="dark"
        className="surface-forest fixed inset-0 z-40 overflow-y-auto lg:hidden"
      >
        <nav aria-label="Menu" className="shell flex min-h-full flex-col gap-10 pb-10 pt-24">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav].map((item) => (
              <li key={item.href} className="border-b border-paper/10">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="group flex items-center justify-between py-3.5"
                >
                  <span className="serif text-[2.4rem] leading-tight group-aria-[current=page]:text-brass">{item.label}</span>
                  <span aria-hidden className="text-paper/40">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href={elements.href} onClick={() => setOpen(false)} className="card-dark flex items-center gap-4 p-3">
            <span className="relative block aspect-[4/3] w-28 shrink-0 overflow-hidden">
              <Image src={elements.cover.src} alt="" fill sizes="112px" className="object-cover" />
            </span>
            <span>
              <span className="label text-cyan">{elements.status}</span>
              <span className="serif mt-1 block text-[1.5rem] leading-tight">{elements.shortName}</span>
              <span className="mt-0.5 block text-sm text-paper/60">{elements.locality}</span>
            </span>
          </Link>

          <div>
            <p className="label text-paper/50">Delivered communities</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[0.95rem]">
              {projectsNewestFirst.map((p) => (
                <li key={p.slug}>
                  <Link href={`/homes/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-2 py-1.5">
                    <span aria-hidden className="size-1.5 rounded-full" style={{ background: p.hue }} />
                    {p.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto grid gap-1 text-[0.95rem] text-paper/75">
            <a href={elements.phone.href} className="py-1.5 hover:text-paper">
              Sales · {elements.phone.display}
            </a>
            {company.phones.map((p) => (
              <a key={p.href} href={p.href} className="py-1.5 hover:text-paper">
                Office · {p.display}
              </a>
            ))}
            <ComposeButton channel="email" className="py-1.5 text-left hover:text-paper">
              {company.email}
            </ComposeButton>
            <SocialIcons className="mt-4 text-paper/80" />
          </div>
        </nav>
      </div>
    </>
  );
}
