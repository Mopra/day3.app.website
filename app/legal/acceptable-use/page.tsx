import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Acceptable Use Policy",
  description:
    "day3's acceptable use and anti-spam policy. Permission-based sending only, no purchased lists, and the standards that keep delivery healthy for everyone on the platform.",
  path: "/legal/acceptable-use",
  keywords: [
    "day3 acceptable use policy",
    "anti-spam policy email marketing",
    "permission based email sending",
    "no purchased lists",
  ],
});

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-accent";

export default function AcceptableUsePage() {
  return (
    <LegalPage
      title="Acceptable Use Policy"
      updated="June 2026"
      path="/legal/acceptable-use"
      intro="day3 is a tool for people emailing audiences who asked to hear from them. This policy keeps it that way. It protects your delivery and everyone else's — one sender's spam hurts the whole platform's reputation. Breaking these rules can get an account suspended."
      sections={[
        {
          heading: "Send only with permission",
          body: (
            <>
              <p>
                You may only email people who gave you permission to — by signing
                up, buying from you, or otherwise clearly opting in. You must be
                able to show how and when that permission was given.
              </p>
              <p>
                No purchased, rented, scraped, or otherwise harvested lists. No
                emailing addresses you found rather than earned.
              </p>
            </>
          ),
        },
        {
          heading: "Every email must be honest",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Accurate &ldquo;from&rdquo;, &ldquo;to&rdquo;, and routing — no spoofing or disguising the sender.</li>
              <li>A subject line that reflects the actual content.</li>
              <li>A visible, working unsubscribe in every message.</li>
              <li>A real physical postal address for the sender.</li>
            </ul>
          ),
        },
        {
          heading: "Honor opt-outs immediately",
          body: (
            <p>
              day3 adds one-click unsubscribe and a per-sender suppression list to
              every send, and processes bounces and complaints automatically. You
              must not try to circumvent these, re-add people who opted out, or
              move them to another list to keep emailing them.
            </p>
          ),
        },
        {
          heading: "Content that isn't allowed",
          body: (
            <p>
              Don&apos;t use day3 to send anything illegal, deceptive, or harmful:
              fraud and phishing, malware or malicious links, content that
              infringes others&apos; rights, harassment or hateful content, or
              material prohibited by law in the recipient&apos;s country. Certain
              high-risk categories may be refused at our discretion.
            </p>
          ),
        },
        {
          heading: "Don't put delivery at risk",
          body: (
            <p>
              Sustained high spam-complaint or bounce rates, sending to stale or
              non-consenting lists, or anything that threatens day3&apos;s sending
              reputation may trigger a review. We&apos;d rather help you fix it
              than cut you off — but protecting deliverability for every sender
              comes first.
            </p>
          ),
        },
        {
          heading: "Enforcement",
          body: (
            <p>
              We may pause sending, suspend, or close accounts that violate this
              policy, and we&apos;ll act faster where recipients are being harmed.
              Where we reasonably can, we&apos;ll tell you what&apos;s wrong and
              give you a chance to put it right.
            </p>
          ),
        },
        {
          heading: "Report abuse",
          body: (
            <p>
              Received spam or something harmful sent via day3? Tell us at{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                {siteConfig.contactEmail}
              </a>{" "}
              and we&apos;ll investigate. This policy works alongside our{" "}
              <Link href="/terms" className={linkClass}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={linkClass}>
                Privacy Policy
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
