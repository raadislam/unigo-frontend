import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | UniGo Bangladesh",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/images/unigo-social-preview.png",
        width: 1200,
        height: 630,
        alt: "UniGo Bangladesh - Study Abroad, Visa and Travel Consultancy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/unigo-social-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://unigo-bd.com/#organization",
  name: "UniGo",
  url: "https://unigo-bd.com/",
  description:
    "UniGo provides international education guidance, university admission support, visa application assistance and travel services in Bangladesh.",
  telephone: "+8801901644300",
  email: "contact@unigo-bd.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  areaServed: {
    "@type": "Country",
    name: "Bangladesh",
  },
  knowsAbout: [
    "International education",
    "Study abroad guidance",
    "University admissions",
    "Student visa application assistance",
    "Travel services",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
