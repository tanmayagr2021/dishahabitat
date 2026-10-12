import { Intro } from "@/components/Intro";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Featured } from "@/components/home/Featured";
import { Delivered } from "@/components/home/Delivered";
import { WhyDisha } from "@/components/home/WhyDisha";
import { DayAtDisha } from "@/components/home/DayAtDisha";
import { Journeys } from "@/components/home/Journeys";
import { PlanSection } from "@/components/home/PlanSection";
import { EnquirySection } from "@/components/home/EnquirySection";

/*
 * The home page, in the order a buyer's questions arrive: who builds this (the buildings,
 * full screen) → can I trust them (the record) → what can I buy now → what have they built →
 * why them → what is life there like → who lives there → can I afford it → let's meet.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <TrustStrip />
      <Featured />
      <Delivered />
      <WhyDisha />
      <DayAtDisha />
      <Journeys />
      <PlanSection />
      <EnquirySection />
    </>
  );
}
