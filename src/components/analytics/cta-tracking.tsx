"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";

import { siteConfig } from "@/lib/site";

/**
 * Conversion tracking for every link that leaves the marketing site for the app.
 *
 * Why a delegated listener rather than an onClick on each button: there are ~25
 * call sites that render `<a href={siteConfig.signupUrl}>`, spread across every
 * page template, and a tracking prop on each one is a prop that the next new
 * page forgets. A single capture-phase listener on the document cannot be
 * forgotten, and it also catches the links inside content modules, which are
 * plain data and have nowhere to hang a handler.
 *
 * Two things happen on the way out:
 *
 * 1. A `signup_click` event, so GA4 finally has a conversion to mark as a key
 *    event. Before this the property collected only the eight automatic events,
 *    which is why every report read "0 key events" no matter how the traffic
 *    moved.
 *
 * 2. UTM parameters describing where the click came from. The app is a separate
 *    origin (go.day3.app) with its own analytics, so the referring page is the
 *    only way it can attribute a signup back to the page that earned it. The
 *    `/email-api` landing page already tagged its own CTAs by hand; this does
 *    the same for the rest of the site, and leaves an existing tag alone.
 */

/** Host of the app, derived so it cannot drift from the configured URL. */
const APP_HOST = new URL(siteConfig.signupUrl).host;

/** A stable, low-cardinality name for where on the page the click happened. */
function placementOf(anchor: HTMLAnchorElement): string {
  // Prefer an explicit annotation when a call site cares to give one.
  const explicit = anchor.closest<HTMLElement>("[data-cta-placement]");
  if (explicit?.dataset.ctaPlacement) return explicit.dataset.ctaPlacement;

  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  // The last CTA band on a long page is the one worth distinguishing, because it
  // measures whether the page held someone all the way down.
  if (anchor.closest("[data-cta-band]")) return "closing-cta";
  return "in-page";
}

/**
 * Adds attribution to an app URL without disturbing one that already carries it.
 * Returns null when nothing needs changing, so the common path does no work.
 */
function tag(rawHref: string, pathname: string, placement: string): string | null {
  let url: URL;
  try {
    url = new URL(rawHref);
  } catch {
    return null;
  }
  if (url.host !== APP_HOST) return null;
  // Hand-tagged links (the /email-api ad landing page) stay exactly as written.
  if (url.searchParams.has("utm_source")) return null;

  url.searchParams.set("utm_source", "day3-website");
  url.searchParams.set("utm_medium", "cta");
  url.searchParams.set("utm_campaign", placement);
  // The page that earned the click, which is the number this whole exercise
  // exists to produce.
  url.searchParams.set("utm_content", pathname);
  return url.toString();
}

function CtaTracking() {
  const pathname = usePathname() ?? "/";
  // Lets the listener read the live path without re-subscribing on navigation.
  const pathRef = React.useRef(pathname);
  React.useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let host: string;
      try {
        host = new URL(href, window.location.origin).host;
      } catch {
        return;
      }
      if (host !== APP_HOST) return;

      const path = pathRef.current;
      const placement = placementOf(anchor);
      const isLogin = new URL(href, window.location.origin).pathname.startsWith("/login");

      /*
        Log in and sign up are different intents and must not share a conversion.
        Counting a returning user's log-in as a signup would inflate the only
        number we are trying to start trusting.
      */
      sendGAEvent("event", isLogin ? "login_click" : "signup_click", {
        placement,
        page_path: path,
      });

      // Rewrite in place so the navigation the browser is already performing
      // carries the tags. Skipped for a modified click, which is not this tab's
      // navigation to change.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const tagged = tag(new URL(href, window.location.origin).toString(), path, placement);
      if (tagged) anchor.setAttribute("href", tagged);
    }

    // Capture phase: runs before anything that might stop propagation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export { CtaTracking };
