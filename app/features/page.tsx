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
import { featurePages } from "@/lib/features-content";

export const metadata: Metadata = buildMetadata({
  title: "Features — everything you need to send a good product email",
  description:
    "Campaigns, audiences, signup forms, deliverability, metrics, and an optional AI assistant. The parts you need to email your users — not the parts that come with a manual.",
  path: "/features",
  keywords: [
    "email marketing features",
    "newsletter tool features",
    "product update email tool",
    "email campaign software",
  ],
});

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Features", path: "/features" },
      ])} />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Features
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              The parts you need to send a good email.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Not the parts that come with a manual. Here&apos;s everything day3
              does — and, just as deliberately, the bloat it leaves out.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <div className="grid gap-5 sm:grid-cols-2">
              {featurePages.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.slug} delay={i * 80}>
                    <Link
                      href={`/features/${feature.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="size-6 text-caramel transition-transform duration-200 group-hover:scale-110" />
                      <h2 className="mt-5 font-display text-2xl text-foreground">
                        {feature.title}
                      </h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                        {feature.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                        Read more about {feature.navLabel.toLowerCase()}
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
              See it before you commit.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Sign up free to set everything up. Plans start at $1/mo when
              you&apos;re ready to send.
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
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/how-it-works" />}
              >
                How the pricing works
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
