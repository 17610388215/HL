import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { ToolCard } from "@/components/ToolCard";
import { ToolSearch } from "@/components/ToolSearch";
import { categories, getToolsByCategory, tools } from "@/lib/tools";

export default function HomePage() {
  const featured = tools.filter((tool) => tool.featured).slice(0, 8);
  const recent = tools.filter((tool) => tool.recentlyAdded).slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="shell hero__content">
          <span className="hero__badge"><CheckCircle2 size={15} /> 20 tools. No sign-up. No clutter.</span>
          <h1>Free online tools for <span>everyday tasks</span></h1>
          <p className="hero__lead">Calculate, convert, compress, edit, and create — all in one place.</p>
          <ToolSearch />
          <div className="hero__trust"><span><LockKeyhole size={15} /> Local file processing</span><span><Zap size={15} /> Fast on any device</span><span><ShieldCheck size={15} /> Privacy focused</span></div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Start here" title="Featured tools" copy="A practical starting set for the tasks people reach for most often." action={<Link className="text-link" href="/all-tools">View all tools <ArrowRight size={17} /></Link>} />
          <div className="tool-grid">{featured.map((tool) => <ToolCard key={`${tool.category}-${tool.slug}`} tool={tool} />)}</div>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <SectionHeading eyebrow="Explore" title="Browse by category" copy="A tidy home for every utility, designed to grow without getting hard to navigate." />
          <div className="category-grid">
            {categories.map((category) => {
              const count = getToolsByCategory(category.slug).length;
              return (
                <Link className={`category-card ${!category.available ? "category-card--planned" : ""}`} href={`/${category.slug}`} key={category.slug}>
                  <div className="category-card__top"><span className="category-card__icon"><CategoryIcon name={category.icon} /></span><span className="category-card__count">{count ? `${count} tools` : "Planned"}</span></div>
                  <h3>{category.name}</h3><p>{category.description}</p>
                  {!category.available && <span className="category-card__status">On the roadmap</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Fresh additions" title="Recently added" copy="New utilities, built to the same fast and privacy-conscious standard." />
          <div className="tool-grid">{recent.map((tool) => <ToolCard key={`${tool.category}-${tool.slug}`} tool={tool} />)}</div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="platform-strip">
            <div className="platform-strip__intro"><span className="eyebrow">A quieter kind of utility site</span><h2>Useful first. Everything else second.</h2><p>Clear inputs, trustworthy results, and no account wall between you and the task.</p></div>
            <div className="platform-feature"><LockKeyhole size={24} /><strong>Your files stay local</strong><span>PDF and image processing runs in your browser whenever possible.</span></div>
            <div className="platform-feature"><Zap size={24} /><strong>Built for speed</strong><span>Lightweight pages and direct workflows on desktop or mobile.</span></div>
            <div className="platform-feature"><ShieldCheck size={24} /><strong>Clear assumptions</strong><span>Formulas, examples, and limitations are shown next to results.</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
