import type { MetadataRoute } from "next";

const baseUrl = "https://unigo-bd.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about/", "/contact/", "/study-abroad/", "/services/"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
