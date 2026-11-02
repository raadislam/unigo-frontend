import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://unigo-bd.com"),

  title: {
    default: "UniGo | Your Global Journey Starts Here.",
    template: "%s | UniGo",
  },

  description:
    "Discover global opportunities with UniGo. Explore international education, travel and visa assistance, global programs, consultancy and professional services.",

  applicationName: "UniGo",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unigo-bd.com/",
    siteName: "UniGo",
    title: "UniGo | Your Global Journey Starts Here.",
    description:
      "From international education and travel to visa assistance, global programs and professional consultancy, UniGo connects you with opportunities worldwide.",
    images: [
      {
        url: "/images/unigo-social-preview.png",
        width: 1200,
        height: 630,
        alt: "UniGo - Your Global Journey Starts Here.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UniGo | Your Global Journey Starts Here.",
    description:
      "Explore global opportunities with UniGo across education, travel, visa assistance, international programs and professional services.",
    images: ["/images/unigo-social-preview.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
