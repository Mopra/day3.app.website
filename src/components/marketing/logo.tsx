import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * day3 wordmark. The "3" is set in the marketing serif and tinted caramel
 * for a small, warm moment of brand — restrained, not decorative.
 */
function Logo({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      day
      <span className="font-display text-[1.35em] leading-none text-caramel">
        3
      </span>
    </span>
  );
}

export { Logo };
