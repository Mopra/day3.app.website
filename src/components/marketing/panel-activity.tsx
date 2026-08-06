"use client";

import * as React from "react";

import { LivePanel, StepRow, useSequence } from "@/components/marketing/live-panel";

/*
  A log tailing, one event per beat. The last two rows are the ones that earn
  the panel: a bounce and an unsubscribe both resolve themselves, which is the
  thing people are actually afraid of doing by hand.
*/
const events = [
  { label: "Delivered", who: "jane@acme.com", note: "", tone: "text-olive" },
  { label: "Opened", who: "sam@fjord.dev", note: "", tone: "text-olive" },
  { label: "Clicked", who: "sam@fjord.dev", note: "Read the changelog", tone: "text-caramel" },
  { label: "Bounced", who: "old@gone.io", note: "Suppressed", tone: "text-clay" },
  { label: "Unsubscribed", who: "ben@acme.com", note: "Removed", tone: "text-muted-foreground" },
];

/** One step per event, plus an empty first frame to start from. */
const STEPS = events.length + 1;

function PanelActivity() {
  const { ref, step } = useSequence(STEPS, { interval: 520, hold: 3000 });

  return (
    <LivePanel
      ref={ref}
      title="Activity"
      meta="All campaigns"
      alt="A live event log: delivered, opened and clicked events arriving per recipient, then a bounce suppressed automatically and an unsubscribe removed from the list."
    >
      <div className="space-y-1.5">
        {events.map((event, index) => (
          <StepRow
            key={event.label + event.who}
            shown={step > index}
            className="rounded-lg border border-border bg-background px-3 py-2"
          >
            <span className={`w-24 shrink-0 text-xs font-medium ${event.tone}`}>
              {event.label}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
              {event.who}
            </span>
            {event.note ? (
              <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                {event.note}
              </span>
            ) : null}
          </StepRow>
        ))}
      </div>
    </LivePanel>
  );
}

export { PanelActivity };
