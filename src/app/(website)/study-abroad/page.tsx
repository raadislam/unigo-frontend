import type { Metadata } from "next";
import { LandingPage } from "@/components/shared/landing-page";

export const metadata: Metadata = {
  title: "Study Abroad Consultancy in Bangladesh",
  description:
    "Explore study abroad opportunities with UniGo Bangladesh. Get guidance on international universities, course selection, admission requirements and student visa applications.",
  alternates: {
    canonical: "/study-abroad/",
  },
  openGraph: {
    title: "Study Abroad Consultancy in Bangladesh | UniGo",
    description:
      "Discover international universities, study destinations and admission pathways with UniGo Bangladesh.",
    url: "https://unigo-bd.com/study-abroad/",
    type: "website",
  },
};

export default function StudyAbroadPage() {
  return (
    <LandingPage
      eyebrow="Study abroad"
      title="Study Abroad Opportunities for Your Global Future"
      description="Explore international universities, compare study destinations, understand admission requirements and get professional guidance throughout your study abroad journey with UniGo Bangladesh."
    />
  );
}
