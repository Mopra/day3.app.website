import * as React from "react";
import { Check, Infinity as InfinityIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pricingTiers, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function PricingCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pricingTiers.map((tier) => (
        <Card
          key={tier.price}
          className={cn(
            "relative flex flex-col p-7",
            tier.featured
              ? "border-caramel/40 bg-card shadow-[0_1px_0_0_var(--oat),0_24px_48px_-28px_color-mix(in_srgb,var(--espresso)_30%,transparent)] ring-1 ring-caramel/30"
              : "",
          )}
        >
          {tier.featured ? (
            <Badge
              variant="accent"
              className="absolute -top-3 left-7 uppercase"
            >
              Most popular
            </Badge>
          ) : null}

          <div className="flex items-baseline gap-1">
            <span className="font-display text-5xl leading-none text-foreground">
              {tier.price}
            </span>
            <span className="text-base text-muted-foreground">
              {tier.cadence}
            </span>
          </div>

          <div className="mt-5">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {tier.emails}
            </p>
            <p className="text-sm text-muted-foreground">{tier.emailsNote}</p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {tier.blurb}
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2.5 text-foreground">
              <InfinityIcon className="size-4 shrink-0 text-caramel" />
              Unlimited subscribers
            </li>
            <li className="flex items-center gap-2.5 text-foreground">
              <Check className="size-4 shrink-0 text-caramel" />
              Campaigns &amp; audiences
            </li>
            <li className="flex items-center gap-2.5 text-foreground">
              <Check className="size-4 shrink-0 text-caramel" />
              Simple analytics
            </li>
            <li className="flex items-center gap-2.5 text-foreground">
              <Check className="size-4 shrink-0 text-caramel" />
              One-click unsubscribe
            </li>
          </ul>

          <div className="mt-7 pt-1">
            <Button
              variant={tier.featured ? "default" : "outline"}
              size="lg"
              className="w-full"
              render={<a href={siteConfig.signupUrl} />}
            >
              Start with {tier.price}/mo
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export { PricingCards };
