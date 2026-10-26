"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FocusEvent, type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { communities, communityHref, company, homesMenuLinks, links, nav } from "@/lib/content";
import { isCurrent, opensOnPhoto } from "@/lib/routes";
import { openComposer } from "@/lib/messaging";
import { ChatIcon, ChevronDown, CloseIcon, PhoneIcon } from "./Icons";
import { Logo } from "./Logo";
import s from "./SiteHeader.module.css";

const hrefOf = communityHref;

/* Internal addresses move without a page load; outside ones are plain links. */
function NavLink({ href, className, children, current }: { href: string; className?: string; children: ReactNode; current?: boolean }) {
  if (href.startsWith("/"))
    return (
      <Link href={href} className={className} aria-current={current ? "page" : undefined}>
        {children}
      </Link>
    );
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/*
 * tesla.com's header: transparent over the hero, the name on the left, a few words in the middle and
 * icons on the right. "Homes" opens a white panel with every community, as "Vehicles" does there.
 * When the words no longer fit (narrow screens, or larger text) everything moves into a full-screen
 * menu behind one "Menu" button.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const onPhoto = opensOnPhoto(pathname);
  const [mega, setMega] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [sheetHomes, setSheetHomes] = useState(false);
  const homesButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef(0);
  const id = useId();
  const megaId = `${id}-homes`;
  const sheetId = `${id}-menu`;
  const sheetHomesId = `${id}-menu-homes`;

  /* Escape closes whichever is open and hands focus back to the button that opened it. */
  useEffect(() => {
    if (!mega && !sheet) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (sheet) {
        setSheet(false);
        menuButton.current?.focus();
      } else {
        setMega(false);
        homesButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega, sheet]);

  /* The menu covers the page: the page stops scrolling under it, and focus starts on Close. */
  useEffect(() => {
    if (!sheet) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      html.style.overflow = before;
    };
  }, [sheet]);

  /* When the bar switches between the full nav and Menu, the menu that no longer applies closes. */
  useEffect(() => {
    const bar = barRef.current;
    const navEl = navRef.current;
    if (!bar || !navEl) return;
    const ro = new ResizeObserver(() => {
      if (getComputedStyle(navEl).display === "none") setMega(false);
      else setSheet(false);
    });
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* Moving to another page closes whatever was open. */
  const [shownFor, setShownFor] = useState(pathname);
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setMega(false);
    setSheet(false);
    setSheetHomes(false);
  }

  const hover = (open: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMega(open), open ? 80 : 200);
  };

  const closeSheet = () => {
    setSheet(false);
    menuButton.current?.focus();
  };

  /* Tab stays inside the open menu. */
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const focusable = Array.from(
      sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ).filter((el) => el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* Tabbing out of the Homes panel closes it. */
  const leaveHomes = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(false);
  };

  const solid = mega || sheet;

  return (
    <header
      className={s.header}
      data-surface={onPhoto ? "photo" : "page"}
      data-solid={solid || !onPhoto || undefined}
      data-tone={solid || !onPhoto ? undefined : "dark"}
    >
      <div ref={barRef} className={s.bar}>
        <Link href="/" prefetch={false} className={s.brand} aria-label="Disha Habitat, home">
          <Logo className={s.logo} monochrome title="Disha Habitat" />
        </Link>

        <nav ref={navRef} className={s.nav} aria-label="Main">
          <ul className={s.navList}>
            <li
              onPointerEnter={(e) => e.pointerType === "mouse" && hover(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && hover(false)}
              onBlur={leaveHomes}
            >
              <button
                ref={homesButton}
                type="button"
                className={`${s.navItem} ${s.jsOnly}`}
                aria-expanded={mega}
                aria-controls={megaId}
                onClick={() => setMega((v) => !v)}
              >
                Homes
                <ChevronDown className={s.navChevron} />
              </button>
              {/* Without scripts the button cannot open its panel, so a plain link stands in. */}
              <a className={`${s.navItem} ${s.noJsOnly}`} href={links.homes}>
                Homes
              </a>
              <div id={megaId} className={s.mega} hidden={!mega}>
                <div className={s.megaInner}>
                  <ul className={s.tiles}>
                    {communities.map((c) => (
                      <li key={c.slug}>
                        <NavLink className={s.tile} href={hrefOf(c.slug)} current={isCurrent(pathname, hrefOf(c.slug))}>
                          <span className={s.thumb}>
                            <Image className={s.thumbImg} src={c.image.src} alt="" fill sizes="240px" quality={78} />
                          </span>
                          <span className={s.tileName}>{c.name}</span>
                          <span className={s.tileMeta}>{c.eyebrow}</span>
                        </NavLink>
                        {c.ctas.some((cta) => cta.href === links.bookVisit) && (
                          <NavLink className={s.tileExtra} href={links.bookVisit}>
                            Book a visit
                          </NavLink>
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul className={s.side}>
                    {homesMenuLinks.map((l) => (
                      <li key={l.label}>
                        <NavLink href={l.href}>{l.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            {nav.map((item) => (
              <li key={item.label}>
                <NavLink className={s.navItem} href={item.href} current={isCurrent(pathname, item.href)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.actions}>
          <a className={s.icon} href={company.sales.tel} aria-label={`Call sales, ${company.sales.display}`} title={`Call ${company.sales.display}`}>
            <PhoneIcon />
          </a>
          <button
            type="button"
            className={s.icon}
            onClick={() => openComposer({ channel: "whatsapp" })}
            aria-label="Message Disha Habitat on WhatsApp"
            title="WhatsApp"
          >
            <ChatIcon />
          </button>
          <button
            ref={menuButton}
            type="button"
            className={`${s.menuButton} ${s.jsOnly}`}
            aria-expanded={sheet}
            aria-controls={sheetId}
            onClick={() => setSheet(true)}
          >
            Menu
          </button>
          <a className={`${s.menuButton} ${s.noJsOnly}`} href={links.homes}>
            Homes
          </a>
        </div>
      </div>

      {mega && <div className={s.backdrop} aria-hidden="true" onClick={() => setMega(false)} />}

      <div
        id={sheetId}
        ref={sheetRef}
        className={s.sheet}
        hidden={!sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onKeyDown={trapFocus}
      >
        <div className={s.sheetBar}>
          <Logo className={s.logo} monochrome title="Disha Habitat" />
          <button ref={closeButton} type="button" className={s.close} onClick={closeSheet} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav className={s.sheetNav} aria-label="Menu">
          <ul>
            <li>
              <button
                type="button"
                className={s.sheetItem}
                aria-expanded={sheetHomes}
                aria-controls={sheetHomesId}
                onClick={() => setSheetHomes((v) => !v)}
              >
                Homes
                <ChevronDown />
              </button>
              <ul id={sheetHomesId} className={s.sheetSub} hidden={!sheetHomes}>
                {communities.map((c) => (
                  <li key={c.slug}>
                    <NavLink href={hrefOf(c.slug)} current={isCurrent(pathname, hrefOf(c.slug))}>
                      {c.name}
                      <span>{c.eyebrow}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink href={links.homes} current={pathname === links.homes}>
                    All homes
                  </NavLink>
                </li>
              </ul>
            </li>
            {nav.map((item) => (
              <li key={item.label}>
                <NavLink className={s.sheetItem} href={item.href} current={isCurrent(pathname, item.href)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.sheetActions}>
          <NavLink className="btn btn-primary" href={links.bookVisit}>
            Book a visit
          </NavLink>
          <a className="btn btn-soft" href={company.sales.tel}>
            Call {company.sales.display}
          </a>
          <button type="button" className="btn btn-soft" onClick={() => {
              setSheet(false);
              openComposer({ channel: "whatsapp" });
            }}
          >
            WhatsApp
          </button>
        </div>
      </div>
    </header>
  );
}
