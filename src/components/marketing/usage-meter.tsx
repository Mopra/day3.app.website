import * as React from "react";

import { Meter, MeterIndicator, MeterTrack } from "@/components/ui/meter";
import { Card } from "@/components/ui/card";

const SENT = 4382;
const CAP = 10000;

/**
 * Calm, flat usage visual for the "$5 / 10,000 emails" plan.
 * Unlimited subscribers, capped by sends.
 */
function UsageMeter() {
  const pct = Math.round((SENT / CAP) * 100);

  return (
    <Card className="p-6 sm:p-7">
      <Meter value={SENT} max={CAP}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Emails sent this month
            </p>
            <p className="mt-1 font-display text-3xl text-foreground">
              {SENT.toLocaleString("en-US")}
              <span className="text-muted-foreground">
                {" "}
                / {CAP.toLocaleString("en-US")}
              </span>
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {pct}% used
          </span>
        </div>

        <MeterTrack className="mt-5">
          <MeterIndicator />
        </MeterTrack>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Subscribers:{" "}
            <span className="font-medium text-foreground">unlimited</span>
          </span>
          <span className="text-muted-foreground">$5 / month</span>
        </div>
      </Meter>
    </Card>
  );
}

export { UsageMeter };
