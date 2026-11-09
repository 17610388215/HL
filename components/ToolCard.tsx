import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, getToolHref, type Tool } from "@/lib/tools";
import { CategoryIcon } from "./CategoryIcon";

export function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  const category = categories.find((item) => item.slug === tool.category)!;
  return (
    <Link className={`tool-card ${compact ? "tool-card--compact" : ""}`} data-accent={category.accent} href={getToolHref(tool)}>
      <span className="tool-card__icon"><CategoryIcon name={category.icon} size={compact ? 19 : 22} /></span>
      <span className="tool-card__content">
        <span className="tool-card__eyebrow">{category.shortName}</span>
        <strong>{tool.title}</strong>
        {!compact && <span>{tool.shortDescription}</span>}
      </span>
      <ArrowUpRight className="tool-card__arrow" aria-hidden="true" size={19} />
    </Link>
  );
}
