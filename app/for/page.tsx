import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { audiencePages } from "@/lib/audience-content";

export const metadata: Metadata = buildMetadata({
  title: "Who day3 is for",
  description:
    "day3 is built for small software teams sending product updates — startups, indie developers, and SaaS teams. Unlimited subscribers, billed by emails sent.",
  path: "/for",
  keywords: [
    "email tool for startups",
    "email tool for indie developers",
    "email tool for saas",
    "product update email tool",
  ],
});

export default function AudienceHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Who it's for", path: "/for" },
      ])} />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Who it&apos;s for
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Built for small software teams. Not marketing departments.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              If your job is shipping product and telling users about it, day3 is
              shaped for you. Find your situation below.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <div className="grid gap-5 md:grid-cols-3">
              {audiencePages.map((page, i) => {
                const Icon = page.icon;
                return (
                  <Reveal key={page.slug} delay={i * 80}>
                    <Link
                      href={`/for/${page.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="size-6 text-caramel transition-transform duration-200 group-hover:scale-110" />
                      <h2 className="mt-5 font-display text-2xl text-foreground">
                        {page.navLabel}
                      </h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                        {page.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                        See why
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              One model, whatever you&apos;re building.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Get started
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/how-it-works" />}
              >
                How it works
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
