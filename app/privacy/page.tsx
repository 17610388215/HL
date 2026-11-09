import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", description: "How Everyday Tools handles files, inputs, and browser-based processing.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <><section className="page-hero"><div className="shell"><span className="eyebrow">Plain-language policy</span><h1>Privacy</h1><p>Our tools are designed to minimize data collection and keep files on your device whenever possible.</p></div></section><div className="shell section"><div className="content-card" style={{ maxWidth: 820 }}><h2>Local file processing</h2><p>PDF and image tools in this release run in your browser. Selected files are read by your device and are not uploaded to an application server.</p><h3>Tool inputs</h3><p>Text, calculator, and converter inputs are processed in the page. No account is required and these inputs are not intentionally retained by the application.</p><h3>Downloads</h3><p>Generated files are created locally and downloaded through your browser. You control the resulting files.</p><h3>Hosting and diagnostics</h3><p>The hosting platform may process standard network information needed to deliver the website and protect it from abuse. If analytics or advertising are added later, this policy will be updated before those changes are introduced.</p></div></div></>;
}
