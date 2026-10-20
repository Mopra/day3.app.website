"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { sendGAEvent } from "@/components/analytics/google-analytics";
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
 * 2. UTM parameters describing where the click came from, plus the visitor's GA
 *    client id (`ga_cid`) on signup links. The app is a separate origin
 *    (go.day3.app) with no GA tag; it reports a completed signup to this GA4
 *    property from its server under that id (day3.app repo,
 *    src/services/signup-analytics.ts), so GA4 can credit the page that earned
 *    it. The `/email-api` landing page tags its own UTMs by hand; those are left
 *    alone, but still get the client id.
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
 * This visitor's GA4 client id, read from the `_ga` cookie ("GA1.1.<id>.<ts>").
 * The app reports a completed signup server-side under this id, which is how
 * GA4 joins the signup to the visit that led to it. Null before GA has set it.
 */
function gaClientId(): string | null {
  const match = document.cookie.match(/(?:^|; )_ga=GA\d\.\d\.(\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Adds attribution to an app URL without disturbing tags it already carries.
 * Returns null when nothing needs changing, so the common path does no work.
 */
function tag(
  rawHref: string,
  pathname: string,
  placement: string,
  clientId: string | null,
): string | null {
  let url: URL;
  try {
    url = new URL(rawHref);
  } catch {
    return null;
  }
  if (url.host !== APP_HOST) return null;
  let changed = false;

  // Hand-tagged links (the /email-api ad landing page) keep their UTMs as written.
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", "day3-website");
    url.searchParams.set("utm_medium", "cta");
    url.searchParams.set("utm_campaign", placement);
    // The page that earned the click, which is the number this whole exercise
    // exists to produce.
    url.searchParams.set("utm_content", pathname);
    changed = true;
  }
  if (clientId && !url.searchParams.has("ga_cid")) {
    url.searchParams.set("ga_cid", clientId);
    changed = true;
  }
  return changed ? url.toString() : null;
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
      const tagged = tag(
        new URL(href, window.location.origin).toString(),
        path,
        placement,
        // Only a signup needs the id: the app reads it on /sign-up.
        isLogin ? null : gaClientId(),
      );
      if (tagged) anchor.setAttribute("href", tagged);
    }

    // Capture phase: runs before anything that might stop propagation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export { CtaTracking };
