import * as React from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { foundingOffer, siteConfig } from "@/lib/site";

/**
 * The headline pre-launch deal: a full year of the 10,000-emails/mo plan,
 * pre-paid at a founding rate. One prominent card with a single CTA that
 * routes through the normal signup flow.
 */
function FoundingOffer() {
  return (
    <Card className="relative overflow-hidden border-caramel/40 bg-card p-8 shadow-[0_1px_0_0_var(--oat),0_28px_56px_-30px_color-mix(in_srgb,var(--espresso)_32%,transparent)] ring-1 ring-caramel/30 sm:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_0%_0%,color-mix(in_srgb,var(--caramel)_10%,transparent),transparent_70%)]"
      />

      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--caramel)_16%,transparent)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground">
            Founding offer · pre-launch only
          </span>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-foreground">
              {foundingOffer.price}
            </span>
            <span className="text-lg text-muted-foreground">
              {foundingOffer.cadence}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {foundingOffer.monthlyEquivalent}.{" "}
            <span className="text-foreground">
              Normally {foundingOffer.regularPrice} a year — you save{" "}
              {foundingOffer.savings}.
            </span>
          </p>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            day3 is almost here. Lock in the founding rate now and start your
            first year the moment we go live.
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              render={<a href={siteConfig.signupUrl} />}
            >
              Become a founding member
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              {foundingOffer.renewalNote}
            </p>
          </div>
        </div>

        <ul className="space-y-3 rounded-xl border border-border bg-oat/40 p-6 text-sm">
          <li className="flex items-baseline gap-2.5 text-foreground">
            <Check className="size-4 shrink-0 translate-y-0.5 text-caramel" />
            <span>
              <span className="font-medium">{foundingOffer.emails}</span>{" "}
              {foundingOffer.emailsNote}
            </span>
          </li>
          <li className="flex items-baseline gap-2.5 text-foreground">
            <Check className="size-4 shrink-0 translate-y-0.5 text-caramel" />
            <span>{foundingOffer.total}</span>
          </li>
          <li className="flex items-baseline gap-2.5 text-foreground">
            <Check className="size-4 shrink-0 translate-y-0.5 text-caramel" />
            <span>Unlimited subscribers, always</span>
          </li>
          <li className="flex items-baseline gap-2.5 text-foreground">
            <Check className="size-4 shrink-0 translate-y-0.5 text-caramel" />
            <span>Campaigns, audiences &amp; simple analytics</span>
          </li>
          <li className="flex items-baseline gap-2.5 text-foreground">
            <Check className="size-4 shrink-0 translate-y-0.5 text-caramel" />
            <span>Your founding rate, locked in</span>
          </li>
        </ul>
      </div>
    </Card>
  );
}

export { FoundingOffer };
