import { company, socialHandle } from "@/lib/site";
import s from "./Socials.module.css";

/* Disha Habitat's social channels (from the dishahabitat.com footer), with simple drawn marks. */
function Mark({ label, className = "size-5" }: { label: string; className?: string }) {
  const common = { className, viewBox: "0 0 24 24", "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;
  switch (label) {
    case "Instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V4.5h-3c-2.5 0-4 1.7-4 4.2V11H7.5v3.5H10V21h3.5v-6.5H17l.5-3.5h-4V9c0-.6.4-1 1-1Z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10.5V17M8 7.2v.1M11.5 17v-3.8c0-1.5 1-2.7 2.4-2.7s2.1 1 2.1 2.6V17M11.5 10.5V17" strokeLinecap="round" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10.3 9.4 4.4 2.6-4.4 2.6V9.4Z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

const notes: Record<string, string> = {
  Instagram: "Life in our communities",
  Facebook: "News and events",
  LinkedIn: "The company and careers",
  YouTube: "Films and walkthroughs",
};

/* A row of round icon links, for a footer or a corner of a page. */
export function SocialIcons({ className = "", itemClassName = "" }: { className?: string; itemClassName?: string }) {
  return (
    <ul className={`${s.icons} ${className}`} aria-label="Disha Habitat on social media">
      {company.socials.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label} (opens in a new tab)`} className={`${s.icon} ${itemClassName}`}>
            <Mark label={l.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/* The four channels as grey tiles: the mark, the name, and what is posted there. */
export function SocialCards() {
  return (
    <ul className={s.cards}>
      {company.socials.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className={s.card}>
            <Mark label={l.label} className={s.mark} />
            <span>
              <strong>{l.label}</strong>
              <span>
                {l.label === "YouTube" || l.label === "LinkedIn" ? "Disha Habitat" : socialHandle} · {notes[l.label]}
              </span>
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
