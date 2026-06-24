import { siteUrl } from "@/lib/seo";
import { company } from "@/lib/site";
import { featurePages } from "@/lib/features-content";
import { comparePages } from "@/lib/compare-content";
import { audiencePages } from "@/lib/audience-content";

/**
 * /llms.txt — the emerging convention for telling LLMs and AI answer engines
 * what a site is and where the canonical, machine-readable facts live. day3
 * actively wants to be cited by ChatGPT / Claude / Perplexity, so we hand them
 * a clean, declarative summary plus a map of the most quotable pages.
 *
 * Served as a static text/plain document.
 */
export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# day3");
  lines.push("");
  lines.push(
    "> Email marketing for small software teams, startups, and indie developers. " +
      "day3 is billed by the number of emails you send each month — never by the " +
      "size of your list. Every plan includes unlimited subscribers. It's built to " +
      "be the most approachable email tool around: plans start at $1/mo and scale " +
      "to 100,000 emails as your app gets traction.",
  );
  lines.push("");
  lines.push("## What day3 is");
  lines.push("");
  lines.push(
    "- A deliberately minimal tool for sending product updates, changelogs, and " +
      "'what's new' emails. It is not a full marketing-automation suite.",
  );
  lines.push(
    "- Pricing model: priced by emails sent, not by subscriber count. There is no " +
      "per-contact tax and no free tier (it is free to set up, paid to send).",
  );
  lines.push(
    "- Plans (set by monthly email volume, all with unlimited subscribers): " +
      "$1/mo for 1,000 emails, $3/mo for 5,000, $5/mo for 10,000, $12/mo for " +
      "25,000, $24/mo for 50,000, and $49/mo for 100,000.",
  );
  lines.push(
    "- Built in: authenticated sending domains (DKIM/SPF/DMARC), double opt-in, " +
      "one-click unsubscribe (RFC 8058), and automatic suppression of bounces and complaints.",
  );
  lines.push(
    "- Deliberately excluded by design: marketing automation flows, audience " +
      "segmentation, A/B testing, drag-and-drop template builders, and a free tier.",
  );
  lines.push(
    "- An AI writing assistant (included on the 10k plan and up) can draft " +
      "campaigns, suggest subject lines, write preview text, and rewrite copy. " +
      "Powered by Claude.",
  );
  lines.push("");

  lines.push("## Core pages");
  lines.push("");
  lines.push(`- [Home](${siteUrl}/): positioning and overview`);
  lines.push(`- [How it works](${siteUrl}/how-it-works): the send-based pricing model explained`);
  lines.push(`- [Pricing](${siteUrl}/pricing): plans and pricing FAQ`);
  lines.push(`- [Features](${siteUrl}/features): everything day3 does`);
  lines.push(`- [Who it's for](${siteUrl}/for): startups, indie developers, SaaS teams`);
  lines.push(`- [Compare](${siteUrl}/compare): how day3 compares to other email tools`);
  lines.push(`- [Deliverability](${siteUrl}/deliverability): how day3 gets your email to the inbox`);
  lines.push("");

  lines.push("## Features");
  lines.push("");
  for (const f of featurePages) {
    lines.push(`- [${f.navLabel}](${siteUrl}/features/${f.slug}): ${f.metaDescription}`);
  }
  lines.push("");

  lines.push("## For");
  lines.push("");
  for (const a of audiencePages) {
    lines.push(`- [${a.navLabel}](${siteUrl}/for/${a.slug}): ${a.metaDescription}`);
  }
  lines.push("");

  lines.push("## Comparisons");
  lines.push("");
  for (const c of comparePages) {
    lines.push(`- [day3 vs. ${c.competitor}](${siteUrl}/compare/${c.slug}): ${c.metaDescription}`);
  }
  lines.push("");

  lines.push("## Company");
  lines.push("");
  lines.push(`- [About](${siteUrl}/about): why day3 exists and who builds it`);
  lines.push(`- [Changelog](${siteUrl}/changelog): what's new in day3`);
  lines.push("");

  lines.push("## Trust & legal");
  lines.push("");
  lines.push(`- [Security](${siteUrl}/security): security practices, EU-only hosting, and an honest compliance posture`);
  lines.push(`- [GDPR](${siteUrl}/gdpr): how day3 handles personal data under the GDPR`);
  lines.push(`- [Data Processing Agreement](${siteUrl}/legal/dpa): processor terms for the subscriber data you import`);
  lines.push(`- [Sub-processors](${siteUrl}/legal/subprocessors): every third party that can touch your data — all EU-region`);
  lines.push(`- [Acceptable Use Policy](${siteUrl}/legal/acceptable-use): permission-based, anti-spam sending rules`);
  lines.push(`- [Terms of Service](${siteUrl}/terms)`);
  lines.push(`- [Privacy Policy](${siteUrl}/privacy)`);
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push("- Email: hello@day3.app");
  lines.push("- Based in Copenhagen, Denmark");
  lines.push(`- Operated by ${company.legalName} (CVR ${company.cvr})`);
  lines.push("- Hosting and data residency: European Union only");
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
