import type { CSSProperties, ReactNode } from "react";
import { Eyebrow } from "@/components/ui";

/* Shared editorial opening for inner pages. */
export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="pb-14 pt-32 md:pb-20 md:pt-40 lg:pt-44">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-8">
          <Eyebrow className="hero-rise text-ink-mute">{eyebrow}</Eyebrow>
          <h1
            className="display hero-rise mt-7 text-[3.2rem] min-[400px]:text-[3.6rem] sm:text-[5rem] xl:text-[6.6rem]"
            style={{ "--d": "120ms" } as CSSProperties}
          >
            {title}
          </h1>
        </div>
        {(children || aside) && (
          <div className="hero-rise lg:col-span-4" style={{ "--d": "260ms" } as CSSProperties}>
            {children && <div className="max-w-md leading-relaxed text-ink-soft">{children}</div>}
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
