import * as React from "react";
import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of day3 — plain-language, fair, and short.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 2026"
      intro="These terms cover your use of day3. They're written to be readable. This is a lightweight stub for the marketing site — the binding terms presented at signup take precedence."
      sections={[
        {
          heading: "The short version",
          body: (
            <p>
              Use day3 to send email to people who agreed to hear from you. Pay
              your bill. Don&apos;t abuse the service or other people&apos;s
              inboxes. We&apos;ll keep the lights on and treat you fairly.
            </p>
          ),
        },
        {
          heading: "Your account",
          body: (
            <p>
              You&apos;re responsible for your account, your sending domain, and
              the content of the campaigns you send. Keep your credentials safe
              and make sure the people on your lists actually opted in.
            </p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <>
              <p>
                day3 is for sending wanted email to your own audience. The
                following are not allowed:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Purchased, scraped, or rented lists.</li>
                <li>Cold outreach to people who never opted in.</li>
                <li>
                  Misleading sender identity, subject lines, or unsubscribe
                  links.
                </li>
                <li>Unlawful, harmful, or deceptive content.</li>
              </ul>
              <p>
                Every campaign includes one-click unsubscribe and honors opt-outs
                immediately. Senders with poor deliverability metrics may be
                paused.
              </p>
            </>
          ),
        },
        {
          heading: "Billing",
          body: (
            <p>
              Plans are billed monthly and priced by emails sent. Subscribers are
              always unlimited and free. You can change or cancel your plan at any
              time; changes apply from the next billing period.
            </p>
          ),
        },
        {
          heading: "Changes & contact",
          body: (
            <p>
              We may update these terms as the product grows; we&apos;ll note the
              date above when we do. Questions? Email{" "}
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
