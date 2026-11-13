import type { Metadata } from "next";
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
      <BlogResources />
    </>
  );
}
