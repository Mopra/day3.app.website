import * as React from "react";

import { cn } from "@/lib/utils";

type CodeCardProps = {
  /** Chrome label — what this snippet does, in a few words. */
  label: string;
  /** The snippet itself. Rendered verbatim; keep lines short enough to read. */
  code: string;
  /** Optional line under the card, for what the snippet leaves unsaid. */
  note?: React.ReactNode;
  className?: string;
};

/**
 * The one deliberately dark surface on a cream page.
 *
 * Every snippet on the site goes through here, for two reasons. A code block
 * that reads as a terminal says who a section is written for before a word of it
 * is read — and having one component means a long line can only ever scroll
 * inside its own box, never drag the page sideways on a phone.
 *
 * Snippets are checked against the app's own reference (`src/lib/api-docs.ts`
 * and `docs/api-v1-spec.md` in the app repo) rather than written from memory. A
 * marketing page showing an endpoint that doesn't exist is worse than one
 * showing none.
 */
function CodeCard({ label, code, note, className }: CodeCardProps) {
  return (
    <figure className={cn("flex min-w-0 flex-col", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-espresso shadow-[0_24px_50px_-34px_color-mix(in_srgb,var(--espresso)_50%,transparent)]">
        <figcaption className="border-b border-white/10 px-4 py-2.5 text-xs font-medium text-cream/70">
          {label}
        </figcaption>
        <div className="overflow-x-auto p-4">
          <pre className="font-mono text-[0.78rem] leading-relaxed text-cream/90">
            <code>{code}</code>
          </pre>
        </div>
      </div>
      {note ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </figure>
  );
}

export { CodeCard };
