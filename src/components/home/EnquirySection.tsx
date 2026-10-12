import { EnquiryForm } from "@/components/EnquiryForm";
import { Eyebrow, Reveal } from "@/components/ui";
import { company, poem } from "@/lib/site";

export function EnquirySection({ defaultInterest }: { defaultInterest?: string }) {
  return (
    <section
      id="enquire"
      data-tone="dark"
      aria-labelledby="enquire-title"
      className="relative overflow-hidden bg-olive-deep text-paper"
    >
      <div className="shell relative grid gap-16 py-24 md:py-32 lg:grid-cols-12 lg:gap-8 lg:py-40">
        <Reveal className="lg:col-span-5">
          <Eyebrow className="text-paper/60">Enquire</Eyebrow>
          <p aria-hidden className="display mt-8 text-[1.5rem] italic leading-snug text-paper/55 sm:text-[1.75rem]">
            {poem.opening.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block">…</span>
          </p>
          <h2 id="enquire-title" className="display mt-6 text-[2.9rem] leading-[1] sm:text-[3.8rem] xl:text-[4.6rem]">
            {poem.closing.replace(/home\.$/, "")}
            <em>home.</em>
          </h2>
          <p className="mt-8 max-w-sm leading-relaxed text-paper/75">
            Tell us a little about what you are looking for. And if it isn’t time for that big step yet, you may find
            glimpses of your future home.
          </p>

          <dl className="mt-12 grid gap-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-paper/50">Call</dt>
              <dd className="mt-2 space-y-1">
                {company.phones.map((p) => (
                  <a key={p.href} href={p.href} className="block min-h-8 text-paper/90 hover:text-paper">
                    {p.display}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/50">Write</dt>
              <dd className="mt-2">
                <a href={`mailto:${company.email}`} className="text-paper/90 hover:text-paper">
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-6 lg:col-start-7">
          <div className="border border-paper/15 bg-olive-deep/60 p-6 backdrop-blur-sm sm:p-10">
            <EnquiryForm tone="dark" defaultInterest={defaultInterest} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
