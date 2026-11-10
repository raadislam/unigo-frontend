import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://unigo-bd.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about/", "/contact/", "/study-abroad/", "/services/"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
