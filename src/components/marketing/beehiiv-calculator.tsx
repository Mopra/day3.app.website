"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { siteConfig } from "@/lib/site";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  BEEHIIV_FREE_LIMIT,
  compare,
  crossoverFrequency,
  defaultScenario,
  sendStops,
  subscriberStops,
  type Billing,
  type Verdict,
} from "@/lib/beehiiv-comparison";
import { cn } from "@/lib/utils";

/**
 * The side-by-side cost calculator on /beehiiv-pricing-calculator.
 *
 * Two inputs and a billing toggle. beehiiv prices the list and ignores the
 * sends; day3 prices the sends and ignores the list. So the page needs both
 * numbers, and the answer turns on how often you write.
 *
 * All arithmetic lives in lib/beehiiv-comparison.ts, which the static table on
 * the page also reads, so the interactive and JS-off answers always agree.
 */

function indexOfStop(stops: readonly number[], value: number): number {
  const i = stops.indexOf(value);
  return i === -1 ? 0 : i;
}

function sliderValue(v: number | readonly number[]): number {
  return Array.isArray(v) ? v[0] : (v as number);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

function PriceColumn({
  name,
  price,
  lines,
  highlight,
  barPercent,
  note,
}: {
  name: string;
  price: string;
  lines: { label: string; value: string }[];
  highlight: boolean;
  barPercent: number;
  note?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-5 transition-colors",
        highlight
          ? "border-caramel/50 bg-[color-mix(in_srgb,var(--caramel)_8%,transparent)] ring-1 ring-caramel/30"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{name}</span>
        {highlight && (
          <span className="text-xs font-medium uppercase tracking-wide text-caramel">
            Cheaper
          </span>
        )}
      </div>

      <p className="mt-1 font-display text-4xl leading-none text-foreground tabular-nums sm:text-5xl">
        {price}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          /mo
        </span>
      </p>

      <div className="mt-4 h-2 w-full rounded-full bg-oat">
        <div
          className={cn(
            "h-2 rounded-full transition-[width] duration-500 ease-out",
            highlight ? "bg-caramel" : "bg-foreground/35",
          )}
          style={{ width: `${Math.max(barPercent, 2)}%` }}
        />
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4">
        {lines.map((line) => (
          <Stat key={line.label} label={line.label} value={line.value} />
        ))}
      </div>

      {note && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

function verdictLine(v: Verdict): string {
  if (v.winner === "unknown")
    return "One side is off its published price list here, so there's no honest number to compare.";
  if (v.winner === "tie") return "Dead heat. Both come to the same monthly bill.";

  const who = v.winner === "day3" ? "day3" : "beehiiv";
  const saving = v.savingUsd ? formatUsd(v.savingUsd) : "$0";
  const perYear = v.savingPerYearUsd ? ` (${formatUsd(v.savingPerYearUsd)} a year)` : "";
  return `${who} is ${saving}/mo cheaper${perYear}.`;
}

function sendsLabel(n: number): string {
  if (n === 30) return "Daily";
  if (n === 1) return "1 a month";
  return `${n} a month`;
}

export function BeehiivCalculator() {
  const [subsIndex, setSubsIndex] = React.useState(
    indexOfStop(subscriberStops, defaultScenario.subscribers),
  );
  const [sendsIndex, setSendsIndex] = React.useState(
    indexOfStop(sendStops, defaultScenario.sendsPerMonth),
  );
  const [billing, setBilling] = React.useState<Billing>(defaultScenario.billing);

  const scenario = {
    subscribers: subscriberStops[subsIndex],
    sendsPerMonth: sendStops[sendsIndex],
    billing,
  };

  const verdict = compare(scenario);
  const { beehiiv, day3 } = verdict;

  const beehiivPrice =
    beehiiv.priceUsd === null ? "Custom" : formatUsd(beehiiv.priceUsd);
  const day3Price = day3.priceUsd === null ? "Custom" : formatUsd(day3.priceUsd);

  const max = Math.max(beehiiv.priceUsd ?? 0, day3.priceUsd ?? 0, 1);
  const beehiivBar = ((beehiiv.priceUsd ?? 0) / max) * 100;
  const day3Bar = ((day3.priceUsd ?? 0) / max) * 100;

  const crossover =
    verdict.winner === "day3"
      ? crossoverFrequency(scenario.subscribers, billing)
      : null;

  const beehiivLines = [
    { label: "Cheapest plan that fits", value: beehiiv.label },
    { label: "Sends", value: "Unlimited on every plan" },
  ];
  if (beehiiv.proUsd !== null)
    beehiivLines.push({
      label: "Pro, same list",
      value: formatUsd(beehiiv.proUsd),
    });

  return (
    <Card className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
      <div className="grid gap-7 sm:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Subscribers</p>
          <p className="font-display text-2xl leading-none text-foreground tabular-nums">
            {formatCount(scenario.subscribers)}
          </p>
          <Slider
            aria-label="Subscribers"
            value={subsIndex}
            onValueChange={(v) => setSubsIndex(sliderValue(v))}
            min={0}
            max={subscriberStops.length - 1}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            Everyone on the list, mailed or not.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Sends</p>
          <p className="font-display text-2xl leading-none text-foreground tabular-nums">
            {sendsLabel(scenario.sendsPerMonth)}
          </p>
          <Slider
            aria-label="Sends to the whole list per month"
            value={sendsIndex}
            onValueChange={(v) => setSendsIndex(sliderValue(v))}
            min={0}
            max={sendStops.length - 1}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            Emails to the whole list each month.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">beehiiv billing</p>
          <div
            role="radiogroup"
            aria-label="beehiiv billing"
            className="inline-flex rounded-lg border border-border p-0.5"
          >
            {(["yearly", "monthly"] as const).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm capitalize transition-colors",
                  billing === b
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {b}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            day3 is monthly either way.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        That&apos;s{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatCount(verdict.totalEmails)}
        </span>{" "}
        emails a month. beehiiv bills the{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatCount(scenario.subscribers)}
        </span>{" "}
        subscribers; day3 bills the emails.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PriceColumn
          name="day3"
          price={day3Price}
          highlight={verdict.winner === "day3"}
          barPercent={day3Bar}
          lines={[
            { label: "Plan", value: day3.label },
            { label: "Subscribers", value: "Unlimited, always free" },
          ]}
          note="Billed by emails sent. The list can grow and the bill only moves if you send more."
        />

        <PriceColumn
          name="beehiiv"
          price={beehiivPrice}
          highlight={verdict.winner === "beehiiv"}
          barPercent={beehiivBar}
          lines={beehiivLines}
          note={
            scenario.subscribers <= BEEHIIV_FREE_LIMIT
              ? `beehiiv's Free plan holds up to ${formatCount(BEEHIIV_FREE_LIMIT)} subscribers. Paid features like the ad network and referral rewards start on Lite.`
              : "Billed by subscribers. The same price whether you send once or every day."
          }
        />
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-border pt-6 text-center">
        <p className="font-display text-xl text-foreground sm:text-2xl">
          {verdictLine(verdict)}
        </p>
        {verdict.winner === "beehiiv" ? (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            {scenario.subscribers <= BEEHIIV_FREE_LIMIT
              ? "Under 2,500 subscribers, beehiiv's free plan is hard to beat. Stay there until you outgrow it."
              : "beehiiv doesn't charge per send, so mailing a list daily is where a flat subscriber fee wins. Fewer sends a month and it flips back."}
          </p>
        ) : (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            day3 never charges for a subscriber, so the list can grow without the
            bill following it.
            {crossover
              ? ` With this list, beehiiv takes the lead at ${crossover} sends a month.`
              : ""}
          </p>
        )}
        <Button
          size="lg"
          className="w-full sm:w-auto"
          render={<a href={siteConfig.signupUrl} />}
        >
          Start free on day3
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
