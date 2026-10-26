"use client";

import { useRef, useState, type FormEvent } from "react";
import { fieldClasses } from "@/components/ds";
import { ArrowRight } from "@/components/showroom/Icons";
import { commuteDestinations, commuteFrom, directionsUrl } from "@/lib/proof";
import s from "./CommuteChecker.module.css";

const shortcuts = commuteDestinations.slice(0, 4);

const NEW_TAB = <span className="sr-only">(opens Google Maps in a new tab)</span>;

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
    <div className={s.checker}>
      <form onSubmit={onSubmit} className={s.panel}>
        <p className={s.from}>From {commuteFrom.label}, Gunjur</p>
        <label htmlFor="office" className={`display ${s.ask}`}>
          Where do you go every day?
        </label>
        <p className={s.hint}>Type your office or a school. We open today’s live route in Google Maps.</p>
        <div className={s.row}>
          <input
            id="office"
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            placeholder="Your office, or a school"
            autoComplete="off"
            className={`${fieldClasses.control} ${s.input}`}
          />
          {href ? (
            <a ref={go} href={href} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              Show my route
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          ) : (
            <button type="submit" aria-disabled="true" className={`btn btn-dark ${s.idle}`}>
              Show my route
            </button>
          )}
        </div>
        <p className={s.small}>Opens in a new tab. We don’t store what you type; Google Maps receives it.</p>
      </form>

      <section aria-labelledby="common-routes" className={s.chips}>
        <h3 id="common-routes" className="eyebrow">
          Or try a common one
        </h3>
        <ul className={s.links}>
          {shortcuts.map((d) => (
            <li key={d.label}>
              <a href={directionsUrl(d.query)} target="_blank" rel="noopener noreferrer" className={s.link}>
                {d.label}
                <ArrowRight />
                {NEW_TAB}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
