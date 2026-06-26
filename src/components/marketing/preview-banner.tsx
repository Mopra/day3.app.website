import * as React from "react";
import { Rocket } from "lucide-react";

import { Container } from "@/components/marketing/container";
import { SubscribeButton } from "@/components/marketing/subscribe-button";
import { siteConfig } from "@/lib/site";

/**
 * Slim notice that day3 is launching very soon and taking signups. The copy is
 * meant to create urgency, not deter people. Rendered only when
 * `siteConfig.isPreview` is true.
 */
function PreviewBanner() {
  if (!siteConfig.isPreview) return null;

  return (
    <div className="border-b border-border bg-[color-mix(in_srgb,var(--caramel)_12%,transparent)] text-foreground">
      <Container>
        <p className="flex items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
          <Rocket className="size-3.5 shrink-0 text-caramel" aria-hidden="true" />
          <span>{siteConfig.previewNote}</span>
          <SubscribeButton
            variant="link"
            className="h-auto p-0 text-xs font-medium text-foreground underline underline-offset-4 hover:text-caramel sm:text-sm"
          >
            Get launch updates
          </SubscribeButton>
        </p>
      </Container>
    </div>
  );
}

export { PreviewBanner };
