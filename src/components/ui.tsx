import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type LinkProps = ComponentProps<typeof Link>;

/*
 * Pill buttons. The arrow sits in its own disc, which grows to fill the pill on hover
 * so the label reverses out of it.
 */
const buttonBase =
  "group relative isolate inline-flex min-h-12 items-center justify-between gap-4 overflow-hidden rounded-full py-1.5 pl-6 pr-1.5 text-[0.9rem] font-medium tracking-[-0.005em] transition-colors duration-500";

const buttonVariants = {
  ink: "bg-ink text-paper hover:text-ink [--disc:var(--color-paper)] [--disc-fg:var(--color-ink)]",
  paper: "bg-paper text-ink hover:text-paper [--disc:var(--color-ink)] [--disc-fg:var(--color-paper)]",
  "outline-light":
    "border border-paper/30 text-paper hover:text-ink [--disc:var(--color-paper)] [--disc-fg:var(--color-ink)]",
  "outline-dark": "border border-ink/25 text-ink hover:text-paper [--disc:var(--color-ink)] [--disc-fg:var(--color-paper)]",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant = "ink", className = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${className}`;
}

export function ButtonInner({ children, icon = true }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      {/* The disc that floods the pill on hover. */}
      <span
        aria-hidden
        className="absolute right-1.5 top-1/2 -z-10 size-9 -translate-y-1/2 rounded-full bg-[var(--disc)] transition-transform duration-700 ease-out-expo group-hover:scale-[14]"
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--disc-fg)]"
      >
        {icon ? (
          <ArrowRight
            className="size-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-45"
            strokeWidth={1.5}
          />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </span>
    </>
  );
}

export function ButtonLink({
  variant = "ink",
  className = "",
  children,
  icon = true,
  ...props
}: LinkProps & { variant?: ButtonVariant; icon?: boolean }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </Link>
  );
}

/* Text link with an underline that wipes out and back in. */
export function ArrowLink({
  className = "",
  children,
  external = false,
  ...props
}: LinkProps & { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      className={`group inline-flex min-h-11 items-center gap-2 text-[0.92rem] font-medium ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:0%_1px] group-hover:bg-right-bottom">
        {children}
      </span>
      <Icon
        aria-hidden
        className={`size-4 transition-transform duration-500 ease-out-expo ${external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1"}`}
        strokeWidth={1.5}
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </Link>
  );
}

/* Small monospaced label, optionally numbered: "01 — The collection". */
export function Label({
  children,
  n,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  n?: string;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag className={`label flex items-center gap-3 ${className}`}>
      {n && <span className="tabular-nums">{n}</span>}
      {n && <span aria-hidden className="h-px w-6 bg-current opacity-40" />}
      <span>{children}</span>
    </Tag>
  );
}

type RevealVariant = "up" | "lines" | "bloom";

/* Reveals its content as it scrolls into view (see RevealObserver and globals.css). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
  as?: "div" | "li" | "figure" | "section" | "article" | "h2" | "p";
  style?: CSSProperties;
}) {
  return (
    <Tag data-reveal={variant} className={className} style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}

/* Headline whose lines rise from behind a mask. Pass each line as an array item. */
export function Lines({
  lines,
  className = "",
  as: Tag = "h2",
  id,
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  delay?: number;
}) {
  return (
    <Tag
      id={id}
      data-reveal="lines"
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {lines.map((l, i) => (
        <span key={i} className="line" style={{ "--i": i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function MediaBadge({ kind, className = "" }: { kind: "photo" | "render" | "plan"; className?: string }) {
  if (kind === "photo") return null;
  return (
    <span
      className={`label absolute left-3 top-3 z-10 rounded-full bg-ink/75 px-3 py-1.5 text-[0.6rem] text-paper backdrop-blur-sm ${className}`}
    >
      {kind === "render" ? "Artist’s impression" : "Plan"}
    </span>
  );
}
