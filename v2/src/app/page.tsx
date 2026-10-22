import { Closing } from "@/components/Closing";
import { SiteNav } from "@/components/SiteNav";
import { Thresholds } from "@/components/Thresholds";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Thresholds />
      </main>
      <Closing />
    </>
  );
}
