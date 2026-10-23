import type { ReactNode } from "react";
import { ArrowRight } from "@/components/showroom/Icons";
import { type Cta, CtaLink } from "./CtaLink";
import s from "./Section.module.css";

type SectionProps = {
  id?: string;
  /* "surface" sets the section on the grey panel colour from edge to edge. */
  tone?: "white" | "surface";
  /* "tight" for a section that follows another closely; "none" when the content brings its own space. */
  space?: "normal" | "tight" | "none";
  /* "measure" keeps a column of reading text to a comfortable width. */
  width?: "page" | "measure" | "full";
  labelledBy?: string;
  label?: string;
  className?: string;
  children: ReactNode;
};

/* A band of the page: consistent space above and below, the page's side margin, and its widest width. */
export function Section({ id, tone = "white", space = "normal", width = "page", labelledBy, label, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`${s.section} ${className ?? ""}`}
      data-tone-bg={tone}
      data-space={space}
      data-width={width}
      aria-labelledby={labelledBy}
      aria-label={label}
    >
      <div className={s.inner}>{children}</div>
    </section>
  );
}

type HeadProps = {
  id?: string;
  title: ReactNode;
  line?: ReactNode;
  eyebrow?: string;
  link?: Cta;
  /* "large" for the first heading of a page section that leads a long run of content. */
  size?: "normal" | "large";
  as?: "h2" | "h3";
};

/* What a section is, in a few words: the title on the left, one line under it, its single link on the right. */
export function SectionHead({ id, title, line, eyebrow, link, size = "normal", as: H = "h2" }: HeadProps) {
  return (
    <div className={s.head}>
      <div className={s.headText}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <H id={id} className={`display ${s.title}`} data-size={size}>
          {title}
        </H>
        {line && <p className={s.line}>{line}</p>}
      </div>
      {link && (
        <CtaLink href={link.href} className="text-link">
          {link.label}
          <ArrowRight />
        </CtaLink>
      )}
    </div>
  );
}

/* The grey panel tesla.com uses for anything that is not a photograph. */
export function Panel({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "aside" | "article" }) {
  return <Tag className={`${s.panel} ${className ?? ""}`}>{children}</Tag>;
}
