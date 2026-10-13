import { Hero } from "@/components/home/Hero";
import { BuyerNeeds } from "@/components/home/BuyerNeeds";
import { Developments } from "@/components/home/Developments";
import { Marquee } from "@/components/home/Marquee";
import { RecordSection } from "@/components/home/RecordSection";
import { DayAtDisha } from "@/components/home/DayAtDisha";
import { HomeownersSpeak } from "@/components/home/HomeownersSpeak";
import { CtaBand } from "@/components/home/CtaBand";

/*
 * The home page follows the buyer's questions, not the company's org chart
 * (docs/RESEARCH-BRIEF.md): who are you and why should I care (hero, with proof in view) →
 * what I'm looking for, answered (BuyerNeeds) → what can I buy (Developments) → will you deliver
 * (RecordSection) → what is life like there (DayAtDisha, HomeownersSpeak) → meet the people (CtaBand).
 * Each section slides over the one before it (.layer).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BuyerNeeds />
      <Developments />
      <Marquee />
      <RecordSection />
      <DayAtDisha />
      <HomeownersSpeak />
      <CtaBand />
    </>
  );
}
