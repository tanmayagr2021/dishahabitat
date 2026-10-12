"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/site";
import { projectsByHandover } from "@/lib/projects";

const nav = [
  { href: "/homes", label: "Homes" },
  { href: "/story", label: "Story" },
  { href: "/plan", label: "Plan" },
  { href: "/contact", label: "Contact" },
] as const;

/* Reads data-tone from the section currently under the header, so the bar always contrasts. */
function toneUnder(y: number): "dark" | "light" {
  const els = document.elementsFromPoint(window.innerWidth / 2, y);
  for (const el of els) {
    if (el.closest("[data-header]")) continue;
    const toned = el.closest<HTMLElement>("[data-tone]");
    if (toned) return toned.dataset.tone === "dark" ? "dark" : "light";
  }
  return "light";
}

export function Header() {
  const pathname = usePathname();
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 600 && y > last + 6) setHidden(true);
      else if (y < last - 6 || y <= 600) setHidden(false);
      last = y;
      setTone(toneUnder(36));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,color] duration-500 ease-out-expo ${
          dark ? "text-paper" : "text-ink"
        } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="shell flex h-18 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="relative z-10 -ml-1 p-1" aria-label="Disha Habitat — home">
            <Logo className="h-9 w-auto md:h-10" />
          </Link>

          {/* Desktop navigation sits in a frosted pill once the page scrolls. */}
          <nav
            aria-label="Primary"
            className={`absolute left-1/2 hidden -translate-x-1/2 rounded-full p-1 transition-[background-color,box-shadow] duration-500 lg:block ${
              scrolled && !open
                ? dark
                  ? "bg-ink/55 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] backdrop-blur-xl"
                  : "bg-paper/70 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)] backdrop-blur-xl"
                : ""
            }`}
          >
            <ul className="flex items-center">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`group relative inline-flex h-10 items-center rounded-full px-5 text-[0.88rem] transition-colors ${
                      dark ? "hover:bg-paper/10" : "hover:bg-ink/5"
                    } aria-[current=page]:font-medium`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute bottom-1.5 left-1/2 hidden size-1 -translate-x-1/2 rounded-full bg-current group-aria-[current=page]:block"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact#enquire"
              className={`hidden h-10 items-center rounded-full px-5 text-[0.88rem] font-medium transition-colors sm:inline-flex ${
                dark ? "bg-paper text-ink hover:bg-paper/85" : "bg-ink text-paper hover:bg-ink/85"
              }`}
            >
              Enquire
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className={`relative z-10 inline-flex h-10 items-center gap-3 rounded-full pl-4 pr-3 text-[0.88rem] lg:hidden ${
                dark ? "bg-paper/10 backdrop-blur-md" : "bg-ink/5 backdrop-blur-md"
              }`}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden className="relative block h-2.5 w-4">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo ${
                    open ? "top-[5px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo ${
                    open ? "top-[5px] -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu (mobile and tablet): navigation plus the five communities. */}
      <div
        id="site-menu"
        ref={panelRef}
        hidden={!open}
        data-tone="dark"
        className="grain fixed inset-0 z-40 overflow-y-auto bg-ink text-paper lg:hidden"
      >
        <nav aria-label="Menu" className="shell flex min-h-full flex-col gap-12 pb-10 pt-28">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="anim-rise group flex items-baseline gap-4 py-1"
                  style={{ "--d": `${60 + i * 50}ms` } as CSSProperties}
                >
                  <span className="label w-6 text-mute-2">0{i + 1}</span>
                  <span className="serif text-[3.6rem] leading-[1] transition-opacity group-hover:opacity-60 group-aria-[current=page]:italic">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="anim-fade-up" style={{ "--d": "380ms" } as CSSProperties}>
            <p className="label text-mute-2">The communities</p>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {projectsByHandover.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/homes/${p.slug}`}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setPreview(i)}
                    className="group block"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-ink-3">
                      <Image
                        src={p.cover.src}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 30vw, 45vw"
                        className={`object-cover transition-[filter] duration-700 ${preview === i ? "" : "grayscale"} group-hover:grayscale-0`}
                      />
                    </span>
                    <span className="mt-2 flex items-center gap-2 text-sm">
                      <span aria-hidden className="size-1.5 rounded-full" style={{ background: p.hue }} />
                      {p.shortName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="anim-fade-up mt-auto grid gap-1 text-sm text-paper/70" style={{ "--d": "460ms" } as CSSProperties}>
            {company.phones.map((p) => (
              <a key={p.href} href={p.href} className="py-1.5 hover:text-paper">
                {p.display}
              </a>
            ))}
            <a href={`mailto:${company.email}`} className="py-1.5 hover:text-paper">
              {company.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
