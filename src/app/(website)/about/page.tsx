import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "About Us | UniGo",
  description:
    "Learn about UniGo, our mission, and how we help students explore international education opportunities.",
};

export default function Page() {
  return <AboutPage />;
}
