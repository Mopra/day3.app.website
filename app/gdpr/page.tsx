import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";
import { company, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "GDPR",
  description:
    "day3 and the GDPR: an EU company processing data in the EU. How we act as your data processor, the rights we uphold, and the agreements we offer.",
  path: "/gdpr",
  keywords: [
    "day3 GDPR",
    "GDPR compliant email marketing",
    "EU data processor email",
    "email marketing data processing agreement",
  ],
});

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-accent";

export default function GdprPage() {
  return (
    <LegalPage
      title="GDPR"
      updated="June 2026"
      path="/gdpr"
      intro={
        <>
          day3 is an EU company, built and hosted in the European Union, handling
          your data under the General Data Protection Regulation. This page
          explains how. It&apos;s written plainly; the binding terms live in our{" "}
          <Link href="/privacy" className={linkClass}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/dpa" className={linkClass}>
            Data Processing Agreement
          </Link>
          .
        </>
      }
      sections={[
        {
          heading: "Controller and processor — who's who",
          body: (
            <>
              <p>
                For your <strong>account data</strong> (your name, email, billing
                details), {company.legalName} is the data controller.
              </p>
              <p>
                For the <strong>subscribers you import</strong> and the sending
                events tied to them, <strong>you are the controller</strong> and
                day3 is your <strong>processor</strong> — we process those
                contacts only to deliver your campaigns and report on them, on
                your instructions.
              </p>
            </>
          ),
        },
        {
          heading: "Your data stays in the EU",
          body: (
            <p>
              day3 runs entirely within the European Union, on Vercel and
              Supabase in EU regions. Your data and your subscribers&apos; data
              are stored and processed in the EU. See the full list on the{" "}
              <Link href="/legal/subprocessors" className={linkClass}>
                sub-processors page
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Lawful basis",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Contract</strong> — to provide the service you sign up
                for and bill you for it.
              </li>
              <li>
                <strong>Legitimate interests</strong> — to keep day3 secure,
                deliverable, and free of abuse.
              </li>
              <li>
                <strong>Your instructions</strong> — for the subscriber data you
                bring, which we process as your processor under the DPA.
              </li>
            </ul>
          ),
        },
        {
          heading: "Rights of data subjects",
          body: (
            <>
              <p>
                Anyone whose personal data we process can access, correct, export,
                restrict, or delete it, and object to processing. For your own
                account data, email{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                  {siteConfig.contactEmail}
                </a>{" "}
                and we&apos;ll act within the time limits the GDPR sets.
              </p>
              <p>
                If a request reaches us about one of <em>your</em> subscribers,
                we&apos;ll forward it to you as the controller and help you
                respond.
              </p>
            </>
          ),
        },
        {
          heading: "International transfers",
          body: (
            <p>
              Our core processing happens inside the EU, so there is no routine
              transfer of personal data outside it. Where any supporting tool
              would involve a transfer, we rely on an adequacy decision or
              Standard Contractual Clauses, and we list every sub-processor so you
              can see exactly who is involved.
            </p>
          ),
        },
        {
          heading: "A DPA, ready to sign",
          body: (
            <p>
              Need a Data Processing Agreement for your records? Ours is published
              in full on the{" "}
              <Link href="/legal/dpa" className={linkClass}>
                DPA page
              </Link>
              . If your organisation needs it countersigned, email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about how day3 handles personal data go to{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                {siteConfig.contactEmail}
              </a>
              . {company.legalName} is based in {company.city}, {company.country}.
            </p>
          ),
        },
      ]}
    />
  );
}
