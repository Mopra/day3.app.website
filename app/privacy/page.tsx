import * as React from "react";
import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How day3 handles your data and your subscribers' data — plainly stated.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="How we handle your data and your subscribers' data. This is a lightweight stub for the marketing site — the full policy presented at signup takes precedence."
      sections={[
        {
          heading: "What we collect",
          body: (
            <p>
              For your account: your name, email, and billing details. For your
              campaigns: the subscriber data you import and basic sending events
              (delivery, opens, clicks, unsubscribes) so you can see how a
              campaign did.
            </p>
          ),
        },
        {
          heading: "Your subscribers' data is yours",
          body: (
            <p>
              The contacts you bring to day3 belong to you. We process them to
              deliver your email and report on it — we don&apos;t sell them,
              rent them, or use them to market anything of our own.
            </p>
          ),
        },
        {
          heading: "How we use data",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>To send the campaigns you create.</li>
              <li>To show you analytics for your sends.</li>
              <li>To bill you and support your account.</li>
              <li>To keep the service secure and deliverable.</li>
            </ul>
          ),
        },
        {
          heading: "Deliverability & opt-outs",
          body: (
            <p>
              Every email includes a one-click unsubscribe and a visible opt-out
              link. Unsubscribes are honored immediately and added to a
              per-sender suppression list. Bounces and complaints are processed
              automatically.
            </p>
          ),
        },
        {
          heading: "Your rights & contact",
          body: (
            <p>
              You can access, export, or delete your data at any time. To make a
              request or ask a question, email{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
