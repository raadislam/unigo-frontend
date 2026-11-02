import type { Metadata } from "next";
import { DestinationsSection } from "@/components/home/destinations-section";
import { LandingPage } from "@/components/shared/landing-page";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore popular international Destinations with UniGo.",
};

export default function DestinationsPage() {
  return (
    <>
      <LandingPage
        eyebrow="Global destinations"
        title="Explore your next destination"
        description="Compare international Destinations and begin exploring the opportunities available to you."
      />
      <DestinationsSection />
    </>
  );
}
