import * as React from "react";
import Link from "next/link";

import { Container } from "@/components/marketing/container";
import { company } from "@/lib/site";

/**
 * The honest stand-in for social proof, at the size the doubt deserves.
 *
 * A brand-new product has no logo wall, and a low price makes that gap louder
 * rather than quieter — $1/month from an unknown name reads as "toy" until
 * something says otherwise. Faking it is off the table, so this answers with the
 * two facts that carry furthest in the least room: a named person with a track
 * record you can go and read, and where the data lives.
 *
 * Deliberately a bar and not a section. It's a footnote to the pitch, not a
 * chapter of it — the long version, including the registered company and its CVR
 * number, is the job of /about. Same hairline-separator device as the hero's
 * price row, so the page reads as one voice.
 */
const facts = [
  <>
    Built by {company.founder} — also{" "}
    <a
      href={company.alsoBuilds.href}
      className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
      target="_blank"
      rel="noopener noreferrer"
    >
      {company.alsoBuilds.name}
    </a>
  </>,
  <>Hosted in the EU</>,
];

function Provenance() {
  return (
    <section className="border-t border-border bg-card">
      <Container className="py-5">
        <ul className="flex flex-col items-center justify-center gap-y-1.5 text-center text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
          {facts.map((fact, index) => (
            <li
              key={index}
              className="sm:border-l sm:border-border sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              {fact}
            </li>
          ))}
          <li className="sm:border-l sm:border-border sm:pl-5">
            <Link
              href="/about"
              className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
            >
              About day3
            </Link>
          </li>
        </ul>
      </Container>
    </section>
  );
}

export { Provenance };
