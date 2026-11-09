import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "About UniGo Bangladesh | Education & Travel Consultancy",
  description:
    "Learn about UniGo Bangladesh, our approach to international education, university admission guidance, visa assistance and global travel services.",
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "About UniGo Bangladesh | Education & Travel Consultancy",
    description:
      "Discover UniGo's approach to international education, visa assistance and travel services.",
    url: "https://unigo-bd.com/about/",
    type: "website",
  },
};

export default function Page() {
  return <AboutPage />;
}
