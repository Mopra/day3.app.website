import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { RelatedLinks } from "@/components/marketing/related-links";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { docsLinks, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Switch to day3: import, domain setup and a test send",
  description:
    "What moving your list to day3 looks like, in screenshots of the real app: add your sending domain, copy the DKIM, SPF and DMARC records, bring your list over in one click from beehiiv, Kit, Mailchimp or MailerLite (or a CSV), send a test.",
  path: "/migrate",
  ogEyebrow: "Migrate",
  ogTitle: "Moving to day3, screen by screen",
  keywords: [
    "migrate email list",
    "switch email marketing provider",
    "import subscribers csv",
    "move newsletter from beehiiv",
    "import from beehiiv",
    "beehiiv api import",
    "import from mailchimp",
    "email domain dkim spf dmarc setup",
  ],
});

/**
 * The walkthrough. Every screenshot is the live app (go.day3.app), taken from
 * a real account with the subscriber list hidden and the test recipient
 * replaced. When the app's screens change, retake them rather than keep a
 * frame that no longer matches what a new user sees.
 *
 * The domain goes first on purpose: DNS can take a while to show up, so it is
 * the step worth starting before anything else.
 */
const steps: {
  title: string;
  description: string;
  shot?: { src: string; width: number; height: number; alt: string };
}[] = [
  {
    title: "Add your sending domain",
    description:
      "Under Sending, add the domain you send from, plus the From name and address. If you're moving from another platform, reuse the subdomain you sent from there: inboxes remember how a subdomain has behaved, and a new one starts from zero.",
    shot: {
      src: "/product/migrate/add-domain.webp",
      width: 384,
      height: 504,
      alt: "The Add a sending domain dialog in day3, with fields for domain, From name and From email, and a note on reusing the subdomain from your old platform.",
    },
  },
  {
    title: "Copy the DKIM records to your DNS",
    description:
      "day3 shows each record as a card with its type, name and value, each with a copy button. Paste them in wherever your DNS lives. There's nothing to submit: day3 checks for the records itself and marks each one Found.",
    shot: {
      src: "/product/migrate/dns-records.webp",
      width: 1016,
      height: 760,
      alt: "The DNS records step for a domain in day3, listing DKIM CNAME records with copy buttons and a Found badge on each.",
    },
  },
  {
    title: "Add SPF and DMARC",
    description:
      "The third step adds a custom Return-Path (an MX record and an SPF TXT record) and a DMARC record. Your domain sends without them, but they help more of your mail land in the inbox, so add them while you're in your DNS anyway.",
    shot: {
      src: "/product/migrate/spf-dmarc.webp",
      width: 1016,
      height: 760,
      alt: "The Extra inbox protection step in day3, showing the Return-Path MX record and the SPF TXT record, both found.",
    },
  },
  {
    title: "Bring your list over in one click",
    description:
      "Coming from beehiiv, Kit, Mailchimp or MailerLite? Open an audience, choose Import from beehiiv & more, paste your API key and pick the publication or audience. The whole list comes over in the background: subscribers as subscribers, unsubscribed people as unsubscribed, and bounced or unconfirmed addresses skipped. No export, no file. From anywhere else, import a CSV: it needs an email column, any other column becomes a custom field, a status column carries unsubscribes over, and each provider's own export is read as it comes. Put the old bounce list on Suppressions first, so it stays blocked.",
    shot: {
      src: "/product/migrate/import-csv.webp",
      width: 1016,
      height: 310,
      alt: "An audience in day3 with the Import CSV button and the note on carrying opt-outs over from another platform. The subscriber list is hidden.",
    },
  },
  {
    title: "Send yourself a test",
    description:
      "Open a campaign and press Send test. It goes to up to five addresses you name, with [Test] in the subject line, through the same pipeline as a real send. Check it lands in the inbox, from your domain, before you send to anyone else.",
    shot: {
      src: "/product/migrate/test-send.webp",
      width: 488,
      height: 280,
      alt: "The Send a test email dialog in day3, with one recipient address filled in and a Send test button.",
    },
  },
];

