import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const siteUrl = "https://all-in-one-tools-hub.gallantcabin2.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Everyday Tools — Free Online Utilities", template: "%s | Everyday Tools" },
  description: "Free online tools to calculate, convert, compress, edit, and create. Fast, private, and easy to use.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Everyday Tools",
    title: "Everyday Tools — Free Online Utilities",
    description: "Calculate, convert, compress, edit, and create — all in one place.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: "Everyday Tools", description: "Free online tools for everyday tasks." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
