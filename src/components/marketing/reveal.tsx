"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = React.ComponentProps<"div"> & {
  /** Delay before the transition starts, in ms — used to stagger siblings. */
  delay?: number;
};

/**
 * Fades + slides its children up the first time they scroll into view.
 * Pure CSS transition (see `.reveal` in globals.css); this only flips the
 * `is-visible` class via IntersectionObserver. Honors reduced-motion and
 * degrades to "always visible" where IO isn't available.
 */
function Reveal({ className, delay = 0, style, children, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (very old browsers): reveal on the next frame.
    // Reduced-motion is handled in CSS, which pins `.reveal` fully visible.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

export { Reveal };
