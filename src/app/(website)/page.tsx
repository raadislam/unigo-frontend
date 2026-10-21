import { HeroSection } from "@/components/home/hero-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { ServicesSection } from "@/components/home/services-section";
import { WhyUnigoSection } from "@/components/home/why-unigo-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { DestinationShowcase } from "@/components/home/destination-showcase";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinationShowcase />
      <DestinationsSection />
      <ServicesSection />
      <WhyUnigoSection />
      <TestimonialsSection />
    </>
  );
}
