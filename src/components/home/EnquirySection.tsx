import { AmbientFilm } from "@/components/AmbientFilm";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal, SectionMark } from "@/components/ui";
import { company, poem } from "@/lib/site";

export function EnquirySection({ defaultInterest, mark = "09" }: { defaultInterest?: string; mark?: string }) {
  return (
    <section
      id="enquire"
      data-tone="dark"
      aria-labelledby="enquire-title"
      className="grain relative isolate overflow-hidden bg-forest-950 text-ivory"
    >
      <div className="absolute inset-0 -z-10">
        <AmbientFilm label="Brand film: gardens, sports courts and residents at home in Disha Habitat communities" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-forest-950/45" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/70 to-forest-950/10"
        />
      </div>

      <div className="shell pointer-events-none relative grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:gap-8 lg:py-44 [&>*]:pointer-events-auto">
        <Reveal className="lg:col-span-6">
          <SectionMark n={mark} label="Enquire" tone="dark" />
          <p aria-hidden className="display mt-10 text-[1.5rem] italic leading-snug text-ivory/55 sm:text-[1.9rem]">
            {poem.opening.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block">…</span>
          </p>
          <h2 id="enquire-title" className="display mt-6 text-[3.2rem] leading-[0.95] sm:text-[4.6rem] xl:text-[6rem]">
            {poem.closing.replace(/home\.$/, "")}
            <em className="text-brass-light">home.</em>
          </h2>
          <p className="mt-8 max-w-sm leading-relaxed text-ivory/75">
            Tell us a little about what you are looking for. And if it isn’t time for that big step yet, you may find
            glimpses of your future home.
          </p>
          <dl className="mt-12 grid max-w-md gap-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-ivory/50">Call</dt>
              <dd className="mt-2 space-y-1">
                {company.phones.map((p) => (
                  <a key={p.href} href={p.href} className="block py-0.5 text-ivory/90 hover:text-brass-light">
                    {p.display}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-ivory/50">Write</dt>
              <dd className="mt-2">
                <a href={`mailto:${company.email}`} className="text-ivory/90 hover:text-brass-light">
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
          <div className="border border-ivory/15 bg-forest-950/75 p-6 backdrop-blur-md sm:p-10">
            <EnquiryForm tone="dark" defaultInterest={defaultInterest} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
