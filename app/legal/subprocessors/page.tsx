import * as React from "react";
import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, subprocessors } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Sub-processors",
  description:
    "The complete list of third parties day3 uses to process personal data — every one EU-region. Vercel for hosting, Supabase for database and storage.",
  path: "/legal/subprocessors",
  keywords: [
    "day3 subprocessors",
    "email marketing subprocessors list",
    "EU subprocessors GDPR",
  ],
});

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-accent";

export default function SubprocessorsPage() {
  return (
    <LegalPage
      title="Sub-processors"
      updated="June 2026"
      path="/legal/subprocessors"
      intro="To run day3 we rely on a small number of trusted infrastructure providers that may process personal data on our behalf. Every one operates in the European Union. We keep this list current and complete."
      sections={[
        {
          heading: "Current sub-processors",
          body: (
            <div className="-mx-1 overflow-x-auto px-1">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 font-semibold text-foreground">
                      Provider
                    </th>
                    <th className="py-3 pr-4 font-semibold text-foreground">
                      Purpose
                    </th>
                    <th className="py-3 font-semibold text-foreground">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subprocessors.map((sp) => (
                    <tr key={sp.name} className="border-b border-border">
                      <td className="py-3 pr-4 align-top font-medium text-foreground">
                        <a
                          href={sp.url}
                          className={linkClass}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {sp.name}
                        </a>
                      </td>
                      <td className="py-3 pr-4 align-top text-muted-foreground">
                        {sp.purpose}
                      </td>
                      <td className="py-3 align-top text-muted-foreground">
                        {sp.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          heading: "Changes to this list",
          body: (
            <p>
              When we add or replace a sub-processor that handles personal data,
              we update this page before the change takes effect. Customers with a
              signed Data Processing Agreement can request advance notice so they
              have the opportunity to object.
            </p>
          ),
        },
        {
          heading: "Questions",
          body: (
            <p>
              Email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                {siteConfig.contactEmail}
              </a>{" "}
              with any question about a sub-processor or to request notification
              of future changes.
            </p>
          ),
        },
      ]}
    />
  );
}
