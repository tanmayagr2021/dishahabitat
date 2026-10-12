import { ButtonLink, ArrowLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pb-24 pt-36">
      <div className="shell">
        <p className="eyebrow text-ink-mute">Page not found</p>
        <h1 className="display mt-6 text-[3.4rem] sm:text-[5.5rem]">
          This path doesn’t <em className="text-olive">lead home</em>.
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
          The page you were looking for has moved or never existed. Let us take you somewhere familiar.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ArrowLink href="/homes" className="text-ink">
            Explore our homes
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
