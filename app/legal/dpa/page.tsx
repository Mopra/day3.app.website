import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";
import { company, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Data Processing Agreement",
  description:
    "day3's Data Processing Agreement: the terms under which we process the subscriber data you bring, as your GDPR processor, entirely within the EU.",
  path: "/legal/dpa",
  keywords: [
    "day3 DPA",
    "data processing agreement email marketing",
    "GDPR processor agreement",
  ],
});

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-accent";

export default function DpaPage() {
  return (
    <LegalPage
      title="Data Processing Agreement"
      updated="June 2026"
      path="/legal/dpa"
      intro={
        <>
          This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the
          agreement between you (&ldquo;Controller&rdquo;) and {company.legalName}{" "}
          (&ldquo;day3&rdquo;, &ldquo;Processor&rdquo;) and governs how day3
          processes personal data on your behalf under the GDPR. By using day3 to
          send to subscribers you import, you accept this DPA.
        </>
      }
      sections={[
        {
          heading: "1. Roles and scope",
          body: (
            <p>
              You are the Controller of the subscriber personal data you upload
              and send to. day3 is the Processor, acting only on your documented
              instructions — which include your configuration and use of the
              service. For account and billing data, {company.legalName} is the
              Controller and that processing is governed by our{" "}
              <Link href="/privacy" className={linkClass}>
                Privacy Policy
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "2. Subject matter and duration",
          body: (
            <p>
              day3 processes personal data for as long as your account is active
              and for the limited period afterward described in clause 8. The
              subject matter is the provision of the day3 email service.
            </p>
          ),
        },
        {
          heading: "3. Nature and purpose of processing",
          body: (
            <p>
              Storing your audiences; sending the campaigns you create; recording
              delivery events (delivered, bounced, complained, unsubscribed); and
              presenting analytics back to you. day3 does not use your subscriber
              data for any purpose of its own.
            </p>
          ),
        },
        {
          heading: "4. Categories of data and data subjects",
          body: (
            <>
              <p>
                <strong>Data subjects:</strong> your subscribers and contacts.
              </p>
              <p>
                <strong>Personal data:</strong> typically email address and any
                name or fields you choose to import, plus engagement and delivery
                events. You agree not to upload special categories of data unless
                you have a lawful basis to do so.
              </p>
            </>
          ),
        },
        {
          heading: "5. day3's obligations",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Process personal data only on your documented instructions.</li>
              <li>
                Ensure people authorised to process it are bound by
                confidentiality.
              </li>
              <li>
                Implement appropriate technical and organisational security
                measures (clause 6).
              </li>
              <li>Assist you in meeting your own GDPR obligations (clause 7).</li>
            </ul>
          ),
        },
        {
          heading: "6. Security measures",
          body: (
            <p>
              day3 maintains appropriate technical and organisational measures —
              EU-only data residency, encryption in transit and at rest,
              least-privilege access, and managed backups — described on our{" "}
              <Link href="/security" className={linkClass}>
                Security page
              </Link>
              , which forms part of this DPA.
            </p>
          ),
        },
        {
          heading: "7. Sub-processing",
          body: (
            <p>
              You authorise day3 to engage the sub-processors listed on our{" "}
              <Link href="/legal/subprocessors" className={linkClass}>
                sub-processors page
              </Link>
              . day3 imposes data-protection terms on each sub-processor no less
              protective than this DPA, remains liable for their performance, and
              will give notice of intended changes so you may object.
            </p>
          ),
        },
        {
          heading: "8. Assistance, breaches, return and deletion",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                day3 helps you respond to data-subject requests and, where
                relevant, with DPIAs and consultations.
              </li>
              <li>
                day3 notifies you without undue delay after becoming aware of a
                personal data breach affecting your data.
              </li>
              <li>
                On termination, day3 deletes or returns your personal data within
                a reasonable period, except where retention is required by law.
              </li>
            </ul>
          ),
        },
        {
          heading: "9. International transfers",
          body: (
            <p>
              day3 processes personal data within the EU. Where any transfer
              outside the EEA would occur, it is covered by an adequacy decision
              or Standard Contractual Clauses.
            </p>
          ),
        },
        {
          heading: "10. Audits",
          body: (
            <p>
              day3 makes available the information needed to demonstrate
              compliance with this DPA and will respond to reasonable audit
              requests, including by providing relevant third-party reports from
              its sub-processors.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              To request a countersigned copy or raise a data-protection matter,
              email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
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
