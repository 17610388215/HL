"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, getToolHref, tools } from "@/lib/tools";

export function ToolSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!normalized) return [];
    return tools
      .filter((tool) =>
        [tool.title, tool.shortDescription, tool.category, ...tool.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 7);
  }, [normalized]);

  return (
    <div className={`tool-search ${compact ? "tool-search--compact" : ""}`}>
      <div className="tool-search__field">
        <Search aria-hidden="true" size={compact ? 18 : 22} />
        <label className="sr-only" htmlFor={compact ? "header-tool-search" : "hero-tool-search"}>
          Search tools
        </label>
        <input
          id={compact ? "header-tool-search" : "hero-tool-search"}
          autoComplete="off"
          placeholder={compact ? "Search tools" : "Search PDF, image, percentage, word…"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button className="icon-button" type="button" onClick={() => setQuery("")} aria-label="Clear search">
            <X size={17} />
          </button>
        )}
      </div>
      {normalized && (
        <div className="tool-search__results" role="listbox" aria-label="Tool search results">
          {matches.length ? (
            matches.map((tool) => {
              const category = categories.find((item) => item.slug === tool.category);
              return (
                <a key={`${tool.category}-${tool.slug}`} href={getToolHref(tool)} role="option">
                  <span>{tool.title}</span>
                  <small>{category?.name}</small>
                </a>
              );
            })
          ) : (
            <p>No matching tools yet. Try a broader term.</p>
          )}
        </div>
      )}
    </div>
  );
}
