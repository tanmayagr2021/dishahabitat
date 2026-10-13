import Image from "next/image";
import Link from "next/link";
import { portfolio } from "@/lib/portfolio";

/*
 * A slow, endless band of every Disha community: photograph, name, place, year. It pauses under
 * the pointer or keyboard focus, and stands still for reduced motion. The second copy is hidden
 * from assistive technology.
 */
export function Marquee() {
  const items = portfolio;
  const row = (copy: number) =>
    items.map((p) => (
      <li key={`${copy}-${p.slug}`} className="shrink-0 pr-4 md:pr-5" aria-hidden={copy === 1 || undefined}>
        <Link
          href={p.href}
          tabIndex={copy === 1 ? -1 : undefined}
          data-cursor="View"
          className="group flex items-center gap-4 rounded-full border border-paper/12 bg-paper/[0.04] py-2 pl-2 pr-6 transition-colors hover:border-paper/40 hover:bg-paper/[0.08]"
        >
          <span className="relative block size-14 overflow-hidden rounded-full md:size-16">
            <Image src={p.image.src} alt="" fill sizes="64px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </span>
          <span>
            <span className="serif block text-[1.5rem] leading-none md:text-[1.8rem]">{p.shortName}</span>
            <span className="mt-1 flex items-center gap-2 text-sm text-paper/60">
              <span aria-hidden className="size-1.5 rounded-full" style={{ background: p.hue }} />
              {p.status === "Now selling" ? "Now selling" : `Delivered ${p.handoverYear}`} · {p.locality.replace(", Bengaluru", "").replace(", East Bengaluru", "")}
            </span>
          </span>
        </Link>
      </li>
    ));

  return (
    <section aria-label="Every Disha community" data-tone="dark" className="layer surface-deep marquee py-10 md:py-12">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="marquee-track flex w-max">
          {row(0)}
          {row(1)}
        </ul>
      </div>
    </section>
  );
}
