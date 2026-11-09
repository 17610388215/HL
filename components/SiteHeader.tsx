import Link from "next/link";
import { Menu, Wrench } from "lucide-react";
import { ToolSearch } from "./ToolSearch";

const primaryLinks = [
  ["All Tools", "/all-tools"],
  ["PDF", "/pdf"],
  ["Image", "/image"],
  ["Calculators", "/calculators"],
  ["Text", "/text"],
  ["Converters", "/converters"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand" href="/" aria-label="Everyday Tools home">
          <span className="brand__mark"><Wrench size={20} /></span>
          <span>Everyday<span>Tools</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <details>
            <summary>More</summary>
            <div className="nav-popover">
              <Link href="/developer">Developer Tools</Link>
              <Link href="/ai">AI Tools</Link>
              <Link href="/media">Video &amp; Audio Tools</Link>
            </div>
          </details>
        </nav>
        <div className="header-search"><ToolSearch compact /></div>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><Menu size={23} /></summary>
          <div className="mobile-nav__panel">
            <ToolSearch compact />
            {primaryLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <Link href="/developer">Developer Tools</Link>
            <Link href="/ai">AI Tools</Link>
            <Link href="/media">Video &amp; Audio Tools</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
