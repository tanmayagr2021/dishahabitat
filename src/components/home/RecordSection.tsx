import { Lines, Reveal } from "@/components/ui";
import { HomesBuilt } from "@/components/home/HomesBuilt";
import { formatIndian } from "@/lib/site";
import { delivered, homesHandedOver } from "@/lib/proof";

/*
 * The answer to a Bengaluru buyer's biggest fear, delay (docs/RESEARCH-BRIEF.md): every community
 * Disha started, with its published start and handover, and every home drawn as a block.
 */
/* "September 2015" → "Sep 2015", for the narrow phone table. */
const short = (s: string) => s.replace(/^(\w{3})\w*/, "$1");

export function RecordSection() {
  return (
    <section id="record" data-tone="light" aria-labelledby="record-title" className="layer surface-stone py-16 md:py-24">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="p" className="eyebrow text-mute">
              Our record
            </Reveal>
            <Lines id="record-title" className="serif mt-5 t-section leading-[1.04]" lines={["Every community we started,", <em key="e">we finished.</em>]} />
          </div>
          <Reveal delay={150} as="p" className="max-w-md leading-relaxed text-ink/75 lg:col-span-4 lg:col-start-9">
            Delays are the biggest worry for anyone buying a home in Bengaluru. So here is ours, in full: {delivered.length} communities, {formatIndian(homesHandedOver)} homes, and the month each one started and was handed over.
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-10 overflow-hidden rounded-2xl ring-1 ring-ink/10">
          <div role="region" aria-label="Delivery record, scrolls sideways on small screens" tabIndex={0} className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-forest">
          <table className="w-full border-collapse bg-white/50 text-left text-[0.9rem] sm:text-[0.95rem]">
            <caption className="sr-only">Every Disha Habitat community: homes, construction start and handover</caption>
            <thead>
              <tr className="text-sm text-mute">
                <th scope="col" className="px-3 py-3 font-medium sm:px-5">Community</th>
                <th scope="col" className="px-3 py-3 text-right font-medium sm:px-5">Homes</th>
                <th scope="col" className="px-3 py-3 font-medium sm:px-5"><span className="sm:hidden">Began</span><span className="hidden sm:inline">Construction began</span></th>
                <th scope="col" className="px-3 py-3 font-medium sm:px-5"><span className="sm:hidden">Keys</span><span className="hidden sm:inline">Keys handed over</span></th>
              </tr>
            </thead>
            <tbody>
              {delivered.map((d) => (
                <tr key={d.slug} className="border-t border-ink/10">
                  <th scope="row" className="px-3 py-3.5 font-semibold sm:px-5">
                    <span className="mr-2 inline-block size-2.5 rounded-full align-middle sm:mr-2.5" style={{ background: d.hue }} aria-hidden />
                    {d.name}
                  </th>
                  <td className="px-3 py-3.5 text-right tabular-nums sm:px-5">{d.homes}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 tabular-nums text-ink/75 sm:px-5"><span className="sm:hidden">{short(d.start)}</span><span className="hidden sm:inline">{d.start}</span></td>
                  <td className="whitespace-nowrap px-3 py-3.5 tabular-nums sm:px-5"><span className="sm:hidden">{short(d.handover)}</span><span className="hidden sm:inline">{d.handover}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Reveal>

        <HomesBuilt />
      </div>
    </section>
  );
}
