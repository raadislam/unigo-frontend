import type { MetadataRoute } from "next";
import { getCountryDirectory } from "@/lib/country-directory";

const baseUrl = "https://unigo-bd.com";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about/", "/contact/", "/study-abroad/", "/services/", "/visa-services/"];
  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const directory = await getCountryDirectory();
  const countrySlugs = new Set(directory.data.map((country) => country.slug));
  countrySlugs.add("canada");

  const countryEntries = Array.from(countrySlugs).map((slug) => ({
    url: `${baseUrl}/visa-services/${slug}/`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...countryEntries];
}
