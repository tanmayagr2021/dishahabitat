import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Collection } from "@/components/home/Collection";
import { HomesField } from "@/components/home/HomesField";
import { DayInTheSun } from "@/components/home/DayInTheSun";
import { Journeys } from "@/components/home/Journeys";
import { BlackWhite } from "@/components/home/BlackWhite";
import { PlanTeaser } from "@/components/home/PlanTeaser";
import { EnquirySection } from "@/components/home/EnquirySection";

/*
 * Ink and paper alternate to set the rhythm; colour arrives only through the homes:
 * hero (ink) → where we began (paper) → the collection (ink) → a day in the sun (paper into
 * night) → every dot is a home (ink, continuing the night) → homeowners (paper) → our core (ink)
 * → plan (paper) → let's meet for coffee (film).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Collection />
      <DayInTheSun />
      <HomesField />
      <Journeys />
      <BlackWhite />
      <PlanTeaser />
      <EnquirySection />
    </>
  );
}
