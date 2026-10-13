import Image from "next/image";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Label, Lines, Reveal } from "@/components/ui";
import { company, homemakers } from "@/lib/site";

export function EnquirySection({ defaultInterest, n = "09" }: { defaultInterest?: string; n?: string }) {
  const guna = homemakers[0];
  return (
    <section
      id="enquire"
      data-tone="dark"
      aria-labelledby="enquire-title"
      className="surface-forest relative isolate overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="parallax absolute inset-0">
          <Image
            src="/images/central-park/clubhouse-night.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[60%_50%]"
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-forest-deep/60" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest-deep/20" />
      </div>

      <div className="shell pointer-events-none relative grid gap-16 py-28 md:py-40 lg:grid-cols-12 lg:gap-8 [&>*]:pointer-events-auto">
        <div className="flex flex-col justify-between gap-12 lg:col-span-6">
          <div>
            <Label n={n} className="text-paper/60">
              Visit us
            </Label>
            <Lines
              id="enquire-title"
              className="serif mt-8 text-[clamp(2.5rem,4.8vw,4.8rem)] leading-[0.9]"
              lines={["“Let’s meet", <em key="c">for coffee.”</em>]}
            />
            <Reveal delay={200} className="mt-8 max-w-md">
              <p className="text-[1.05rem] leading-relaxed text-paper/75">
                It’s our founder’s favourite invitation. It means he wants to explain something properly, until you
                leave as informed as any engineer, architect or site supervisor on the project.
              </p>
              <p className="label mt-5 text-paper/55">
                {guna.name} · {guna.role}
              </p>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <dl className="grid max-w-md gap-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="label text-paper/50">Call</dt>
                <dd className="mt-2 space-y-1">
                  {company.phones.map((p) => (
                    <a key={p.href} href={p.href} className="block py-0.5 text-[1.1rem] text-paper transition-colors hover:text-cyan">
                      {p.display}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label text-paper/50">Write</dt>
                <dd className="mt-2">
                  <a href={`mailto:${company.email}`} className="text-[1.1rem] text-paper transition-colors hover:text-cyan">
                    {company.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
          <div className="card-dark relative p-6 text-paper sm:p-10">
            <p className="serif text-[2.4rem] leading-none">Book a site visit</p>
            <p className="mb-8 mt-2 text-sm text-paper/65">Tell us a little about what you’re looking for and we’ll call you back. Fields marked * are required.</p>
            <EnquiryForm defaultInterest={defaultInterest} tone="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
