import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <div className="shell section"><div className="empty-category"><div><SearchX size={42} /><span className="eyebrow" style={{ marginTop: 16 }}>404 error</span><h1>That tool is not here</h1><p>The link may be outdated, or the tool may have moved into a different category.</p><Link className="button button--primary" href="/all-tools" style={{ marginTop: 22 }}><ArrowLeft size={16} /> Browse all tools</Link></div></div></div>;
}
