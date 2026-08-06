"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { LivePanel, StepRow, useSequence } from "@/components/marketing/live-panel";

/*
  The three records a sending domain actually needs. Names are real shapes
  (SES-style DKIM selectors, an SPF include, a DMARC policy) rather than
  invented strings — anyone who has done this by hand should recognise them.
*/
const records = [
  { type: "CNAME", name: "s1._domainkey", note: "DKIM" },
  { type: "TXT", name: "@", note: "SPF" },
  { type: "TXT", name: "_dmarc", note: "DMARC" },
];

/*
  0 = idle, 1 = Cloudflare connected, 2-4 = each record written, 5 = all three
  flip to verified. The write and the verify are separate beats on purpose:
  publishing a record and DNS agreeing it exists are two different waits, and
  the panel is honest about that.
*/
const STEPS = records.length + 3;

function PanelDnsSync() {
  const { ref, step } = useSequence(STEPS, { interval: 700, hold: 2800 });
  const connected = step >= 1;
  const verified = step >= STEPS - 1;

  return (
    <LivePanel
      ref={ref}
      title="Sending domain"
      meta="news.acme.com"
      alt="day3 connected to Cloudflare, publishing the DKIM, SPF and DMARC records for news.acme.com, then showing the domain as verified."
    >
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors duration-500 motion-reduce:transition-none",
          connected ? "border-olive/40 bg-olive/10" : "border-border bg-background",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full transition-colors duration-500 motion-reduce:transition-none",
            connected ? "bg-olive" : "bg-muted-foreground/40",
          )}
        />
        <span className="text-sm text-foreground">
          {connected ? "Cloudflare connected" : "Connect Cloudflare"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {connected ? "Writing records…" : "One click"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {records.map((record, index) => {
          const written = step >= index + 2;
          return (
            <StepRow
              key={record.name}
              shown={written}
              className="rounded-lg border border-border bg-background px-3 py-2"
            >
              <span className="w-14 shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {record.type}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                {record.name}
              </span>
              {verified ? (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-olive">
                  <Check className="size-3.5" />
                  {record.note}
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
                  {record.note}
                </span>
              )}
            </StepRow>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-4 flex items-center justify-center rounded-lg py-2 text-sm font-medium transition-all duration-500 motion-reduce:transition-none",
          verified
            ? "bg-olive/15 text-olive opacity-100"
            : "bg-secondary/40 text-muted-foreground opacity-60",
        )}
      >
        {verified ? "Domain verified — ready to send" : "Checking DNS…"}
      </div>
    </LivePanel>
  );
}

export { PanelDnsSync };
