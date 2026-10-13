import { company, socialHandle } from "@/lib/site";

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

export function SocialIcons({ className = "", itemClassName = "" }: { className?: string; itemClassName?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Disha Habitat on social media">
      {company.socials.map((s) => (
        <li key={s.href}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} (opens in a new tab)`}
            className={`inline-flex size-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-current/60 ${itemClassName}`}
          >
            <Mark label={s.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SocialCards({ tone = "light" }: { tone?: "light" | "dark" }) {
  const card = tone === "dark" ? "card-dark hover:border-paper/30" : "card hover:border-ink/25";
  const muted = tone === "dark" ? "text-paper/60" : "text-mute";
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {company.socials.map((s) => (
        <li key={s.href}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${card} group flex items-center gap-4 p-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5`}>
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-current/[0.07]">
              <Mark label={s.label} />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{s.label}</span>
              <span className={`block truncate text-sm ${muted}`}>
                {s.label === "YouTube" || s.label === "LinkedIn" ? "Disha Habitat" : socialHandle} · {notes[s.label]}
              </span>
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
