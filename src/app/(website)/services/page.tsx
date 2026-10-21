import type { Metadata } from "next";
import { LandingPage } from "@/components/shared/landing-page";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore UniGo's international education guidance services.",
};

export default function ServicesPage() {
  return (
    <LandingPage
      eyebrow="Our services"
      title="Guidance for every step of your journey"
      description="Explore support for study planning, university selection, application preparation, visa documentation guidance, and pre-departure planning."
    />
  );
}
