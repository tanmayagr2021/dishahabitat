import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type LinkProps = ComponentProps<typeof Link>;

const buttonBase =
  "group relative inline-flex min-h-13 items-center justify-center gap-3 overflow-hidden px-7 text-[0.74rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500";

/* Each variant fills with a contrasting wash on hover, sliding up from the baseline. */
const buttonVariants = {
  brass: "bg-brass text-ink hover:text-ink [--wash:var(--color-brass-light)]",
  ink: "bg-ink text-ivory hover:text-ivory [--wash:var(--color-forest-700)]",
  light: "border border-ivory/35 text-ivory hover:text-ink [--wash:var(--color-ivory)]",
  dark: "border border-ink/30 text-ink hover:text-ivory [--wash:var(--color-ink)]",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant = "brass", className = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${className}`;
}

function Wash() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 -z-0 translate-y-full bg-[var(--wash)] transition-transform duration-500 ease-out-soft group-hover:translate-y-0"
    />
  );
}

export function ButtonLink({
  variant = "brass",
  className = "",
  children,
  icon = true,
  ...props
}: LinkProps & { variant?: ButtonVariant; icon?: boolean }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      <Wash />
      <span className="relative">{children}</span>
      {icon && (
        <ArrowRight
          aria-hidden
          className="relative size-4 transition-transform duration-500 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      )}
    </Link>
  );
}

export function ButtonInner({ children, icon = true }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      <Wash />
      <span className="relative">{children}</span>
      {icon && (
        <ArrowRight
          aria-hidden
          className="relative size-4 transition-transform duration-500 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      )}
    </>
  );
}

/* Understated text link with an animated underline. */
export function ArrowLink({
  className = "",
  children,
  external = false,
  ...props
}: LinkProps & { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      className={`group inline-flex min-h-11 items-center gap-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.2em] ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px] group-hover:bg-right-bottom">
        {children}
      </span>
      <Icon
        aria-hidden
        className="size-4 transition-transform duration-500 group-hover:translate-x-1"
        strokeWidth={1.5}
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </Link>
  );
}

export function Eyebrow({
  children,
  className = "",
  index,
}: {
  children: ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {index && <span className="tabular-nums text-brass">{index}</span>}
      <span aria-hidden className="tick" />
      <span>{children}</span>
    </p>
  );
}

/* Fades/rises its content into view (see RevealObserver). `image` lifts a curtain instead. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "image";
  as?: "div" | "li" | "figure" | "section" | "article";
}) {
  return (
    <Tag
      data-reveal={variant ?? ""}
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function MediaBadge({ kind, className = "" }: { kind: "photo" | "render" | "plan"; className?: string }) {
  if (kind === "photo") return null;
  return (
    <span
      className={`absolute left-3 top-3 z-10 bg-ink/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur-sm ${className}`}
    >
      {kind === "render" ? "Artist’s impression" : "Plan"}
    </span>
  );
}

/* Section number + label used to pace the page (e.g. "02 — Signature homes"). */
export function SectionMark({ n, label, tone = "light" }: { n: string; label: string; tone?: "light" | "dark" }) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${tone === "dark" ? "text-ivory/60" : "text-ink-mute"}`}>
      <span
        className={`font-display text-[1.05rem] font-medium italic tracking-normal normal-case ${tone === "dark" ? "text-brass-light" : "text-brass-deep"}`}
      >
        {n}
      </span>
      <span aria-hidden className="tick" />
      <span>{label}</span>
    </p>
  );
}
