import type { MetadataRoute } from "next";
import { categories, getToolHref, tools } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://all-in-one-tools-hub.gallantcabin2.chatgpt.site";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/all-tools/`, changeFrequency: "weekly", priority: .9 },
    { url: `${base}/privacy/`, changeFrequency: "yearly", priority: .3 },
    ...categories.map((category) => ({ url: `${base}/${category.slug}/`, changeFrequency: "weekly" as const, priority: category.available ? .8 : .4 })),
    ...tools.map((tool) => ({ url: `${base}${getToolHref(tool)}/`, changeFrequency: "monthly" as const, priority: .75 })),
  ];
}
