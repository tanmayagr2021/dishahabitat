import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { FeaturedHomes } from "@/components/home/FeaturedHomes";
import { StorySection } from "@/components/home/StorySection";
import { LifeGallery } from "@/components/home/LifeGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { Differentiators } from "@/components/home/Differentiators";
import { EnquirySection } from "@/components/home/EnquirySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedHomes />
      <StorySection />
      <LifeGallery />
      <Testimonials />
      <Differentiators />
      <EnquirySection />
    </>
  );
}
