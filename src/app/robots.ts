import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://unigo-bd.com/sitemap.xml",
    host: "https://unigo-bd.com",
  };
}
