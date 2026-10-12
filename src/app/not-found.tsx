import { ArrowLink, ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section
      data-tone="dark"
      className="topo grain relative flex min-h-[100svh] items-center bg-forest-900 pb-24 pt-36 text-ivory [--topo-opacity:0.4]"
    >
      <div className="shell">
        <p className="eyebrow text-brass-light">Page not found</p>
        <h1 className="display mt-6 text-[3.6rem] sm:text-[6rem] xl:text-[7.5rem]">
          This path doesn’t
          <br />
          <em className="text-brass-light">lead home.</em>
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
          The page you were looking for has moved or never existed. Let us take you somewhere familiar.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ArrowLink href="/homes" className="text-ivory">
            Explore our homes
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
