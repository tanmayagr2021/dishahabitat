import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type LinkProps = ComponentProps<typeof Link>;

/* Buttons: plain words, soft corners, an arrow that steps forward on hover. */
const buttonBase =
  "group relative isolate inline-flex min-h-12 items-center justify-between gap-5 overflow-hidden rounded-lg py-2 pl-5 pr-4 text-[0.95rem] font-medium transition-colors duration-300";

const buttonVariants = {
  ink: "bg-ink text-paper hover:bg-forest",
  paper: "bg-paper text-ink hover:bg-white",
  brass: "bg-brass text-forest-deep hover:bg-paper",
  "outline-light": "border border-paper/30 bg-white/[0.04] text-paper backdrop-blur-sm hover:border-paper/60 hover:bg-white/10",
  "outline-dark": "border border-ink/20 bg-white/30 text-ink backdrop-blur-sm hover:border-ink/45 hover:bg-white/60",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant = "ink", className = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${className}`;
}

export function ButtonInner({ children, icon = true }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {icon && (
        <ArrowRight
          aria-hidden
          className="relative size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
          strokeWidth={1.75}
        />
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
    <Link className={buttonClass(variant, className)} data-magnetic="" {...props}>
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
      className={`group inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-medium ${className}`}
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
        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" strokeWidth={1.75} />
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

/* Small section label: plain words. (`n` is accepted for compatibility and not shown.) */
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
    <Tag className={`eyebrow ${className}`} data-n={n}>
      {children}
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

/* Splits a headline into words for the word-by-word entrance. Elements (e.g. <em>) stay whole. */
export function words(lines: ReactNode[], start = 0) {
  let i = start;
  return lines.map((l, li) => (
    <span key={li} className="block">
      {typeof l === "string"
        ? l.split(" ").map((w, wi, arr) => (
            <span key={wi}>
              <span className="w" style={{ "--wi": i++ } as CSSProperties}>
                {w}
              </span>
              {wi < arr.length - 1 ? " " : ""}
            </span>
          ))
        : (
            <span className="w" style={{ "--wi": i++ } as CSSProperties}>
              {l}
            </span>
          )}
    </span>
  ));
}

/* Headline that arrives word by word as it scrolls into view. Pass each line as an array item. */
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
    <Tag id={id} data-reveal="words" className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {words(lines)}
    </Tag>
  );
}

/*
 * Every section opens the same way: a small eyebrow, a headline, an optional short intro, centred,
 * so the page reads as one composed sequence rather than a scatter of layouts.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "center",
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: ReactNode[];
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "left";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-paper/65" : "text-mute";
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <Reveal as="p" className={`flex items-center gap-3 text-[0.95rem] ${muted} ${center ? "justify-center" : ""}`}>
        <span aria-hidden className={`h-px w-8 ${tone === "dark" ? "bg-paper/35" : "bg-ink/25"}`} />
        {eyebrow}
        {center && <span aria-hidden className={`h-px w-8 ${tone === "dark" ? "bg-paper/35" : "bg-ink/25"}`} />}
      </Reveal>
      <Lines id={id} className="serif mt-5 t-section leading-[1.04]" lines={title} />
      {intro && (
        <Reveal delay={150} as="p" className={`mt-5 text-[1.08rem] leading-relaxed ${muted} ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {intro}
        </Reveal>
      )}
    </div>
  );
}

export function MediaBadge({ kind, className = "" }: { kind: "photo" | "render" | "plan"; className?: string }) {
  if (kind === "photo") return null;
  return (
    <span
      className={`absolute left-3 top-3 z-10 rounded-md bg-forest-deep/60 px-2 py-1 text-[0.72rem] font-medium text-paper backdrop-blur-sm ${className}`}
    >
      {kind === "render" ? "Artist’s impression" : "Plan"}
    </span>
  );
}

/*
 * Long registration numbers wrap only at their slashes, never mid-number. <wbr> marks the break
 * points without adding characters, so a copied RERA number pastes cleanly into a search.
 */
export function SlashBreaks({ text }: { text: string }) {
  const parts = text.split("/");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <>
              /<wbr />
            </>
          )}
        </span>
      ))}
    </>
  );
}
