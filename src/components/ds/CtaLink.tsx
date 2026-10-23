import Link from "next/link";
import type { ReactNode } from "react";

export type Cta = { label: string; href: string };

/* A button or link that moves within the site without a page load, and opens anything else as a plain link. */
export function CtaLink({ href, className, children, label }: { href: string; className?: string; children?: ReactNode; label?: string }) {
  const body = children ?? label;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {body}
    </a>
  );
}
