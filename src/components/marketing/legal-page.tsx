import * as React from "react";

import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

type LegalSection = {
  heading: string;
  body: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Container className="max-w-3xl py-16 sm:py-20">
          <header className="border-b border-border pb-8">
            <h1 className="font-display text-4xl text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated {updated}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
          </header>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

export { LegalPage };
