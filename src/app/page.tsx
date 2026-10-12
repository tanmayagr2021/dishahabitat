import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Showcase } from "@/components/home/Showcase";
import { Philosophy } from "@/components/home/Philosophy";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { PlanSection } from "@/components/home/PlanSection";
import { StorySection } from "@/components/home/StorySection";
import { LifeGallery } from "@/components/home/LifeGallery";
import { EnquirySection } from "@/components/home/EnquirySection";

/* Rhythm: dark hero → ivory → ink → stone → forest → ivory → stone → ink → ivory → film → forest footer. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Showcase />
      <Philosophy />
      <Stats />
      <Testimonials />
      <PlanSection />
      <StorySection />
      <LifeGallery />
      <EnquirySection />
    </>
  );
}
