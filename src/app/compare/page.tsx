import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs, PageIntro } from "@/components/ds";
import { pageMeta } from "@/lib/launch";
import { CompareTool } from "./CompareTool";
import { communities, defaults, rowOrder } from "./data";
import s from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: "Compare our communities",
  description: "Pick up to three Disha Habitat communities and see land, homes, towers and handover side by side.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Compare communities" }]} />}
        title="Compare our communities"
        line="Choose up to three and read them side by side. Share the link to share the comparison."
      />
      <div className={s.wrap}>
        <Suspense fallback={<CompareTool communities={communities} rows={rowOrder} initial={defaults} />}>
          <CompareTool communities={communities} rows={rowOrder} initial={defaults} fromUrl />
        </Suspense>
      </div>
    </>
  );
}
