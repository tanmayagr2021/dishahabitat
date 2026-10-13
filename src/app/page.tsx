import { Hero } from "@/components/home/Hero";
import { Approach } from "@/components/home/Approach";
import { Developments } from "@/components/home/Developments";
import { PlanSection } from "@/components/home/PlanSection";
import { WhyDisha } from "@/components/home/WhyDisha";
import { DayAtDisha } from "@/components/home/DayAtDisha";
import { HomeownersSpeak } from "@/components/home/HomeownersSpeak";
import { CtaBand } from "@/components/home/CtaBand";

/*
 * The home page (the logo film plays from the layout when someone arrives at the site):
 * the buildings → our approach and record → our developments → plan your home → why Disha →
 * spaces that bring people closer → homeowners speak → begin your journey.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Approach />
      <Developments />
      <PlanSection />
      <WhyDisha />
      <DayAtDisha />
      <HomeownersSpeak />
      <CtaBand />
    </>
  );
}
