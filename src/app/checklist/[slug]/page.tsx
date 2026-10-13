import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ComposeButton } from "@/components/ComposeButton";
import { Reveal } from "@/components/ui";
import { checklist, getChecklistItem } from "@/lib/checklist";

export function generateStaticParams() {
  return checklist.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/checklist/[slug]">): Promise<Metadata> {
  const c = getChecklistItem((await params).slug);
  return c ? { title: `${c.title} | The checklist`, description: c.body[0] } : {};
}

export default async function ChecklistItemPage({ params }: PageProps<"/checklist/[slug]">) {
  const c = getChecklistItem((await params).slug);
  if (!c) notFound();
  const i = checklist.indexOf(c);
  const next = checklist[(i + 1) % checklist.length];
  const others = checklist.filter((x) => x.slug !== c.slug);

  return (
    <>
      <section data-tone="dark" aria-labelledby="item-title" className="surface-deep grain relative overflow-hidden pb-14 pt-36 md:pb-16 md:pt-44">
        <Image src={c.image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/60 via-forest-deep/80 to-forest-deep" />
        <div className="shell max-w-4xl">
          <Link href="/checklist" className="inline-flex items-center gap-2 text-sm text-paper/70 hover:text-paper">
            <ArrowLeft aria-hidden className="size-4" /> The checklist · {i + 1} of {checklist.length}
          </Link>
          <h1 id="item-title" className="serif anim-rise mt-5 text-[clamp(2.8rem,6vw,5rem)] leading-[1.02]">
            {c.title}
          </h1>
          <p className="anim-fade-up mt-4 text-[1.15rem] text-paper/80">{c.summary}</p>
        </div>
      </section>

      <section data-tone="light" className="layer surface-ivory py-14 md:py-20">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </div>
            <div className="mt-10 space-y-6 text-[1.12rem] leading-[1.75] text-ink/85">
              {c.body.map((para, k) => (
                <Reveal as="p" key={k} delay={k * 60}>
                  {para}
                </Reveal>
              ))}
            </div>
            <Link href={`/checklist/${next.slug}`} className="group card mt-12 flex items-center justify-between gap-4 p-5">
              <span>
                <span className="text-sm text-mute">Next must-know</span>
                <span className="serif mt-1 block text-[1.5rem]">{next.title}</span>
              </span>
              <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </article>

          <aside className="space-y-6 lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28 lg:space-y-6">
              <div className="rounded-2xl bg-forest p-6 text-paper">
                <p className="serif text-[1.5rem] leading-tight">Questions about {c.title.toLowerCase()} for a Disha home?</p>
                <p className="mt-2 text-sm text-paper/75">Ask us. We’ll explain it as plainly as you need.</p>
                <ComposeButton channel="whatsapp" topic="Something else" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-paper font-semibold text-ink hover:bg-white">
                  Ask on WhatsApp
                </ComposeButton>
                <Link href="/contact#book" className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg border border-paper/30 font-medium hover:border-paper/60">
                  Book a site visit
                </Link>
              </div>
              <nav aria-label="The checklist" className="card p-5">
                <p className="text-sm text-mute">The checklist</p>
                <ul className="mt-3 space-y-1">
                  {checklist.map((x, k) => (
                    <li key={x.slug}>
                      <Link
                        href={`/checklist/${x.slug}`}
                        aria-current={x.slug === c.slug ? "page" : undefined}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-[0.98rem] hover:bg-ink/5 aria-[current=page]:bg-ink aria-[current=page]:text-paper"
                      >
                        <span className="inline-flex size-6 items-center justify-center rounded-full border border-current/25 text-xs tabular-nums">{k + 1}</span>
                        {x.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="sr-only">{others.length} other guides</p>
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
