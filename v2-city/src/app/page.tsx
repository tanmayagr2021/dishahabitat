import { Atlas } from "@/components/Atlas";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Atlas />
      </main>
      <SiteFooter />
    </>
  );
}
