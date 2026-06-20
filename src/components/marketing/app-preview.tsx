import * as React from "react";
import { Send, Users, ChevronDown } from "lucide-react";

import { Logo } from "@/components/marketing/logo";

/**
 * Flat, calm mock of the day3 composer: write the email, choose the
 * audience, send. Decorative — hidden from assistive tech, with a text
 * alternative provided by the surrounding section.
 */
function AppPreview() {
  return (
    <div
      role="img"
      aria-label="The day3 composer: a campaign titled “What shipped in June” addressed to the Product updates audience of 3,180 subscribers, ready to send."
      className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_60px_-32px_color-mix(in_srgb,var(--espresso)_35%,transparent)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-clay/50" />
          <span className="size-3 rounded-full bg-caramel/50" />
          <span className="size-3 rounded-full bg-olive/50" />
        </div>
        <div className="ml-1 hidden sm:block">
          <Logo className="h-5" />
        </div>
        <div className="ml-auto rounded-md bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
          New campaign
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]" aria-hidden="true">
        {/* Sidebar */}
        <nav className="hidden flex-col gap-1 border-r border-border bg-secondary/30 p-3 sm:flex">
          {[
            { label: "Campaigns", active: true },
            { label: "Audiences", active: false },
            { label: "Analytics", active: false },
            { label: "Settings", active: false },
          ].map((item) => (
            <span
              key={item.label}
              className={
                "rounded-md px-3 py-2 text-sm " +
                (item.active
                  ? "bg-card font-medium text-foreground"
                  : "text-muted-foreground")
              }
            >
              {item.label}
            </span>
          ))}
          <div className="mt-auto rounded-md bg-card p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">4,382 / 10,000</p>
            <p className="mt-1">emails this month</p>
          </div>
        </nav>

        {/* Composer */}
        <div className="p-5 sm:p-7">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Audience
          </label>
          <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="size-4 text-caramel" />
              Product updates
              <span className="font-normal text-muted-foreground">
                · 3,180 subscribers
              </span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>

          <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Subject
          </label>
          <div className="mt-2 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground">
            What shipped in June
          </div>

          <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Message
          </label>
          <div className="mt-2 space-y-2 rounded-lg border border-border bg-background p-3.5 text-sm leading-relaxed text-foreground">
            <p>Hey — quick note on what we shipped this month.</p>
            <p className="text-muted-foreground">
              Faster imports, a cleaner editor, and a couple of fixes you asked
              for. Here are the highlights…
            </p>
            <div className="h-2" />
            <span className="inline-block h-2.5 w-3/5 rounded-full bg-oat" />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Draft saved · just now
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              <Send className="size-4" />
              Send campaign
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AppPreview };
