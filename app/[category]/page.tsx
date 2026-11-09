import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3 } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ToolCard } from "@/components/ToolCard";
import { categories, getCategory, getToolsByCategory } from "@/lib/tools";

export const dynamicParams = false;
export function generateStaticParams() { return categories.map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: category.name, description: category.description, alternates: { canonical: `/${category.slug}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryTools = getToolsByCategory(category.slug);
  return (
    <>
      <section className="page-hero"><div className="shell page-hero__row"><div><span className="eyebrow">Everyday Tools</span><h1>{category.name}</h1><p>{category.description}</p></div><span className="page-hero__icon"><CategoryIcon name={category.icon} size={36} /></span></div></section>
      <section className="shell section">
        {categoryTools.length ? <div className="tool-grid tool-grid--3">{categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div> : <div className="empty-category"><div><Clock3 size={38} /><h2>This category is on the roadmap</h2><p>We are building the foundation carefully before adding more tools. Explore the available categories while this one takes shape.</p></div></div>}
      </section>
    </>
  );
}
