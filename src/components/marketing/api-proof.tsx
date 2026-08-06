import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { CodeCard } from "@/components/marketing/code-card";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";

/**
 * The section that proves the audience line in the hero.
 *
 * "Email for the people who ship" is a claim until something on the page is
 * shaped for someone who writes software. Real HTTP does that better than any
 * adjective — and it filters, too: a reader who came looking for a
 * drag-and-drop builder now knows this isn't for them, which is the point.
 *
 * Two calls, because they're the two different reasons a developer is here:
 * mail that the app sends on its own, and a list that has to stay in step with
 * the app's own users. Both verified against the app's api-docs source.
 */
const transactionalSnippet = `curl -X POST "https://go.day3.app/api/v1/emails" \\
  -H "Authorization: Bearer $DAY3_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -d '{
    "from": "Acme <notify@acme.com>",
    "to": ["jane@acme.com"],
    "subject": "Reset your password",
    "html": "<p>Your link is <a href=\\"...\\">here</a>.</p>"
  }'`;

const contactSnippet = `curl -X POST \\
  ".../v1/audiences/aud_123/contacts?upsert=true" \\
  -H "Authorization: Bearer $DAY3_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "jane@acme.com",
    "first_name": "Jane",
    "attributes": { "plan": "pro" }
  }'`;

/**
 * The DX details a developer actually decides on. Stated as facts rather than
 * benefits — each one is a papercut other providers leave in, and the reader
 * recognizes the papercut without being told that it hurts.
 */
const apiFacts = [
  {
    title: "Retries can't double-send",
    body: "Send an Idempotency-Key and a network failure resolves to exactly one email — even when the retry races its own first attempt.",
  },
  {
    title: "No look-up round-trip",
    body: "Address a contact by email or by id. Nothing needs an id-mapping table first.",
  },
  {
    title: "Fields declare themselves",
    body: "Unknown attributes register into the audience's field registry and become merge tags. Nothing to define up front.",
  },
  {
    title: "One domain, both jobs",
    body: "Password resets and product updates leave from the same verified domain, against the same monthly allowance.",
  },
];

/**
 * Migration, as the three calls it actually is. Deliberately the endpoint list
 * and not another snippet: the hard part of a migration was never the syntax,
 * it was knowing that suppressions have to go first.
 */
const migrationCalls = [
  {
    call: "POST /v1/suppressions",
    body: "Your old bounces and complaints — first, so nothing re-mails them.",
  },
  {
    call: "POST /v1/audiences/{id}/contacts/batch",
    body: "1,000 contacts a call, per-row results, safe to re-run.",
  },
  {
    call: '…/batch { "status": "unsubscribed" }',
    body: "The people who left, carried over with the date they left on.",
  },
];

function ApiProof() {
  return (
    <section id="api" className="scroll-mt-20 border-t border-border">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="For the people who ship"
            title="Everything here has an API."
            description="The same REST API your app already knows how to call: transactional email, contacts, audiences, and campaigns. One bearer key, JSON in, JSON out, machine-readable errors."
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={120} className="mt-12 grid gap-6 lg:grid-cols-2">
          <CodeCard
            label="Send your app's transactional email"
            code={transactionalSnippet}
            note="Returns immediately with an id and a status you can poll — queued → sent → delivered, or the bounce that explains why not."
          />
          <CodeCard
            label="Keep a contact in step with your app"
            code={contactSnippet}
            note="Signups, plan changes, churn. The same call creates or updates, so your webhook handler stays one line long."
          />
        </Reveal>

        <Reveal delay={180} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {apiFacts.map((fact) => (
            <div key={fact.title}>
              <p className="font-medium text-foreground">{fact.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {fact.body}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Migration, kept to the shape of it — the playbook lives on /features/api. */}
        <Reveal
          delay={220}
          className="mt-12 rounded-xl border border-border bg-oat/30 p-6 sm:p-8"
        >
          <h3 className="font-display text-2xl text-foreground">
            Moving a list in is three calls.
          </h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            day3 asks for your opt-outs and bounces, not just your active
            contacts — re-mailing people who left somewhere else is the fastest
            way to wreck a new domain&apos;s reputation.
          </p>
          <ol className="mt-6 space-y-4">
            {migrationCalls.map((step, index) => (
              <li key={step.call} className="flex gap-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--caramel)_14%,transparent)] text-xs font-semibold text-caramel">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <code className="block truncate font-mono text-sm text-foreground">
                    {step.call}
                  </code>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={260} className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/features/api" />}
            className="group"
          >
            See what the API covers
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

export { ApiProof };
