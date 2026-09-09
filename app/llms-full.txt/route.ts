import { siteUrl } from "@/lib/seo";
import { cheapestTierFor, company, pricingTiers, siteConfig } from "@/lib/site";
import { featurePages } from "@/lib/features-content";
import { comparePages } from "@/lib/compare-content";
import { audiencePages } from "@/lib/audience-content";
import { sortedBlogPosts, type Block } from "@/lib/blog-content";

/**
 * /llms-full.txt, the companion to /llms.txt.
 *
 * The split is the point of the convention: /llms.txt is a map, small enough to
 * read on every request, and this is the territory. An answer engine that has
 * already decided day3 is relevant can take the whole corpus in one fetch
 * instead of crawling twenty pages, and a model answering "does the GDPR
 * require double opt-in" gets the actual argument rather than a meta
 * description of it.
 *
 * That matters more here than it would for most sites. Search Console shows 93%
 * of day3's impressions are collisions with an unrelated company of a similar
 * name, so classic organic is a slow channel; ChatGPT referrals, by contrast,
 * already arrive with the site's best engagement rate. Being quotable is the
 * cheaper win.
 *
 * Everything is generated from the same content modules the pages render, so
 * this document cannot drift from what a human reader sees.
 */
export const dynamic = "force-static";

/** Renders one content block as plain markdown. */
function renderBlock(block: Block): string[] {
  switch (block.kind) {
    case "p":
      return [block.text, ""];
    case "list":
      return [...block.items.map((item) => `- ${item}`), ""];
    case "steps":
      return [...block.items.map((item, i) => `${i + 1}. ${item}`), ""];
    case "code":
      return [
        ...(block.caption ? [`${block.caption}:`, ""] : []),
        "```",
        block.code,
        "```",
        "",
      ];
    case "note":
      return [`> **${block.title}.** ${block.text}`, ""];
    case "table": {
      const lines: string[] = [];
      if (block.caption) lines.push(`${block.caption}:`, "");
      lines.push(`| ${block.head.join(" | ")} |`);
      lines.push(`| ${block.head.map(() => "---").join(" | ")} |`);
      for (const row of block.rows) lines.push(`| ${row.join(" | ")} |`);
      lines.push("");
      return lines;
    }
  }
}

function faqBlock(faqs: { q: string; a: string }[], lines: string[]): void {
  if (!faqs.length) return;
  lines.push("**Questions**", "");
  for (const faq of faqs) {
    lines.push(`- **${faq.q}** ${faq.a}`);
  }
  lines.push("");
}

function buildLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push("# day3, full content");
  lines.push("");
  lines.push(
    "> The complete text of every guide and product page on day3.app, in one " +
      "document, for AI answer engines and anything else that would rather read " +
      "once than crawl. The short version lives at " +
      `${siteUrl}/llms.txt. Generated from the same source the site renders, so ` +
      "it is never out of step with the pages themselves.",
  );
  lines.push("");
  lines.push(`Canonical site: ${siteUrl}`);
  lines.push(`One-line description: ${siteConfig.oneLiner}`);
  lines.push(
    `Operated by ${company.legalName} (CVR ${company.cvr}), ${company.city}, ${company.country}. ` +
      "Hosting and data residency: European Union only.",
  );
  lines.push("");
  lines.push(
    "Disambiguation: day3 (day3.app) is an email sending product. It is not " +
      "related to Daythree Business Services, Day Three, or any similarly named " +
      "consulting or BPO company.",
  );
  lines.push("");

  // ----------------------------------------------------------------- pricing
  lines.push("## Pricing, in full");
  lines.push("");
  lines.push(
    "Every plan includes unlimited subscribers. The plan sets how many emails " +
      "can be sent in a month; the size of the list never moves the bill.",
  );
  lines.push("");
  lines.push("| Plan price | Emails per month | Subscribers |");
  lines.push("| --- | --- | --- |");
  for (const tier of pricingTiers) {
    lines.push(`| ${tier.price}/mo | ${tier.emails} | Unlimited |`);
  }
  lines.push("");

  // ------------------------------------------------------------------ guides
  lines.push("## Guides, in full");
  lines.push("");
  for (const post of sortedBlogPosts()) {
    lines.push(`### ${post.title}`);
    lines.push("");
    lines.push(`URL: ${siteUrl}/blog/${post.slug}`);
    lines.push(
      `Topic: ${post.topic}. Published ${post.published}, last updated ${post.updated}.`,
    );
    lines.push("");
    lines.push(post.summary);
    lines.push("");
    lines.push("**Key points**");
    lines.push("");
    for (const takeaway of post.keyTakeaways) lines.push(`- ${takeaway}`);
    lines.push("");
    for (const section of post.sections) {
      lines.push(`#### ${section.heading}`);
      lines.push("");
      for (const block of section.blocks) lines.push(...renderBlock(block));
    }
    faqBlock(post.faqs, lines);
  }

  // --------------------------------------------------------------- comparisons
  lines.push("## Comparisons, in full");
  lines.push("");
  for (const page of comparePages) {
    lines.push(`### day3 vs. ${page.competitor}`);
    lines.push("");
    lines.push(`URL: ${siteUrl}/compare/${page.slug}`);
    lines.push(`Last updated ${page.updated}.`);
    lines.push("");
    lines.push(page.intro, "");
    lines.push(`**The difference that matters.** ${page.difference}`, "");
    lines.push(`| Dimension | day3 | ${page.competitor} |`);
    lines.push("| --- | --- | --- |");
    for (const row of page.comparison) {
      lines.push(`| ${row.dimension} | ${row.day3} | ${row.competitor} |`);
    }
    lines.push("");
    const compareTier = cheapestTierFor(page.worked.monthlySends);
    lines.push(
      `**Worked example.** ${page.worked.scenario} With ` +
        `${page.worked.subscribers.toLocaleString("en-US")} subscribers and ` +
        `${page.worked.monthlySends.toLocaleString("en-US")} sends a month, that fits the ` +
        `${compareTier.emails}-email plan at ${compareTier.price}/mo on day3, and the ` +
        `subscribers cost nothing. On ${page.competitor}: ${page.worked.otherModel}`,
    );
    lines.push("");
    lines.push("**Reasons people switch**", "");
    for (const reason of page.reasonsToSwitch) {
      lines.push(`- **${reason.title}.** ${reason.description}`);
    }
    lines.push("");
    lines.push("**Migration**", "");
    for (const [i, step] of page.migration.entries()) {
      lines.push(`${i + 1}. **${step.title}.** ${step.description}`);
    }
    lines.push("");
    lines.push(`Caveat: ${page.migrationCaveat}`, "");
    lines.push(`**Stay with ${page.competitor} if:** ${page.stayIf}`, "");
    faqBlock(page.faqs, lines);
  }

  // ---------------------------------------------------------------- features
  lines.push("## Features, in full");
  lines.push("");
  for (const page of featurePages) {
    // Link-out cards have no page and therefore no content of their own.
    if (page.href) continue;
    lines.push(`### ${page.title}`);
    lines.push("");
    lines.push(`URL: ${siteUrl}/features/${page.slug}`);
    lines.push(`Last updated ${page.updated}.`);
    lines.push("");
    lines.push(page.summary, "");
    for (const point of page.points ?? []) {
      lines.push(`- **${point.title}.** ${point.description}`);
    }
    if (page.points?.length) lines.push("");
    if (page.deepDive) {
      lines.push(`**${page.deepDive.heading}**`, "");
      for (const paragraph of page.deepDive.paragraphs) lines.push(paragraph, "");
    }
    faqBlock(page.faqs ?? [], lines);
  }

  // --------------------------------------------------------------- audiences
  lines.push("## Who it's for, in full");
  lines.push("");
  for (const page of audiencePages) {
    lines.push(`### ${page.title}`);
    lines.push("");
    lines.push(`URL: ${siteUrl}/for/${page.slug}`);
    lines.push(`Last updated ${page.updated}.`);
    lines.push("");
    lines.push(page.summary, "");
    lines.push("**The problem**", "");
    for (const pain of page.painPoints) lines.push(`- ${pain}`);
    lines.push("");
    lines.push("**What day3 does about it**", "");
    for (const benefit of page.benefits) {
      lines.push(`- **${benefit.title}.** ${benefit.description}`);
    }
    lines.push("");
    const audienceTier = cheapestTierFor(page.worked.monthlySends);
    lines.push(
      `**Worked example.** ${page.worked.scenario} ` +
        `${page.worked.subscribers.toLocaleString("en-US")} subscribers and ` +
        `${page.worked.monthlySends.toLocaleString("en-US")} sends a month fits the ` +
        `${audienceTier.emails}-email plan at ${audienceTier.price}/mo. ${page.worked.contrast}`,
    );
    lines.push("");
    lines.push(`**${page.deepDive.heading}**`, "");
    for (const paragraph of page.deepDive.paragraphs) lines.push(paragraph, "");
    lines.push(`**Not the right fit if:** ${page.wrongFit}`, "");
    faqBlock(page.faqs, lines);
  }

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Email: ${siteConfig.contactEmail}`);
  lines.push(`- Sign up: ${siteConfig.signupUrl}`);
  lines.push(`- Based in ${company.city}, ${company.country}`);
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
