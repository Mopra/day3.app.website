import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

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
    default: "day3 — Email marketing without the bloat",
    template: "%s · day3",
  },
  description:
    "Email marketing for startups and indie devs. Unlimited subscribers, simple campaigns, predictable pricing based on sends. Start at $5/mo for 10,000 emails.",
  keywords: [
    "email marketing",
    "newsletter",
    "email campaigns",
    "send-based pricing",
    "startups",
    "indie developers",
  ],
  openGraph: {
    title: "day3 — Email marketing without the bloat",
    description:
      "Unlimited subscribers. Pay for sends. Simple campaigns, predictable pricing. Start at $5/mo for 10,000 emails.",
    url: siteUrl,
    siteName: "day3",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "day3 — Email marketing without the bloat",
    description:
      "Unlimited subscribers. Pay for sends. Simple campaigns, predictable pricing.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📩</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
