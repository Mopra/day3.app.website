import * as React from "react";
import { Sparkles } from "lucide-react";

import { Container } from "@/components/marketing/container";
import { siteConfig } from "@/lib/site";

/**
 * Slim notice that day3 is still in preview. Signup stays open — the copy is
 * meant to set expectations, not deter people from trying it. Rendered only
 * when `siteConfig.isPreview` is true.
 */
function PreviewBanner() {
  if (!siteConfig.isPreview) return null;

  return (
    <div className="border-b border-border bg-[color-mix(in_srgb,var(--caramel)_12%,transparent)] text-foreground">
      <Container>
        <p className="flex items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
          <Sparkles className="size-3.5 shrink-0 text-caramel" aria-hidden="true" />
          <span>{siteConfig.previewNote}</span>
        </p>
      </Container>
    </div>
  );
}

export { PreviewBanner };
