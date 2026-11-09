import Link from "next/link";
import { LockKeyhole, Wrench } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <div className="brand brand--footer"><span className="brand__mark"><Wrench size={18} /></span><span>Everyday<span>Tools</span></span></div>
          <p>Fast, practical tools that respect your time and your files.</p>
          <div className="privacy-note"><LockKeyhole size={17} /> Local processing whenever possible</div>
        </div>
        <div><h2>Tools</h2><Link href="/pdf">PDF</Link><Link href="/image">Image</Link><Link href="/calculators">Calculators</Link><Link href="/text">Text</Link><Link href="/converters">Converters</Link></div>
        <div><h2>Explore</h2><Link href="/all-tools">All Tools</Link><Link href="/developer">Developer</Link><Link href="/ai">AI Tools</Link><Link href="/media">Video &amp; Audio</Link></div>
        <div><h2>About</h2><Link href="/privacy">Privacy</Link><span className="muted-link">No account required</span><span className="muted-link">Free to use</span></div>
      </div>
      <div className="shell site-footer__bottom">© {new Date().getFullYear()} Everyday Tools. Built for everyday tasks.</div>
    </footer>
  );
}
