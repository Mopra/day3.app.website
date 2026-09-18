"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { siteConfig } from "@/lib/site";
import {
  campaignStops,
  compare,
  contactStops,
  crossoverFrequency,
  defaultScenario,
  formatCount,
  formatUsd,
  RESEND_FREE_DAILY_CAP,
  transactionalStops,
  type Verdict,
} from "@/lib/resend-comparison";
import { cn } from "@/lib/utils";

/**
 * The side-by-side cost calculator on /resend-pricing-calculator.
 *
 * Three inputs rather than the obvious two, because the two models don't share
 * an axis: day3 bills every email the same way, while Resend bills transactional
 * by send and marketing by how many contacts you store. You cannot price the
 * marketing half without knowing the list size, so the page asks for the list
 * and the cadence separately and derives the sends.
 *
 * All the arithmetic lives in lib/resend-comparison.ts, which the static table
 * further down the page also reads, so the interactive and the JS-off answers
 * can never disagree.
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

      {/* The bar is the part that reads in a screenshot. Both columns share a
          scale, so the gap between them is the whole argument. */}
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
    return "One side is off its published price list at this volume, so there's no honest number to compare.";
  if (v.winner === "tie") return "Dead heat. Both come to the same monthly bill.";

  const who = v.winner === "day3" ? "day3" : "Resend";
  const saving = v.savingUsd ? formatUsd(v.savingUsd) : "$0";
  const times = v.multiple ? ` (${v.multiple}× cheaper)` : "";
  return `${who} is ${saving}/mo cheaper${times}.`;
}

export function ResendCalculator() {
  const [txnIndex, setTxnIndex] = React.useState(
    indexOfStop(transactionalStops, defaultScenario.transactional),
  );
  const [contactsIndex, setContactsIndex] = React.useState(
    indexOfStop(contactStops, defaultScenario.contacts),
  );
  const [campaignsIndex, setCampaignsIndex] = React.useState(
    indexOfStop(campaignStops, defaultScenario.campaignsPerMonth),
  );

  const scenario = {
    transactional: transactionalStops[txnIndex],
    contacts: contactStops[contactsIndex],
    campaignsPerMonth: campaignStops[campaignsIndex],
  };

  const verdict = compare(scenario);
  const { resend, day3 } = verdict;

  const resendPrice =
    resend.totalUsd === null ? "Custom" : formatUsd(resend.totalUsd);
  const day3Price = day3.priceUsd === null ? "Custom" : formatUsd(day3.priceUsd);

  const max = Math.max(resend.totalUsd ?? 0, day3.priceUsd ?? 0, 1);
  const resendBar = ((resend.totalUsd ?? 0) / max) * 100;
  const day3Bar = ((day3.priceUsd ?? 0) / max) * 100;

  const campaignLabel =
    scenario.campaignsPerMonth === 0
      ? "None"
      : scenario.campaignsPerMonth === 1
        ? "1 a month"
        : `${scenario.campaignsPerMonth} a month`;

  // The honest footnote: Resend's marketing plan has no per-send charge, so
  // there is always a cadence where their flat fee wins. Say where it is rather
  // than letting a commenter find it.
  const crossover =
    verdict.winner === "day3" && scenario.contacts > 0
      ? crossoverFrequency(scenario.contacts, scenario.transactional)
      : null;

  const freeTierCaveat =
    scenario.transactional > 0 &&
    scenario.transactional <= 3_000 &&
    scenario.transactional / 30 > RESEND_FREE_DAILY_CAP
      ? `Resend's free plan also caps sending at ${RESEND_FREE_DAILY_CAP} a day, so this volume only fits if it's spread evenly.`
      : undefined;

  return (
    <Card className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
      <div className="grid gap-7 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Transactional emails</p>
          <p className="font-display text-2xl leading-none text-foreground tabular-nums">
            {formatCount(scenario.transactional)}
          </p>
          <Slider
            aria-label="Transactional emails per month"
            value={txnIndex}
            onValueChange={(v) => setTxnIndex(sliderValue(v))}
            min={0}
            max={transactionalStops.length - 1}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            Resets, receipts, alerts. Sent a month.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Marketing contacts</p>
          <p className="font-display text-2xl leading-none text-foreground tabular-nums">
            {formatCount(scenario.contacts)}
          </p>
          <Slider
            aria-label="Marketing contacts"
            value={contactsIndex}
            onValueChange={(v) => setContactsIndex(sliderValue(v))}
            min={0}
            max={contactStops.length - 1}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            People on the list you write to.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Campaigns</p>
          <p className="font-display text-2xl leading-none text-foreground tabular-nums">
            {campaignLabel}
          </p>
          <Slider
            aria-label="Campaigns per month"
            value={campaignsIndex}
            onValueChange={(v) => setCampaignsIndex(sliderValue(v))}
            min={0}
            max={campaignStops.length - 1}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            Sends to the whole list each month.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        That&apos;s{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatCount(verdict.marketingEmails)}
        </span>{" "}
        marketing emails and{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatCount(scenario.transactional)}
        </span>{" "}
        transactional ones:{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatCount(verdict.totalEmails)}
        </span>{" "}
        emails a month.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PriceColumn
          name="day3"
          price={day3Price}
          highlight={verdict.winner === "day3"}
          barPercent={day3Bar}
          lines={[
            { label: "One plan, both jobs", value: day3.label },
            { label: "Subscribers", value: "Unlimited, always free" },
          ]}
          note="Marketing and transactional come out of the same allowance, on one bill."
        />

        <PriceColumn
          name="Resend"
          price={resendPrice}
          highlight={verdict.winner === "resend"}
          barPercent={resendBar}
          lines={[
            {
              label: "Transactional",
              value:
                resend.sending.priceUsd === null
                  ? "Custom"
                  : `${formatUsd(resend.sending.priceUsd)} · ${resend.sending.label}`,
            },
            {
              label: "Marketing",
              value:
                resend.marketing.priceUsd === null
                  ? "Custom"
                  : `${formatUsd(resend.marketing.priceUsd)} · ${resend.marketing.label}`,
            },
          ]}
          note={
            freeTierCaveat ??
            "Two subscriptions: one billed by emails sent, one billed by contacts stored."
          }
        />
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-border pt-6 text-center">
        <p className="font-display text-xl text-foreground sm:text-2xl">
          {verdictLine(verdict)}
        </p>
        {verdict.winner === "resend" ? (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            Resend&apos;s marketing plan doesn&apos;t charge per send, so mailing
            a small list very often is where a flat contact fee wins. Move the
            campaign slider down, or the contact slider up, and it flips back.
          </p>
        ) : (
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            day3 puts both jobs in one bucket and never charges for a contact, so
            the list can grow without the bill following it.
            {crossover
              ? ` With this list, Resend takes the lead at ${crossover} campaigns a month.`
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
