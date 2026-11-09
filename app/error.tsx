"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="shell section"><div className="empty-category"><div><TriangleAlert size={42} /><span className="eyebrow" style={{ marginTop: 16 }}>Something went wrong</span><h1>The page could not finish loading</h1><p>Your selected files have not been uploaded. Try this page again, or return to the tool directory.</p><button className="button button--primary" type="button" onClick={reset} style={{ marginTop: 22 }}><RotateCcw size={16} /> Try again</button></div></div></div>;
}
