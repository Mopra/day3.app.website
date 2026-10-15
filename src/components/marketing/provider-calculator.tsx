"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { siteConfig } from "@/lib/site";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  compare,
  crossoverFrequency,
  sendStops,
  type ProviderModel,
  type Verdict,
} from "@/lib/provider-comparison";
import { kitModel } from "@/lib/kit-comparison";
import { mailchimpModel } from "@/lib/mailchimp-comparison";
import { mailerliteModel } from "@/lib/mailerlite-comparison";
import { cn } from "@/lib/utils";

/**
 * The side-by-side cost calculator on the Kit, Mailchimp and MailerLite
 * pricing pages. The same design as the beehiiv calculator: two sliders and a
 * toggle. The provider prices the list; day3 prices the sends.
 *
 * Models carry functions, which can't cross the server/client boundary as
 * props, so the page passes a key and the model is looked up here.
 */

const models = {
  kit: kitModel,
  mailchimp: mailchimpModel,
  mailerlite: mailerliteModel,
} satisfies Record<string, ProviderModel>;

export type ProviderKey = keyof typeof models;

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
  prefix,
  lines,
  highlight,
  barPercent,
  note,
}: {
  name: string;
  price: string;
  prefix?: string;
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
        {prefix && (
          <span className="mr-1 text-base font-normal text-muted-foreground">
            {prefix}
          </span>
        )}
        {price}
        <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>
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
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{note}</p>
      )}
    </div>
  );
}

function verdictLine(v: Verdict, name: string): string {
  if (v.winner === "unknown")
    return "One side is off its published price list here, so there's no honest number to compare.";
  if (v.winner === "tie") return "Dead heat. Both come to the same monthly bill.";

  const who = v.winner === "day3" ? "day3" : name;
  const floor = v.savingIsFloor ? "at least " : "";
  const saving = v.savingUsd ? formatUsd(v.savingUsd) : "$0";
  const perYear = v.savingPerYearUsd
    ? ` (${floor}${formatUsd(v.savingPerYearUsd)} a year)`
    : "";
  return `${who} is ${floor}${saving}/mo cheaper${perYear}.`;
}

function sendsLabel(n: number): string {
  if (n === 30) return "Daily";
  if (n === 1) return "1 a month";
  return `${n} a month`;
}

export function ProviderCalculator({ provider }: { provider: ProviderKey }) {
  const model: ProviderModel = models[provider];
  const stops = model.subscriberStops;

  const [subsIndex, setSubsIndex] = React.useState(
    indexOfStop(stops, model.defaultSubscribers),
  );
  const [sendsIndex, setSendsIndex] = React.useState(indexOfStop(sendStops, 4));
  const [option, setOption] = React.useState(model.defaultOption);

  const scenario = {
    subscribers: stops[subsIndex],
    sendsPerMonth: sendStops[sendsIndex],
    option,
  };

  const verdict = compare(model, scenario);
  const { provider: quote, day3 } = verdict;

  const providerPrice = quote.priceUsd === null ? "Custom" : formatUsd(quote.priceUsd);
  const day3Price = day3.priceUsd === null ? "Custom" : formatUsd(day3.priceUsd);

  const max = Math.max(quote.priceUsd ?? 0, day3.priceUsd ?? 0, 1);
  const providerBar = ((quote.priceUsd ?? 0) / max) * 100;
  const day3Bar = ((day3.priceUsd ?? 0) / max) * 100;

  const crossover =
    verdict.winner === "day3"
      ? crossoverFrequency(model, scenario.subscribers, option)
      : null;

  const providerLines = [
    { label: "Cheapest plan that fits", value: quote.label },
    { label: "Sends", value: model.sendsLine(scenario.subscribers, option) },
  ];
  if (quote.alt)
    providerLines.push({ label: quote.alt.label, value: formatUsd(quote.alt.priceUsd) });

  const providerFree = quote.priceUsd === 0;

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
            max={stops.length - 1}
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
          <p className="text-sm text-muted-foreground">{model.optionsLabel}</p>
          <div
            role="radiogroup"
            aria-label={model.optionsLabel}
            className="inline-flex rounded-lg border border-border p-0.5"
          >
            {model.options.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={option === o.id}
                onClick={() => setOption(o.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  option === o.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <p className="max-w-[12rem] text-xs text-muted-foreground">
            {model.optionsNote}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        That&apos;s{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatCount(verdict.totalEmails)}
        </span>{" "}
        emails a month. {model.name} bills the{" "}
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
          name={model.name}
          price={providerPrice}
          prefix={quote.lowerBound ? "from" : undefined}
          highlight={verdict.winner === "provider"}
          barPercent={providerBar}
          lines={providerLines}
          note={model.columnNote(scenario.subscribers, quote)}
        />
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-border pt-6 text-center">
        <p className="font-display text-xl text-foreground sm:text-2xl">
          {verdictLine(verdict, model.name)}
        </p>
        {verdict.winner === "provider" ? (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            {providerFree
              ? `${model.name}'s free plan covers this list. Stay there until you outgrow it, or until you need what it leaves out.`
              : `${model.name}'s flat subscriber price wins when a list is mailed this often. Fewer sends a month and it flips back.`}
          </p>
        ) : (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            day3 never charges for a subscriber, so the list can grow without the
            bill following it.
            {crossover
              ? ` With this list, ${model.name} takes the lead at ${crossover} sends a month.`
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
