import type { Metadata } from "next";
import { getCountryDirectory } from "@/lib/country-directory";
import { CountryVisaPageClient } from "@/components/visa-services/country-visa-page-client";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const directory = await getCountryDirectory();
  const slugs = new Set(directory.data.map((country) => country.slug));
  slugs.add("canada");
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const countryName = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: `${countryName} Visa Information and Services | UniGo Bangladesh`,
    description: `Explore visa information, entry options and travel assistance for ${countryName} from UniGo Bangladesh.`,
    alternates: { canonical: `/visa-services/${slug}/` },
    openGraph: {
      title: `${countryName} Visa Services | UniGo Bangladesh`,
      description: `Explore visa information and UniGo assistance for ${countryName}.`,
      url: `https://unigo-bd.com/visa-services/${slug}/`,
      type: "article",
    },
  };
}

export default async function CountryVisaPage({ params }: Props) {
  const { slug } = await params;
  return <CountryVisaPageClient slug={slug} />;
}
