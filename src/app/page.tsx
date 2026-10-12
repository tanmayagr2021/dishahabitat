import { Intro } from "@/components/Intro";
import { Hero } from "@/components/home/Hero";
import { Featured } from "@/components/home/Featured";
import { Origins } from "@/components/home/Origins";
import { HomesField } from "@/components/home/HomesField";
import { Delivered } from "@/components/home/Delivered";
import { LifeEssay } from "@/components/home/LifeEssay";
import { Journeys } from "@/components/home/Journeys";
import { PlanSection } from "@/components/home/PlanSection";
import { ProjectExplorer } from "@/components/home/ProjectExplorer";
import { EnquirySection } from "@/components/home/EnquirySection";

/*
 * The home page, in sequence: the logo film hands over to the brand film; the community on sale;
 * where Disha began and what it promises; the record; the delivered communities; life between
 * the buildings; homeowners' journeys; the affordability explorer; the project explorer; a visit.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <Featured />
      <Origins />
      <HomesField />
      <Delivered />
      <LifeEssay />
      <Journeys />
      <PlanSection />
      <ProjectExplorer />
      <EnquirySection />
    </>
  );
}
