import * as React from "react";

import { Container } from "@/components/marketing/container";
import { CodeCard } from "@/components/marketing/code-card";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";

/**
 * MCP — the part of day3 that nothing else in this category has.
 *
 * The pitch has to survive the reader's first objection, which is "so it's a
 * chat box bolted onto an editor". It isn't, and the difference is the whole
 * section: what an assistant writes arrives in day3 as the same editable blocks
 * a human would have dragged into place, so the email is one artifact worked on
 * from both ends rather than a wall of generated HTML you can't touch.
 *
 * Hence three beats instead of a feature list — the install, the sentence you
 * type, and the thing that lands. The install line is the app's own, verbatim
 * from `buildMcpSetups()`; the dialect is real syntax from the reference the MCP
 * server hands the model.
 */
const installSnippet = `claude mcp add --transport http day3 \\
  https://go.day3.app/api/mcp \\
  --header "Authorization: Bearer $DAY3_API_KEY"`;

const promptSnippet = `> Draft the launch email for segments,
  pull the highlights from CHANGELOG.md,
  and send me a test.`;

const markdownSnippet = `# Segments are here

Save a filter over any field and send to
it. Live, so it's never out of date.

:::columns
### Build it once
Up to ten conditions, matched all or any.
+++
### It stays current
Evaluated at send time, never frozen.
:::

[See it in the app](https://…){.button}`;

const mcpFacts = [
  {
    title: "One URL, no install",
    body: "Same bearer key as the REST API, one place to revoke it.",
  },
  {
    title: "It lands as blocks, not HTML",
    body: "Editable sections in the composer — and it reads back out as Markdown.",
  },
  {
    title: "It can't mail anyone by accident",
    body: "Reaching a real audience needs a key you minted for it. An ordinary key drafts and tests only.",
  },
  {
    title: "The free tier does the whole loop",
    body: "“Draft it and send me a test” works end to end, no card.",
  },
];

function McpProof() {
  return (
    <section id="mcp" className="scroll-mt-20 border-t border-border bg-oat/30">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="MCP"
            title="Write the email where you already work."
            description="day3 speaks Model Context Protocol. Point Claude Code, Cursor, or VS Code at one URL and your editor becomes a composer for it."
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={120} className="mt-12 grid gap-6 lg:grid-cols-3">
          <CodeCard
            label="1 · Point your editor at it"
            code={installSnippet}
            note="Cursor and VS Code take the same URL as JSON."
          />
          <CodeCard
            label="2 · Ask for the email"
            code={promptSnippet}
            note="It reads your audiences and senders first, so it writes against what you have."
          />
          <CodeCard
            label="3 · This is what it writes"
            code={markdownSnippet}
            note="Markdown plus blocks for buttons, columns and cards. Each one becomes an editable section."
          />
        </Reveal>

        <Reveal delay={180} className="mt-12 grid gap-8 sm:grid-cols-2">
          {mcpFacts.map((fact) => (
            <div key={fact.title}>
              <p className="font-medium text-foreground">{fact.title}</p>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">
                {fact.body}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

export { McpProof };
