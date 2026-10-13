import { Lines, Reveal } from "@/components/ui";
import { HomesBuilt } from "@/components/home/HomesBuilt";
import { formatIndian } from "@/lib/site";
import { delivered, homesHandedOver } from "@/lib/proof";

/*
 * The answer to a Bengaluru buyer's biggest fear, delay (docs/RESEARCH-BRIEF.md): every community
 * Disha started, with its published start and handover, and every home drawn as a block.
 */
export function RecordSection() {
  return (
    <section id="record" data-tone="light" aria-labelledby="record-title" className="layer surface-stone py-16 md:py-24">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="p" className="eyebrow text-mute">
              Our record
            </Reveal>
            <Lines id="record-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["Every community we started,", <em key="e">we finished.</em>]} />
          </div>
          <Reveal delay={150} as="p" className="max-w-md leading-relaxed text-ink/75 lg:col-span-4 lg:col-start-9">
            Delays are the biggest worry for anyone buying a home in Bengaluru. So here is ours, in full: {delivered.length} communities, {formatIndian(homesHandedOver)} homes, and the month each one started and was handed over.
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-10 overflow-x-auto rounded-2xl ring-1 ring-ink/10">
          <table className="w-full min-w-[36rem] border-collapse bg-white/50 text-left text-[0.95rem]">
            <caption className="sr-only">Every Disha Habitat community: homes, construction start and handover</caption>
            <thead>
              <tr className="text-sm text-mute">
                <th scope="col" className="px-5 py-3 font-medium">Community</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Homes</th>
                <th scope="col" className="px-5 py-3 font-medium">Construction began</th>
                <th scope="col" className="px-5 py-3 font-medium">Keys handed over</th>
              </tr>
            </thead>
            <tbody>
              {delivered.map((d) => (
                <tr key={d.slug} className="border-t border-ink/10">
                  <th scope="row" className="px-5 py-3.5 font-semibold">
                    <span className="mr-2.5 inline-block size-2.5 rounded-full align-middle" style={{ background: d.hue }} aria-hidden />
                    {d.name}
                  </th>
                  <td className="px-5 py-3.5 text-right tabular-nums">{d.homes}</td>
                  <td className="px-5 py-3.5 tabular-nums text-ink/75">{d.start}</td>
                  <td className="px-5 py-3.5 tabular-nums">{d.handover}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <HomesBuilt />
      </div>
    </section>
  );
}
