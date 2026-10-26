import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand, PageIntro, Section } from "@/components/ds";
import { checklist, getChecklistItem } from "@/lib/checklist";
import { links } from "@/lib/content";
import { pageMeta } from "@/lib/launch";
import s from "./page.module.css";

export function generateStaticParams() {
  return checklist.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/checklist/[slug]">): Promise<Metadata> {
  const c = getChecklistItem((await params).slug);
  return c ? pageMeta({ title: `${c.title} | The checklist`, description: `${c.title}: ${c.summary.toLowerCase()}. A plain guide from Disha Habitat’s homebuyer checklist.`, path: `/checklist/${c.slug}` }) : {};
}

export default async function ChecklistItemPage({ params }: PageProps<"/checklist/[slug]">) {
  const c = getChecklistItem((await params).slug);
  if (!c) notFound();
  const i = checklist.indexOf(c);
  const prev = i > 0 ? checklist[i - 1] : null;
  const next = i < checklist.length - 1 ? checklist[i + 1] : null;

  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Checklist", href: "/checklist" }, { label: c.title }]} />}
        title={c.title}
        line={c.summary}
      >
        <p className={s.step}>
          Must-know {i + 1} of {checklist.length}
        </p>
      </PageIntro>

      <Section width="measure" space="tight">
        <div className={s.photo}>
          <Image src={c.image} alt="" fill sizes="(min-width: 768px) 42rem, 100vw" priority />
        </div>
        <div className={s.body}>
          {c.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        {c.checks && (
          <div className={s.checks}>
            <h2>Before you buy, check</h2>
            <ul>
              {c.checks.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        <nav className={s.pager} aria-label="More must-knows">
          {prev ? (
            <Link href={`/checklist/${prev.slug}`} rel="prev">
              <span>Previous</span>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/checklist/${next.slug}`} rel="next" data-end="true">
              <span>Next</span>
              {next.title}
            </Link>
          ) : (
            <Link href="/checklist" data-end="true">
              <span>Done reading</span>
              Back to your checklist
            </Link>
          )}
        </nav>
        <p className={s.back}>
          <Link href="/checklist" className="text-link">
            Back to your checklist
          </Link>
        </p>
      </Section>

      <CtaBand title="Have a question about this for a Disha home?" line="Ask us. We’ll explain it as plainly as you need." actions={[{ label: "Book a visit", href: links.bookVisit }]} />
    </>
  );
}
