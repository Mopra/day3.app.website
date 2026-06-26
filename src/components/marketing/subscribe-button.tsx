import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/**
 * A button that opens day3's own subscribe form in a popup. The data attributes
 * are picked up by embed.js (loaded once in the root layout) — no React state or
 * onClick needed; the embed delegates the click handling itself. Accepts every
 * `Button` prop, so it styles exactly like any other CTA on the site.
 */
function SubscribeButton({
  children = "Get launch updates",
  ...props
}: ButtonProps) {
  return (
    <Button
      data-day3-form={siteConfig.subscribeFormId}
      data-day3-mode="popup"
      {...props}
    >
      {children}
    </Button>
  );
}

export { SubscribeButton };
