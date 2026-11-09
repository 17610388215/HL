import Link from "next/link";
import { ChevronRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { getCategory, getRelatedTools, getToolHref, type Tool } from "@/lib/tools";
import { ToolRenderer } from "./tools/ToolRenderer";

export function ToolPageLayout({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category)!;
  const related = getRelatedTools(tool);
  const isLocalFileTool = tool.category === "pdf" || tool.category === "image";
  const breadcrumbJson = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://all-in-one-tools-hub.gallantcabin2.chatgpt.site/" },
    { "@type": "ListItem", position: 2, name: category.name, item: `https://all-in-one-tools-hub.gallantcabin2.chatgpt.site/${category.slug}/` },
    { "@type": "ListItem", position: 3, name: tool.title, item: `https://all-in-one-tools-hub.gallantcabin2.chatgpt.site${getToolHref(tool)}/` },
  ] };
  return (
    <div className="shell tool-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson).replace(/</g, "\\u003c") }} />
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={13} /><Link href={`/${category.slug}`}>{category.name}</Link><ChevronRight size={13} /><span>{tool.title}</span></nav>
      <div className="tool-page__layout">
        <div className="tool-page__main">
          <header className="tool-page__intro"><h1>{tool.title}</h1><p>{tool.description}</p>{isLocalFileTool && <span className="local-badge"><LockKeyhole size={14} /> Files stay on your device</span>}</header>
          <ToolRenderer tool={tool} />
          <div className="content-sections">
            <section className="content-card"><h2>How to use {tool.title}</h2><ol className="instruction-list">{tool.instructions.map((step) => <li key={step}>{step}</li>)}</ol></section>
            <section className="content-card"><h2>How it works</h2><p>{tool.explanation}</p>{tool.formula && <div className="formula-box">{tool.formula}</div>}{tool.example && <><h3>Worked example</h3><p>{tool.example}</p></>}</section>
            <section className="content-card"><h2>Frequently asked questions</h2><div className="faq-list">{tool.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
          </div>
        </div>
        <aside className="tool-page__aside">
          <div className="aside-card"><h2>Related tools</h2><div className="aside-list">{related.map((item) => <Link key={item.slug} href={getToolHref(item)}><span>{item.title}</span><ChevronRight size={14} /></Link>)}</div></div>
          <div className="aside-card"><ShieldCheck size={22} style={{ color: "var(--brand)", marginBottom: 10 }} /><h2>Private by design</h2><p>{isLocalFileTool ? "Your files are processed locally and are not permanently stored or sent to our server." : "Your inputs are processed in the page. No account is required to use this tool."}</p></div>
        </aside>
      </div>
    </div>
  );
}
