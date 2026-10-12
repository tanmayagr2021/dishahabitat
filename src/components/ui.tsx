import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type LinkProps = ComponentProps<typeof Link>;

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300";

const buttonVariants = {
  solid: "bg-ink text-paper hover:bg-olive-deep",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  light: "bg-paper text-ink hover:bg-linen",
  outlineLight: "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
} as const;

export function ButtonLink({
  variant = "solid",
  className = "",
  children,
  ...props
}: LinkProps & { variant?: keyof typeof buttonVariants }) {
  return (
    <Link className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props}>
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={1.5}
      />
    </Link>
  );
}

export function buttonClass(variant: keyof typeof buttonVariants = "solid", className = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${className}`;
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
      className={`group inline-flex min-h-11 items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
        {children}
      </span>
      <Icon
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
      {index && <span className="tabular-nums opacity-60">{index}</span>}
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}

/* Wrapper that fades/rises its content into view (see RevealObserver). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "figure" | "section" | "article";
}) {
  return (
    <Tag data-reveal className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

export function MediaBadge({ kind }: { kind: "photo" | "render" | "plan" }) {
  if (kind === "photo") return null;
  return (
    <span className="absolute left-3 top-3 z-10 bg-ink/75 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-paper backdrop-blur-sm">
      {kind === "render" ? "Artist’s impression" : "Plan"}
    </span>
  );
}
