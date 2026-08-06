"use client";

import * as React from "react";
import { Check, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { LivePanel, StepRow, useSequence } from "@/components/marketing/live-panel";

/*
  Four things a free account can finish, in the order it finishes them, and the
  one thing it can't. The lock at the end is the point of the whole panel: the
  paywall sits in exactly one place, and everything before it is already yours.
*/
const setup = [
  { label: "Sending domain", value: "news.acme.com" },
  { label: "Sender", value: "Jane from Acme" },
  { label: "Audience", value: "3,180 subscribers" },
  { label: "Campaign", value: "What shipped in June" },
];

/** Steps: 0 = empty, 1-4 = each setup row lands, 5 = the send gate lights up. */
const STEPS = setup.length + 2;

function PanelBuildMode() {
  const { ref, step } = useSequence(STEPS, { interval: 620, hold: 2800 });
  const gated = step >= STEPS - 1;

  return (
    <LivePanel
      ref={ref}
      title="Setup"
      meta="Free plan"
      alt="A free day3 account with its sending domain, sender, audience and first campaign all set up, and sending the only step still locked behind a paid plan."
    >
      <div className="space-y-2.5">
        {setup.map((item, index) => {
          const done = step > index;
          return (
            <StepRow
              key={item.label}
              shown={done}
              className="rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-olive/15">
                <Check className="size-3 text-olive" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="shrink-0 truncate text-sm font-medium text-foreground">
                {item.value}
              </span>
            </StepRow>
          );
        })}
      </div>

      {/* The gate. Same row shape as the four above, deliberately, so it reads as
          the fifth step, not as an ad bolted to the bottom. */}
      <div
        className={cn(
          "mt-4 flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 transition-colors duration-500 motion-reduce:transition-none",
          gated
            ? "border-caramel/60 bg-caramel/10"
            : "border-border bg-background",
        )}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-caramel/20">
          <Lock className="size-3 text-caramel" />
        </span>
        <span className="min-w-0 flex-1 text-sm text-muted-foreground">Send</span>
        <span
          className={cn(
            "shrink-0 text-sm font-medium transition-opacity duration-500 motion-reduce:transition-none",
            gated ? "text-foreground opacity-100" : "opacity-0",
          )}
        >
          Unlocks at $1/mo
        </span>
      </div>
    </LivePanel>
  );
}

export { PanelBuildMode };