const faqs = [
  {
    q: "Do I keep my sender reputation?",
    a: "Mostly, if you keep the same sending domain. Reputation sits with the domain, not the tool, so reuse the subdomain you sent from before and add day3's DKIM records to it.",
  },
  {
    q: "Will unsubscribed people be mailed again?",
    a: "No. The one-click import from beehiiv, Kit, Mailchimp or MailerLite brings unsubscribed people over as unsubscribed and skips bounced, complained and unconfirmed addresses. With a CSV, include the status column and rows marked unsubscribed import as unsubscribed. Someone who already unsubscribed in day3 stays unsubscribed even if the old tool still lists them as active.",
  },
  {
    q: "My list is bigger than 5,000 rows. What now?",
    a: "If it's on beehiiv, Kit, Mailchimp or MailerLite, use the API key import: it has no row limit and reads the whole list page by page. A CSV takes up to 5,000 rows per file, so split a bigger export and import the files one after another into the same audience. Re-importing an address doesn't create a duplicate.",
  },
  {
    q: "Do you keep my old provider's API key?",
    a: "No. It is used for that one import, stored encrypted only while the import runs, and deleted the moment it finishes or fails.",
  },
  {
    q: "Can I do all of this over the API?",
    a: "The list, yes: audiences, contacts and suppressions all have endpoints, and the docs have a step-by-step guide for moving a list that way. The sending domain is set up once, in the app.",
  },
  {
    q: "Does the test send cost anything?",
    a: "It counts against your monthly allowance like any email, since it's a real send. With five recipients at most, that's five emails.",
  },
];

export default function MigratePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Migrate", path: "/migrate" },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={howToSchema({
          name: "How to move an email list to day3",
          description:
            "Add a sending domain, set up DKIM, SPF and DMARC, import your list with one click from beehiiv, Kit, Mailchimp or MailerLite (or a CSV) and send a test email in day3.",
          steps,
        })}
      />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Migrate
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Moving to day3, screen by screen.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Five steps: your domain, its DNS records, your list, and a test
              email. Every picture below is the real app.
            </p>
          </Container>
        </section>

        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <ol className="mx-auto max-w-4xl space-y-16 sm:space-y-20">
              {steps.map((step, i) => (
                <Reveal key={step.title}>
                  <li className="grid gap-6 sm:grid-cols-[2.25rem_1fr]">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--caramel)_14%,transparent)] font-display text-lg text-caramel">
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                        {step.title}
                      </h2>
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      {step.shot && (
                        <figure className="mt-6">
                          <Image
                            src={step.shot.src}
                            width={step.shot.width}
                            height={step.shot.height}
                            alt={step.shot.alt}
                            sizes="(min-width: 1024px) 848px, 100vw"
                            className="h-auto max-w-full rounded-xl border border-border shadow-sm"
                          />
                        </figure>
                      )}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>

        {/* For people who'd rather script it */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Moving by API instead?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                The list part of the move works as API calls: create the
                audience, load suppressions, import contacts. The docs guide
                has the order and the requests.
              </p>
              <div className="mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  render={<a href={docsLinks.migrate.href} />}
                >
                  Read the API migration guide
                  <ExternalLink className="size-4" />
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Questions
              </h2>
              <dl className="mt-10 divide-y divide-border border-t border-border">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="grid gap-2 py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8"
                  >
                    <dt className="font-medium text-foreground">{faq.q}</dt>
                    <dd className="text-muted-foreground">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        <RelatedLinks
          refs={[
            "blog:migrate-email-list-without-losing-deliverability",
            "page:/deliverability",
            "page:/pricing",
            "page:/compare",
            "docs:migrate",
          ]}
          heading="Related reading"
          className="border-b border-border"
        />

        {/* CTA */}
        <section className="bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Rather we did the move with you?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Email{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-foreground underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>{" "}
              with where you&apos;re moving from, and we&apos;ll help you
              through it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Get started
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
