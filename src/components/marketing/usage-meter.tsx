"use client";

import * as React from "react";

import { Meter, MeterIndicator, MeterTrack } from "@/components/ui/meter";
import { Card } from "@/components/ui/card";

const SENT = 4382;
const CAP = 10000;
const DURATION = 1400;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Calm usage visual for the "$5 / 10,000 emails" plan. The count and the bar
 * animate up from zero the first time the card scrolls into view, so the
 * "meter fills as you send" idea is felt, not just described.
 * Unlimited subscribers, capped by sends.
 */
function UsageMeter() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setValue(SENT));
      return () => cancelAnimationFrame(frame);
    }

    let raf = 0;
    let started = false;

    const run = () => {
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const t = Math.min(1, (ts - start) / DURATION);
        setValue(Math.round(SENT * easeOutCubic(t)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round((value / CAP) * 100);

  return (
    <div ref={ref}>
      <Card className="p-6 sm:p-7">
        <Meter value={value} max={CAP}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Emails sent this month
              </p>
              <p className="mt-1 font-display text-3xl text-foreground tabular-nums">
                {value.toLocaleString("en-US")}
                <span className="text-muted-foreground">
                  {" "}
                  / {CAP.toLocaleString("en-US")}
                </span>
              </p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground tabular-nums">
              {pct}% used
            </span>
          </div>

          <MeterTrack className="mt-5">
            <MeterIndicator className="duration-700 ease-out" />
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
    </div>
  );
}

export { UsageMeter };
