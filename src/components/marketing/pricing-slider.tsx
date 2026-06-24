"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Check, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { pricingTiers, siteConfig, type PricingTier } from "@/lib/site";
import { cn } from "@/lib/utils";

// The headline differentiators per tier. Every day3 feature is on every plan,
// so the comparison stays honest about the only two axes that move: the monthly
// send allowance and, from the 10k tier up, the AI writing assistant.
function tierFeatures(tier: PricingTier): { ok: boolean; label: string }[] {
  return [
    { ok: true, label: `Send up to ${tier.emails}/mo` },
    tier.ai
      ? { ok: true, label: "AI writing assistant" }
      : { ok: false, label: "AI on the 10k plan & up" },
    { ok: true, label: "Unlimited subscribers" },
    { ok: true, label: "Everything else included" },
  ];
}

// Fixed card width (in rem) — the scroll padding centers the active card by
// reserving half the leftover track width on each side, so the first and last
// cards can both sit dead-center with their neighbors peeking in.
const CARD_W_REM = 18; // matches w-72

// Open the carousel on the "most popular" tier so the recommended pick sits in
// focus; fall back to the first tier if none is flagged.
const POPULAR_INDEX = Math.max(
  0,
  pricingTiers.findIndex((t) => t.popular),
);

/**
 * The plan picker as a focus carousel, mirroring the in-app billing slider. Day3
 * sells sending bandwidth, so the only axis that changes is the monthly email
 * allowance — the visitor slides along the ladder ("how many emails per month?",
 * $1 → $49) and the matching tier card snaps into focus below, scaled up while
 * its neighbors dim. The slider and the horizontal scroll position are two views
 * of the same focused index: dragging the slider scrolls the track, and
 * scrolling the track moves the slider. The focused card's CTA sends visitors to
 * sign up — there's no billing here, just the marketing view of the same ladder.
 */
