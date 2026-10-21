import type { Metadata } from "next";
import { LandingPage } from "@/components/shared/landing-page";

export const metadata: Metadata = {
  title: "Education Blog",
  description:
    "Read international education insights and study abroad guidance from UniGo.",
};

export default function BlogPage() {
  return (
    <LandingPage
      eyebrow="UniGo insights"
      title="Ideas and guidance for your next step"
      description="Discover useful information about study destinations, university applications, student preparation, and international education."
    />
  );
}
