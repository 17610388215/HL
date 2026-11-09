import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://all-in-one-tools-hub.gallantcabin2.chatgpt.site/sitemap.xml" };
}
