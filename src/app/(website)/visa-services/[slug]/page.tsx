import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryDirectory, getCountry, getVisaRequirement } from "@/lib/country-directory";
import { CountryVisaPageClient } from "@/components/visa-services/country-visa-page-client";

type Props = { params: Promise<{ slug: string }> };

const baseUrl = "https://unigo-bd.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  const directory = await getCountryDirectory();
  const slugs = new Set(directory.data.map((country) => country.slug));
  slugs.add("canada");
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const country = await getCountry(slug);
    const requirement = await getVisaRequirement(country.iso2).catch(() => null);
    const title =
      country.seo_title?.trim() ||
      `${country.name} Visa Requirements for Bangladeshi Citizens | UniGo`;
    const description =
      country.seo_description?.trim() ||
      country.short_description?.trim() ||
      `Explore ${country.name} visa requirements for Bangladeshi passport holders, entry rules, required documents and visa assistance from UniGo Bangladesh.`;
    const canonical = `${baseUrl}/visa-services/${country.slug}/`;
    const keywords = [
      ...(country.seo_keywords ?? []),
      `${country.name} visa from Bangladesh`,
      `${country.name} visa requirements for Bangladeshi citizens`,
      `${country.name} visa application`,
    ];

    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        type: "article",
        locale: "en_BD",
        siteName: "UniGo Bangladesh",
        title,
        description,
        url: canonical,
        images: [
          {
            url: "/images/unigo-social-preview.png",
            width: 1200,
            height: 630,
            alt: `${country.name} visa information - UniGo Bangladesh`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/unigo-social-preview.png"],
      },
      robots: {
        index: true,
        follow: true,
      },
      other: requirement?.official_source_checked_at
        ? { "visa-information-last-verified": requirement.official_source_checked_at }
        : undefined,
    };
  } catch {
    return {
      title: "Visa Information and Services | UniGo Bangladesh",
      description:
        "Explore destination visa information, entry requirements and travel assistance from UniGo Bangladesh.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function CountryVisaPage({ params }: Props) {
  const { slug } = await params;
  let country;

  try {
    country = await getCountry(slug);
  } catch {
    notFound();
  }

  const requirement = await getVisaRequirement(country.iso2).catch(() => null);

  return (
    <CountryVisaPageClient
      slug={slug}
      initialCountry={country}
      initialRequirement={requirement}
    />
  );
}
