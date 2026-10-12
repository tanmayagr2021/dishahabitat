import { Hero } from "@/components/home/Hero";
import { NowSelling } from "@/components/home/NowSelling";
import { Manifesto } from "@/components/home/Manifesto";
import { Collection } from "@/components/home/Collection";
import { HomesField } from "@/components/home/HomesField";
import { Journeys } from "@/components/home/Journeys";
import { BlackWhite } from "@/components/home/BlackWhite";
import { PlanTeaser } from "@/components/home/PlanTeaser";
import { EnquirySection } from "@/components/home/EnquirySection";

/*
 * Order answers a first-time visitor's questions in turn: who is this and what do they build
 * (hero) → what can I buy now (01) → who are they (02) → what have they delivered (03, 04)
 * → what do owners say (05) → what do they stand for (06) → can I afford it (07) → how do I visit (08).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <NowSelling />
      <Manifesto />
      <Collection />
      <HomesField />
      <Journeys />
      <BlackWhite />
      <PlanTeaser />
      <EnquirySection />
    </>
  );
}
