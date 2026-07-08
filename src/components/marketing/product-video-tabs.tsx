"use client";

import * as React from "react";
import { CheckCircle2, MousePointerClick, ShieldCheck, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Write updates",
    headline: "Write the thing you just shipped.",
    description:
      "Draft updates, changelogs, and launch notes in a focused composer — no blank marketing tool to fight.",
    video:
      "Show a campaign being created: sender, audience, subject, preview text, simple email sections, and a test send.",
    icon: MousePointerClick,
  },
  {
    label: "Grow the list",
    headline: "Collect the people who want updates.",
    description:
      "Publish a signup form, embed it on your site, and subscribers land in an audience — double opt-in by default.",
    video:
      "Show a signup form being styled, fields added, an embed or hosted link copied, and a new subscriber landing in an audience.",
    icon: CheckCircle2,
  },
  {
    label: "Send safely",
    headline: "Send from your domain, safety handled.",
    description:
      "Verified domains, unsubscribe links, bounce handling, and risk review — the boring safety work, done for you.",
    video:
      "Show DNS verification, a verified sender, campaign submission, risk review, and send gates before launch.",
    icon: ShieldCheck,
  },
  {
    label: "See results",
    headline: "Know what happened after you hit send.",
    description:
      "Delivery, opens, clicks, and unsubscribes — the numbers that matter, no reporting suite to dig through.",
    video:
      "Show campaign results, account metrics, reputation indicators, and the Activity log for a specific recipient.",
    icon: BarChart3,
  },
];

export function ProductVideoTabs() {
  const [active, setActive] = React.useState(0);
  const tab = tabs[active];
  const Icon = tab.icon;

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
      <div className="grid gap-2 sm:grid-cols-4" role="tablist" aria-label="Product video sections">
        {tabs.map((item, index) => (
          <Button
            key={item.label}
            type="button"
            variant={active === index ? "default" : "ghost"}
            className={cn(
              "justify-start rounded-xl sm:justify-center",
              active !== index && "text-muted-foreground",
            )}
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 rounded-xl border border-border bg-background p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex size-10 items-center justify-center rounded-full bg-caramel/15 text-caramel">
            <Icon className="size-5" />
          </div>
          <h3 className="mt-5 font-display text-2xl leading-tight text-foreground sm:text-3xl">
            {tab.headline}
          </h3>
          <p
            className="mt-4 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: tab.description }}
          />
        </div>

        <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-border bg-oat/40 p-5">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(70%_90%_at_50%_0%,color-mix(in_srgb,var(--caramel)_18%,transparent),transparent)]" />
          <div className="relative flex h-full flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Product video should show
              </p>
              <p className="mt-3 text-lg leading-relaxed text-foreground">
                {tab.video}
              </p>
            </div>
            <div className="mt-8 space-y-2" aria-hidden="true">
              <div className="h-2.5 w-4/5 rounded-full bg-oat" />
              <div className="h-2.5 w-3/5 rounded-full bg-oat" />
              <div className="mt-5 flex gap-2">
                <div className="h-9 flex-1 rounded-md bg-secondary" />
                <div className="h-9 w-24 rounded-md bg-caramel/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
