import type { Metadata } from "next";
import { LandingPage } from "@/components/shared/landing-page";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about UniGo and our approach to international education guidance.",
};

export default function AboutPage() {
  return (
    <LandingPage
      eyebrow="About UniGo"
      title="Helping you navigate your global education journey"
      description="We help students explore study destinations, understand their options, and plan the next steps toward international education."
    />
  );
}
