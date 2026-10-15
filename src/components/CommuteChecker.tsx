"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Car, MapPin, Navigation } from "lucide-react";
import { commuteDestinations, commuteFrom, directionsUrl } from "@/lib/proof";

/*
 * Commute is a top worry for Bengaluru buyers, and travel times change by the hour. Rather than
 * quote a number we can't stand behind, every route opens live directions from the project in
 * Google Maps, including one to the buyer's own office.
 */
export function CommuteChecker() {
  const [office, setOffice] = useState("");
  const go = useRef<HTMLAnchorElement>(null);
  const href = office.trim() ? directionsUrl(`${office.trim()}, Bengaluru`) : undefined;

  // A real link opens the route (pop-up blockers allow it); Enter in the field follows the same link.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (href) go.current?.click();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <form onSubmit={onSubmit} className="card flex flex-col p-6 md:p-8">
        <p className="flex items-center gap-2 text-sm text-mute">
          <MapPin aria-hidden className="size-4 text-forest" strokeWidth={1.8} /> From {commuteFrom.label}, Gunjur
        </p>
        <label htmlFor="office" className="serif mt-4 text-[1.7rem] leading-tight">
          Where do you work?
        </label>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">
          Type your office or your children’s school. We’ll open today’s live route in Google Maps, so you see the real time, not
          our estimate.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            id="office"
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            placeholder="e.g. Bagmane Tech Park"
            autoComplete="off"
            className="min-h-12 flex-1 rounded-lg border border-ink/20 bg-white/70 px-4 text-[1rem] outline-none transition-colors placeholder:text-ink/40 focus:border-forest"
          />
          {href ? (
            <a
              ref={go}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest px-5 font-semibold text-paper transition-colors hover:bg-forest-2"
            >
              <Navigation aria-hidden className="size-4" /> Show my route
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          ) : (
            <button type="submit" aria-disabled className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-forest px-5 font-semibold text-paper opacity-40">
              <Navigation aria-hidden className="size-4" /> Show my route
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-mute">Opens Google Maps in a new tab. Nothing you type is stored.</p>
      </form>

      <div>
        <p className="label text-mute">Or try a common one</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {commuteDestinations.map((d) => (
            <li key={d.label}>
              <a
                href={directionsUrl(d.query)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white/50 px-4 py-3 transition-colors hover:border-forest hover:bg-forest hover:text-paper"
              >
                <span className="flex items-center gap-3">
                  <Car aria-hidden className="size-4 text-forest transition-colors group-hover:text-paper" strokeWidth={1.7} />
                  <span className="font-medium">{d.label}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-4 opacity-60" />
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
