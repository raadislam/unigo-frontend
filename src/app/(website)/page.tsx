import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { DestinationShowcase } from "@/components/home/destination-showcase";
import WhyChooseUs from "@/components/home/why-choose-us";
import OurServices from "@/components/home/our-services";
import StudentStories from "@/components/home/student-stories";
import GlobalFutureCTA from "@/components/home/global-future-cta";
import FAQSection from "@/components/home/faq-section";
import PartnerLogos from "@/components/home/partner-logos";
import { VisaDirectoryCta } from "@/components/home/visa-directory-cta";

export const metadata: Metadata = {
  title: "Study Abroad & Travel Consultancy in Bangladesh",
  description:
    "Plan your global journey with UniGo Bangladesh. Get guidance on international education, university admissions, visa applications and travel services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://unigo-bd.com/",
    siteName: "UniGo",
    title: "Study Abroad & Travel Consultancy in Bangladesh | UniGo",
    description:
      "Explore international education, university admission guidance, visa assistance and travel services with UniGo Bangladesh.",
    images: [
      {
        url: "/images/unigo-social-preview.png",
        width: 1200,
        height: 630,
        alt: "UniGo Bangladesh - Education and Travel Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Abroad & Travel Consultancy in Bangladesh | UniGo",
    description:
      "Explore international education, university admission guidance, visa assistance and travel services with UniGo Bangladesh.",
    images: ["/images/unigo-social-preview.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinationShowcase />
      <VisaDirectoryCta />
      <WhyChooseUs />
      <FAQSection />
      <OurServices />
      <StudentStories />
      <PartnerLogos />
      <GlobalFutureCTA />
    </>
  );
}
