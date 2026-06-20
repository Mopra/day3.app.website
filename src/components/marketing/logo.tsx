import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * day3 lockup (mark + wordmark), served from the brand kit. This is the
 * dark-ink version for light backgrounds; use `day3-lockup-light.svg` on dark
 * surfaces. Size it by setting a height class (e.g. `h-5`) — width scales to
 * keep the aspect ratio.
 */
function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/day3-lockup.svg"
      alt="day3"
      width={235}
      height={60}
      unoptimized
      className={cn("h-7 w-auto", className)}
    />
  );
}

export { Logo };
