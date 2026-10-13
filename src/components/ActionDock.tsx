"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { openDiniee } from "@/components/Diniee";
import { elements } from "@/lib/elements";
import { openComposer } from "@/lib/messaging";

/*
 * The one action that matters, always within reach: book a site visit, with WhatsApp and a call
 * beside it (WhatsApp is how most Indian homebuyers prefer to start). It appears once the visitor
 * has scrolled past the opening, and steps aside while a booking form is already on screen.
 * Numbers are the published sales line for Disha's current projects.
 */

export function ActionDock() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [formInView, setFormInView] = useState(false);

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

  const visible = show && !formInView;
  const bookHref = pathname.startsWith("/contact") ? "#book" : "/contact#book";

  return (
    <div
      data-print-hide=""
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] duration-500 ease-out-expo md:inset-x-auto md:bottom-6 md:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-stretch gap-2 border-t border-paper/10 bg-forest-deep/92 p-2.5 backdrop-blur-lg md:rounded-2xl md:border md:p-2 md:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)]">
        <a
          href={elements.phone.href}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-[0.72rem] text-paper/85 transition-colors hover:bg-paper/10 md:flex-none md:flex-row md:gap-2 md:px-4 md:text-sm"
        >
          <Phone aria-hidden className="size-4" strokeWidth={1.7} />
          Call
        </a>
        <button
          type="button"
          onClick={openDiniee}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-[0.72rem] text-paper/85 transition-colors hover:bg-paper/10 md:flex-none md:flex-row md:gap-2 md:px-4 md:text-sm"
        >
          <Bot aria-hidden className="size-4 text-cyan" strokeWidth={1.7} />
          Ask Diniee
        </button>
        <button
          type="button"
          onClick={() => openComposer({ channel: "whatsapp" })}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-[0.72rem] text-paper/85 transition-colors hover:bg-paper/10 md:flex-none md:flex-row md:gap-2 md:px-4 md:text-sm"
        >
          <MessageCircle aria-hidden className="size-4 text-[#5ad17a]" strokeWidth={1.7} />
          WhatsApp
        </button>
        <Link
          href={bookHref}
          className="flex flex-[1.6] items-center justify-center gap-2 rounded-xl bg-paper px-4 py-3 text-[0.92rem] font-semibold text-ink transition-colors hover:bg-white md:flex-none md:px-5"
        >
          <CalendarCheck aria-hidden className="size-4" strokeWidth={1.8} />
          <span className="whitespace-nowrap md:hidden">Book a visit</span>
          <span className="hidden whitespace-nowrap md:inline">Book a site visit</span>
        </Link>
      </div>
    </div>
  );
}
