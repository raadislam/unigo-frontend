import { HeroSection } from "@/components/home/hero-section";
import { DestinationShowcase } from "@/components/home/destination-showcase";
import WhyChooseUs from "@/components/home/why-choose-us";
import OurServices from "@/components/home/our-services";
import StudentStories from "@/components/home/student-stories";
import GlobalFutureCTA from "@/components/home/global-future-cta";
import FAQSection from "@/components/home/faq-section";
import PartnerLogos from "@/components/home/partner-logos";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinationShowcase />
      <WhyChooseUs />
      <FAQSection />
      <OurServices />
      <StudentStories />
      <PartnerLogos />
      <GlobalFutureCTA />
    </>
  );
}
