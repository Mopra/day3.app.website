import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

import { siteConfig } from "@/lib/site";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const siteUrl = "https://day3.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "day3 — Email marketing billed by what you send",
    template: "%s · day3",
  },
  description:
    "day3 is launching soon. The most approachable email tool for startups and indie devs — unlimited subscribers, priced by emails sent. Plans start at $1/mo.",
  keywords: [
    "email marketing",
    "newsletter",
    "email campaigns",
    "send-based pricing",
    "startups",
    "indie developers",
    "early access",
  ],
  openGraph: {
    title: "day3 — Launching soon",
    description:
      "Unlimited subscribers, billed by emails sent rather than list size. Plans start at $1/mo.",
    url: siteUrl,
    siteName: "day3",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "day3 — Launching soon",
    description:
      "Unlimited subscribers, billed by emails sent. Plans start at $1/mo.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-dvh overflow-x-clip bg-background font-sans text-foreground antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        {/* Opens the subscribe popup once when a visitor moves to leave, site-wide. */}
        <div
          hidden
          data-day3-form={siteConfig.subscribeFormId}
          data-day3-mode="popup"
          data-day3-trigger="exit-intent"
        />
      </body>
      {/* Powers the day3 subscribe popup wherever a SubscribeButton appears. */}
      <Script src={siteConfig.embedScriptUrl} strategy="afterInteractive" />
      <GoogleAnalytics gaId="G-JJJ6E2LDX8" />
    </html>
  );
}
