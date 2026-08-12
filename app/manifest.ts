import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/**
 * Web app manifest. The icon set already existed in public/brand; nothing was
 * pointing at it, so the site had no installable identity and no maskable icon.
 *
 * `display: "browser"` on purpose: this is a marketing site, not the app. The
 * installable product lives at go.day3.app and ships its own manifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "day3 · email marketing billed by what you send",
    short_name: "day3",
    description: siteConfig.promise,
    start_url: "/",
    display: "browser",
    background_color: "#f7f1e8",
    theme_color: "#f7f1e8",
    lang: "en",
    icons: [
      { src: "/brand/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/icon-512.png", type: "image/png", sizes: "512x512" },
      {
        src: "/brand/icon-maskable-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