export function PricingSlider() {
  const [index, setIndex] = useState(POPULAR_INDEX);
  // Mirror of `index` for the resize/init handlers to read without re-subscribing.
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // True while we're animating the track ourselves (slider drag / card click),
  // so the scroll listener doesn't fight the slider by re-deriving the index
  // from the in-flight scroll position. Cleared shortly after it settles.
  const syncing = useRef(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef<number | null>(null);

  // Scroll the track so card `i` sits centered. getBoundingClientRect keeps this
  // correct regardless of the card's offset parent or the current scroll position.
  const centerOn = useCallback((i: number, behavior: ScrollBehavior) => {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[i];
    if (!scroller || !card) return;
    const sRect = scroller.getBoundingClientRect();
    const cRect = card.getBoundingClientRect();
    const delta = cRect.left + cRect.width / 2 - (sRect.left + sRect.width / 2);
    if (Math.abs(delta) < 1) return;
    syncing.current = true;
    scroller.scrollTo({ left: scroller.scrollLeft + delta, behavior });
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      syncing.current = false;
    }, 700);
  }, []);

  // Move focus from an explicit pick (slider drag, card or "Select" click): set
  // the index immediately so the slider thumb tracks 1:1, then glide the track.
  const focusTo = useCallback(
    (i: number) => {
      setIndex(i);
      centerOn(i, "smooth");
    },
    [centerOn],
  );

  // While the user scrolls the track directly, derive the focused index from the
  // card nearest the track's center.
  const onScroll = useCallback(() => {
    if (syncing.current || raf.current != null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const sRect = scroller.getBoundingClientRect();
      const center = sRect.left + sRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex((prev) => (prev === best ? prev : best));
    });
  }, []);

  // Center the initial tier before the first paint — synchronous (no rAF) so the
  // track never flashes at scrollLeft 0, and idempotent so React's double-invoke
  // in development is harmless. Card refs are set during commit, before layout
  // effects, so the measurement is ready here.
  useLayoutEffect(() => {
    centerOn(indexRef.current, "auto");
  }, [centerOn]);

  // Keep the focused card centered across viewport resizes.
  useEffect(() => {
    const onResize = () => centerOn(indexRef.current, "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [centerOn]);

  useEffect(
    () => () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    },
    [],
  );

  const tier = pricingTiers[index];
  const lastIndex = pricingTiers.length - 1;

  return (
    <Card className="mx-auto max-w-2xl space-y-7 p-6 sm:p-8">
      {/* Big live readout of the focused tier — slide to change it. */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              How many emails do you send per month?
            </p>
            <p className="mt-0.5 font-display text-3xl text-foreground tabular-nums sm:text-4xl">
              {tier.emails}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                emails / mo
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{tier.name} plan</p>
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {tier.price}
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            </p>
          </div>
        </div>

        <Slider
          aria-label="Monthly email volume"
          value={index}
          onValueChange={(v) => focusTo(Array.isArray(v) ? v[0] : (v as number))}
          min={0}
          max={lastIndex}
          step={1}
        />

        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{pricingTiers[0].emails} / mo</span>
          <span>{pricingTiers[lastIndex].emails} / mo</span>
        </div>
      </div>

      {/* The focus carousel: every tier, scaled up when in focus, dimmed
          otherwise. Edge gradients fade the peeking neighbors into the page. */}
      <div className="relative -mx-4">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          // Pad each side by half the leftover track width so the first and last
          // cards can sit centered (kept in lockstep with CARD_W_REM).
          style={{
            paddingInline: `max(1rem, calc(50% - ${CARD_W_REM / 2}rem))`,
          }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden py-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pricingTiers.map((t, i) => {
            const active = i === index;
            const isPopular = Boolean(t.popular);

            return (
              <div
                key={t.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => !active && focusTo(i)}
                style={{ width: `${CARD_W_REM}rem` }}
                className={cn(
                  // In Tailwind v4 the scale/lift use the standalone `scale` and
                  // `translate` properties, so they must be named in the
                  // transition (a bare `transform` wouldn't animate them). The
                  // easeOutQuint-ish curve settles the focus change smoothly
                  // alongside the scroll.
                  "relative flex shrink-0 snap-center flex-col rounded-2xl border bg-card p-5 transition-[scale,translate,opacity,box-shadow,border-color] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
                  active
                    ? cn(
                        "-translate-y-1 scale-100 opacity-100 shadow-xl",
                        isPopular
                          ? "border-caramel/50 ring-1 ring-caramel/40"
                          : "border-foreground/25",
                      )
                    : "scale-90 cursor-pointer border-border opacity-45 hover:opacity-70",
                )}
              >
                {isPopular && (
                  <Badge variant="accent" className="absolute right-4 top-4">
                    Most popular
                  </Badge>
                )}

                <div className="text-sm font-medium text-muted-foreground">
                  {t.name}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-4xl leading-none text-foreground">
                    {t.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <div className="mt-1.5 text-sm text-muted-foreground">
                  {t.emails} emails / month
                </div>

                <ul className="mt-4 space-y-1.5 text-sm">
                  {tierFeatures(t).map((f) => (
                    <li
                      key={f.label}
                      className={cn(
                        "flex items-center gap-2",
                        f.ok
                          ? "text-foreground"
                          : "text-muted-foreground/60",
                      )}
                    >
                      {f.ok ? (
                        <Check
                          className="size-4 shrink-0 text-caramel"
                          aria-hidden
                        />
                      ) : (
                        <Minus className="size-4 shrink-0" aria-hidden />
                      )}
                      {f.label}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex-1" />
                {/* The real CTA only lives on the focused card; the others show a
                    "Select" that brings them into focus first. */}
                {active ? (
                  <Button
                    size="sm"
                    className="w-full"
                    render={<a href={siteConfig.signupUrl} />}
                  >
                    Get started
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    tabIndex={-1}
                    onClick={() => focusTo(i)}
                  >
                    Select
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent" />
      </div>
    </Card>
  );
}
