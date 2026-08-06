"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToStillness(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Reasons to skip the animation and just show the outcome. */
function isStill() {
  return (
    window.matchMedia(REDUCED_MOTION).matches ||
    typeof IntersectionObserver === "undefined"
  );
}

/*
  On the server, and so in the HTML anyone reads with JS off or before
  hydration, every panel renders finished. It's the only frame that means
  anything on its own; a half-drawn one would be a bug in a crawler's eyes.
*/
const isStillOnServer = () => true;

type SequenceOptions = {
  /** Milliseconds between steps. */
  interval?: number;
  /** Milliseconds to hold the finished state before looping back to step 0. */
  hold?: number;
};

/**
 * Drives a small looping "something is happening" animation.
 *
 * Three rules, all of them about not being annoying:
 *  - it only runs while the panel is on screen, so a page of these costs
 *    nothing while you're reading a different one;
 *  - under `prefers-reduced-motion` it pins to the last step. The finished
 *    state is the message, the motion is garnish;
 *  - it loops rather than playing once, because a visitor who scrolls back
 *    up should see it happen too.
 */
function useSequence(
  count: number,
  { interval = 900, hold = 2600 }: SequenceOptions = {},
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  const still = React.useSyncExternalStore(
    subscribeToStillness,
    isStill,
    isStillOnServer,
  );

  React.useEffect(() => {
    const node = ref.current;
    if (!node || still) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setRunning(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [still]);

  React.useEffect(() => {
    if (!running || still) return;
    const finished = step >= count - 1;
    const timer = window.setTimeout(
      () => setStep(finished ? 0 : step + 1),
      finished ? hold : interval,
    );
    return () => window.clearTimeout(timer);
  }, [running, still, step, count, interval, hold]);

  return { ref, step: still ? count - 1 : step };
}

type LivePanelProps = {
  /** Chrome label: which part of the app this is a slice of. */
  title: string;
  /** Right-hand chrome detail (a record name, a campaign name, a count). */
  meta?: React.ReactNode;
  /**
   * The text alternative. The panel is a decoration built out of live DOM, so
   * it's `role="img"` with this as its label and its innards hidden, so a screen
   * reader gets one sentence instead of a stream of half-finished rows.
   */
  alt: string;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  children: React.ReactNode;
};

/**
 * The shared frame every animated panel sits in: a card with a strip of app
 * chrome across the top and a fixed body height, so a looping panel never
 * resizes the page under the reader.
 */
function LivePanel({ title, meta, alt, ref, className, children }: LivePanelProps) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_50px_-34px_color-mix(in_srgb,var(--espresso)_40%,transparent)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-olive animate-live-dot"
        />
        <span className="text-xs font-medium text-foreground">{title}</span>
        {meta ? (
          <span className="ml-auto truncate text-xs text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </div>

      <div aria-hidden="true" className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
}

type StepRowProps = {
  /** Whether this row has entered yet. */
  shown: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * A row that fades and lifts in on cue. Space is reserved whether or not the
 * row has arrived (opacity, not display), so the panel's height is fixed from
 * the first frame.
 */
function StepRow({ shown, className, children }: StepRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-all duration-500 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { useSequence, LivePanel, StepRow };
