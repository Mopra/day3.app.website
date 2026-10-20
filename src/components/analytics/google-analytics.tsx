import Script from "next/script";

const DATA_LAYER = "dataLayer";

/**
 * GA4, loaded after the page has finished loading.
 *
 * Replaces `GoogleAnalytics` from @next/third-parties, which fetches the 180 KB
 * gtag.js at high priority straight after hydration. On a throttled mobile
 * connection that download competed with the hero for bandwidth and was most
 * of what kept PageSpeed's mobile score down. The queue below is set up early
 * and costs nothing, so events sent before gtag.js arrives (an early CTA click)
 * are kept and replayed once it does.
 */
function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.${DATA_LAYER}=window.${DATA_LAYER}||[];function gtag(){window.${DATA_LAYER}.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
      <Script
        id="ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
    </>
  );
}

/** Queues a gtag call, e.g. `sendGAEvent("event", "signup_click", {...})`. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendGAEvent(..._args: unknown[]) {
  const w = window as unknown as Record<string, unknown[] | undefined>;
  w[DATA_LAYER] = w[DATA_LAYER] || [];
  // gtag reads the queue as `arguments` objects, not plain arrays.
  // eslint-disable-next-line prefer-rest-params
  w[DATA_LAYER]!.push(arguments);
}

export { GoogleAnalytics, sendGAEvent };
