import type { Metadata } from "next";
import { LandingPage } from "@/components/shared/landing-page";
import { BlogResources } from "@/components/blog/blog-resources";

export const metadata: Metadata = {
  title: "Insights & Resources",
  description:
    "Explore UniGo insights on visa guidance, international education, travel, global programs, competitions and professional opportunities.",

  alternates: {
    canonical: "/blog/",
  },

  openGraph: {
    title: "UniGo Journal | Insights & Global Perspectives",
    description:
      "Explore practical guidance, international opportunities, travel insights, visa information and stories from UniGo.",
    url: "https://unigo-bd.com/blog/",
    images: [
      {
        url: "/images/social/blog.png",
        width: 1200,
        height: 630,
        alt: "UniGo Journal - Insights and Global Perspectives",
      },
    ],
  },
};

export default function BlogPage() {
  return (
    <>
      {/* <LandingPage
        eyebrow="UniGo Journal"
        title="Ideas and insights for your global journey"
        description="Explore practical guidance, expert perspectives and inspiring stories across visa consultancy, international education, travel, global programs and more."
      /> */}

      <BlogResources />
    </>
  );
}
