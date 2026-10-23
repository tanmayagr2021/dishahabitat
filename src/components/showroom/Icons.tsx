/* The few line icons V2 uses, drawn on a 24 px grid. All decorative: every control has its own label. */
type IconProps = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.6 3.75h2.2l1.4 4-1.9 1.3a11 11 0 0 0 6.65 6.65l1.3-1.9 4 1.4v2.2a1.9 1.9 0 0 1-2.05 1.9A16.2 16.2 0 0 1 4.7 5.8a1.9 1.9 0 0 1 1.9-2.05Z" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.75a8.25 8.25 0 0 0-7.1 12.45L3.75 20.25l4.2-1.1A8.25 8.25 0 1 0 12 3.75Z" />
      <path d="M8.75 11.25h.01M12 11.25h.01M15.25 11.25h.01" strokeWidth={2.2} />
    </svg>
  );
}

export function ChevronLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 6.5v11M15 6.5v11" strokeWidth={2} />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.5 6.2v11.6L18 12 8.5 6.2Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}
