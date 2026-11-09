"use client";

import type { Tool } from "@/lib/tools";
import { CalculatorTools } from "./CalculatorTools";
import { ConverterTools } from "./ConverterTools";
import { ImageTools } from "./ImageTools";
import { PdfTools } from "./PdfTools";
import { TextTools } from "./TextTools";

export function ToolRenderer({ tool }: { tool: Tool }) {
  if (tool.category === "pdf") return <PdfTools slug={tool.slug} />;
  if (tool.category === "image") return <ImageTools slug={tool.slug} />;
  if (tool.category === "calculators") return <CalculatorTools slug={tool.slug} />;
  if (tool.category === "text") return <TextTools slug={tool.slug} />;
  if (tool.category === "converters") return <ConverterTools slug={tool.slug} />;
  return null;
}
