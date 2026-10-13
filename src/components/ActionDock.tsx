"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Bot, CalendarCheck, MessageCircle, Phone, Plus } from "lucide-react";
import { openDiniee } from "@/components/Diniee";
import { elements } from "@/lib/elements";
import { openComposer } from "@/lib/messaging";

/*
 * One quiet round button in the corner. Pressed, it fans out its actions in a vertical stack,
 * like a stack on the macOS Dock: book a site visit (nearest the thumb), WhatsApp, Diniee, call.
 * Choosing one, pressing Escape or tapping anywhere else folds the stack away. It appears once the
 * visitor has scrolled past the opening, and steps aside while a booking form is on screen.
 */
type Item = { key: string; label: string; icon: ReactNode; primary?: boolean; href?: string; onClick?: () => void; external?: boolean };

export function ActionDock() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const forms = document.querySelectorAll("#enquire, #book");
    const io = new IntersectionObserver((es) => setFormInView(es.some((e) => e.isIntersecting)), { threshold: 0.15 });
    forms.forEach((f) => io.observe(f));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  // Fold away on Escape, on a tap elsewhere, and on navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const visible = show && !formInView;
  const bookHref = pathname.startsWith("/contact") ? "#book" : "/contact#book";

  // Listed top to bottom; the primary action sits nearest the button.
  const items: Item[] = [
    { key: "call", label: `Call ${elements.phone.display}`, icon: <Phone aria-hidden className="size-[1.1rem]" strokeWidth={1.7} />, href: elements.phone.href },
    { key: "diniee", label: "Ask Diniee", icon: <Bot aria-hidden className="size-[1.1rem]" strokeWidth={1.7} />, onClick: openDiniee },
    { key: "wa", label: "WhatsApp us", icon: <MessageCircle aria-hidden className="size-[1.1rem]" strokeWidth={1.7} />, onClick: () => openComposer({ channel: "whatsapp" }) },
    { key: "book", label: "Book a site visit", icon: <CalendarCheck aria-hidden className="size-[1.1rem]" strokeWidth={1.8} />, href: bookHref, primary: true },
  ];

  return (
    <div
      ref={root}
      data-print-hide=""
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-2.5 transition-[opacity,transform] duration-500 ease-out-expo md:bottom-6 md:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <ul id="action-stack" className="flex flex-col items-end gap-2.5" aria-label="Get in touch">
        {items.map((it, i) => {
          const fromBottom = items.length - 1 - i;
          const cls = `stack-item flex h-12 items-center gap-3 rounded-full pl-4 pr-5 text-[0.95rem] font-medium shadow-[0_14px_34px_-14px_rgb(0_0_0/0.55)] backdrop-blur-md ${
            it.primary ? "bg-paper text-ink hover:bg-white" : "bg-forest-deep/92 text-paper hover:bg-forest"
          }`;
          const inner = (
            <>
              <span className={`inline-flex size-8 items-center justify-center rounded-full ${it.primary ? "bg-forest text-paper" : "bg-paper/10"}`}>{it.icon}</span>
              {it.label}
            </>
          );
          return (
            <li
              key={it.key}
              className={`stack-li ${open ? "is-open" : ""}`}
              style={{ "--k": fromBottom } as CSSProperties}
              aria-hidden={!open}
            >
              {it.href ? (
                <Link href={it.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    setOpen(false);
                    it.onClick?.();
                  }}
                  className={cls}
                >
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="action-stack"
        aria-label={open ? "Close contact options" : "Book a visit or contact us"}
        onClick={() => setOpen((v) => !v)}
        className={`group relative inline-flex h-14 items-center gap-2.5 rounded-full pl-4 pr-5 font-semibold shadow-[0_18px_40px_-14px_rgb(0_0_0/0.6)] transition-colors duration-300 ${
          open ? "bg-paper text-ink" : "bg-forest text-paper hover:bg-forest-2"
        }`}
      >
        <span className={`inline-flex size-8 items-center justify-center rounded-full transition-[transform,background-color] duration-500 ease-out-expo ${open ? "rotate-45 bg-forest text-paper" : "bg-paper/15"}`}>
          <Plus aria-hidden className="size-4" strokeWidth={2.2} />
        </span>
        <span className="text-[0.95rem]">{open ? "Close" : "Visit or contact"}</span>
        {!open && <span aria-hidden className="dock-ping absolute inset-0 rounded-full" />}
      </button>
    </div>
  );
}
