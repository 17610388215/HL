import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getTool, getToolHref, tools } from "@/lib/tools";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ category: tool.category, tool: tool.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string; tool: string }> }): Promise<Metadata> {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) return {};
  return { title: tool.title, description: tool.description, alternates: { canonical: getToolHref(tool) }, openGraph: { title: tool.title, description: tool.description, url: getToolHref(tool) } };
}

export default async function ToolPage({ params }: { params: Promise<{ category: string; tool: string }> }) {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) notFound();
  return <ToolPageLayout tool={tool} />;
}
