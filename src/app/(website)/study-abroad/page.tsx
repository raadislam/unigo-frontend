import type { Metadata } from "next";
import { LandingPage } from "@/components/shared/landing-page";

export const metadata: Metadata = {
  title: "Study Abroad",
  description:
    "Explore international study destinations and education pathways with UniGo.",
};

export default function StudyAbroadPage() {
  return (
    <LandingPage
      eyebrow="Study abroad"
      title="Discover where your education can take you"
      description="Explore international study options and learn about universities, application requirements, and the steps involved in planning your studies abroad."
    />
  );
}
