import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://unigo-bd.com"),

  title: {
    default: "UniGo | Your Global Education Journey",
    template: "%s | UniGo",
  },

  description:
    "Discover international study opportunities, explore destinations, and get expert guidance for your global education journey.",

  applicationName: "UniGo",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unigo-bd.com/",
    siteName: "UniGo",
    title: "UniGo | Your Global Education Journey",
    description:
      "Discover international study opportunities, explore destinations, and get expert guidance for your global education journey.",
    images: [
      {
        url: "/images/unigo-social-preview.png",
        width: 1200,
        height: 630,
        alt: "UniGo - Your Global Education Journey",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UniGo | Your Global Education Journey",
    description:
      "Discover international study opportunities, explore destinations, and get expert guidance for your global education journey.",
    images: ["/images/unigo-social-preview.jpg"],
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
