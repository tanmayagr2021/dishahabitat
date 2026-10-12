import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type LinkProps = ComponentProps<typeof Link>;

/*
 * Buttons: square-cornered, set in wide capitals. On hover a fill wipes across from the left
 * and the drawn line in front of the arrow lengthens — the brand's single line, extending.
 */
const buttonBase =
  "group relative isolate inline-flex min-h-[3.25rem] items-center justify-between gap-6 overflow-hidden rounded-[2px] py-2 pl-6 pr-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] [font-stretch:118%] transition-colors duration-500";

const buttonVariants = {
  ink: "bg-ink text-paper hover:text-forest-deep [--fill:var(--color-cyan)]",
  paper: "bg-paper text-ink hover:text-forest-deep [--fill:var(--color-cyan)]",
  brass: "bg-brass text-forest-deep hover:text-forest-deep [--fill:var(--color-paper)]",
  "outline-light": "border border-paper/35 text-paper hover:text-ink [--fill:var(--color-paper)]",
  "outline-dark": "border border-ink/30 text-ink hover:text-paper [--fill:var(--color-ink)]",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant = "ink", className = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${className}`;
}

export function ButtonInner({ children, icon = true }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[var(--fill)] transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />
      <span className="relative">{children}</span>
      {icon && (
        <span aria-hidden className="relative flex items-center">
          <span className="h-px w-5 bg-current transition-[width] duration-700 ease-out-expo group-hover:w-9" />
          <span className="-ml-[7px] size-[7px] rotate-45 border-r border-t border-current" />
        </span>
      )}
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

/* Text link: an underline that draws away and back, and a lengthening line before the arrow. */
export function ArrowLink({
  className = "",
  children,
  external = false,
  ...props
}: LinkProps & { external?: boolean }) {
  return (
    <Link
      className={`group inline-flex min-h-11 items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] [font-stretch:118%] ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:0%_1px] group-hover:bg-right-bottom">
        {children}
      </span>
      {external ? (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.5}
        />
      ) : (
        <span aria-hidden className="flex items-center">
          <span className="h-px w-4 bg-current transition-[width] duration-700 ease-out-expo group-hover:w-8" />
          <span className="-ml-[7px] size-[7px] rotate-45 border-r border-t border-current" />
        </span>
      )}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </Link>
  );
}

/* The roof of the official Disha Habitat mark (same path as the logo), used as a section glyph. */
export function RoofMark({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="20.5 0 24 15.4" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M43.64,8.93l-1.46-.57s-.06-.03-.08-.04l-9.42-3.73V1.18c0-.46-.37-.83-.83-.83s-.83.37-.83.83v3.42l-10.94,4.33c-.2.08-.37.24-.45.45-.08.2-.09.43,0,.64.13.32.43.52.77.52.11,0,.2-.02.3-.06l.37-.14v3.31c0,.89.73,1.62,1.62,1.62h8.39c.89,0,1.62-.73,1.62-1.62v-7.26l8.32,3.29v4.76c0,.46.37.83.83.83s.83-.37.83-.83v-4.1l.37.15c.42.17.9-.04,1.07-.47s-.04-.9-.47-1.07M31.02,6.38v7.22h-8.32v-3.93s8.32-3.29,8.32-3.29Z" />
    </svg>
  );
}

/* Section marker: the roof glyph, a number, a drawn line and a name — "01 —— Now selling". */
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
      {n && <span aria-hidden className="h-px w-8 bg-current opacity-50" />}
      <span>{children}</span>
    </Tag>
  );
}

type RevealVariant = "up" | "lines" | "bloom" | "mask" | "rule";

/* Reveals its content as it scrolls into view (see RevealObserver and globals.css). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
  as: Tag = "div",
  style,
}: {
  children?: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
  as?: "div" | "li" | "figure" | "section" | "article" | "h2" | "p" | "span";
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
    <Tag id={id} data-reveal="lines" className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
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
      className={`label absolute left-3 top-3 z-10 bg-forest-deep/75 px-2.5 py-1.5 text-[0.56rem] text-paper backdrop-blur-sm ${className}`}
    >
      {kind === "render" ? "Artist’s impression" : "Plan"}
    </span>
  );
}
