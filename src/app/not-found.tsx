import { ArrowLink, ButtonLink, Label } from "@/components/ui";

export default function NotFound() {
  return (
    <section
      data-tone="dark"
      className="surface-deep grain relative flex min-h-[100svh] items-end pb-20 pt-36 md:pb-28"
    >
      <div className="shell">
        <Label className="text-paper/60">Page not found</Label>
        <h1 className="serif mt-6 text-[clamp(2.5rem,4.8vw,4.8rem)] leading-[0.95]">
          This path doesn’t <em className="text-paper/55">lead home.</em>
        </h1>
        <div className="mt-12 flex flex-col gap-6 border-t border-paper/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md leading-relaxed text-paper/70">
            The page you were looking for has moved or never existed. Let us take you somewhere familiar.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <ArrowLink href="/homes" className="text-paper">
              Explore our homes
            </ArrowLink>
            <ButtonLink href="/" variant="paper">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
