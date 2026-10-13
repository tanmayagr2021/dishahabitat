import { Hero } from "@/components/home/Hero";
import { Approach } from "@/components/home/Approach";
import { Marquee } from "@/components/home/Marquee";
import { Developments } from "@/components/home/Developments";
import { WhyDisha } from "@/components/home/WhyDisha";
import { DayAtDisha } from "@/components/home/DayAtDisha";
import { PlanSection } from "@/components/home/PlanSection";
import { HomeownersSpeak } from "@/components/home/HomeownersSpeak";
import { CtaBand } from "@/components/home/CtaBand";

/*
 * The home page: the buildings → our approach and record → every community, moving → our
 * developments → why Disha → a day there → plan your home → homeowners → begin your journey.
 * Each section slides over the one before it (.layer).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Approach />
      <Marquee />
      <Developments />
      <WhyDisha />
      <DayAtDisha />
      <PlanSection />
      <HomeownersSpeak />
      <CtaBand />
    </>
  );
}
