"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { LivePanel, useSequence } from "@/components/marketing/live-panel";

const RECIPIENTS = 3180;
const DELIVERED = 3166;

/* Many small steps rather than a few big ones. This is the one panel where
   the motion is a number climbing, and it has to climb rather than jump. */
const STEPS = 26;

const format = (value: number) => value.toLocaleString("en-US");

function PanelSending() {
  const { ref, step } = useSequence(STEPS, { interval: 110, hold: 2600 });

  const progress = step / (STEPS - 1);
  const sent = Math.round(RECIPIENTS * progress);
  /* Delivery confirmations trail the send, since SES answers after we've handed the
     message over, so the second number is always chasing the first. */
  const settled = Math.max(0, (progress - 0.12) / 0.88);
  const delivered = Math.round(DELIVERED * settled);
  const done = step >= STEPS - 1;

  return (
    <LivePanel
      ref={ref}
      title="Sending"
      meta="What shipped in June"
      alt="A campaign sending to 3,180 recipients in batches, with delivery confirmations arriving behind the send and finishing at 3,166 delivered."
    >
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl tabular-nums text-foreground">
          {format(sent)}
        </span>
        <span className="text-sm text-muted-foreground">
          of {format(RECIPIENTS)} sent
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-caramel transition-[width] duration-150 ease-linear motion-reduce:transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-background px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Delivered</p>
          <p className="mt-0.5 text-lg font-medium tabular-nums text-foreground">
            {format(delivered)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Batch</p>
          <p className="mt-0.5 text-lg font-medium tabular-nums text-foreground">
            {done ? "Done" : "25 at a time"}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 flex items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors duration-500 motion-reduce:transition-none",
          done ? "bg-olive/15 text-olive" : "bg-secondary/40 text-muted-foreground",
        )}
      >
        {done ? "Sent. Nothing left to babysit" : "Sending…"}
      </div>
    </LivePanel>
  );
}

export { PanelSending };
