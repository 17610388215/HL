import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { ToolSearch } from "@/components/ToolSearch";
import { categories, getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = { title: "All Online Tools", description: "Browse every free PDF, image, calculator, text, and conversion tool.", alternates: { canonical: "/all-tools" } };

export default function AllToolsPage() {
  return (
    <>
      <section className="page-hero"><div className="shell"><span className="eyebrow">Tool directory</span><h1>All tools</h1><p>Twenty focused utilities for documents, images, numbers, words, and everyday conversions.</p><div style={{ marginTop: 26 }}><ToolSearch /></div></div></section>
      <div className="shell section">
        {categories.filter((category) => category.available).map((category) => {
          const categoryTools = getToolsByCategory(category.slug);
          return <section key={category.slug} style={{ marginBottom: 58 }}><div className="section-heading"><div><span className="eyebrow">{categoryTools.length} tools</span><h2>{category.name}</h2><p>{category.description}</p></div></div><div className="tool-grid tool-grid--3">{categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></section>;
        })}
      </div>
    </>
  );
}
