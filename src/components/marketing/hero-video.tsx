"use client";

import * as React from "react";
import { preload } from "react-dom";

import { cn } from "@/lib/utils";

type HeroVideoProps = {
  /** Basename under /public/video, without extension, e.g. "hero-aqueduct-weir". */
  name: string;
  /**
   * What the loop depicts. Not rendered (the video is decorative), but kept as a
   * required prop so every page has to say out loud what its scene is about.
   */
  scene: string;
  /**
   * Paper-grain opacity, 0-100. Heavy ink plates can carry a lot of grain; a
   * pale watercolour study turns muddy well before that, so this is per-scene
   * rather than a constant.
   */
  grain?: number;
  className?: string;
};

/**
 * Full-bleed ambient loop behind a page hero.
 *
 * The artwork is cream-on-ink, so a scrim fades it into `--background` at the
 * top (where the copy sits) and again at the very bottom (so the section joins
 * the page seamlessly). Decorative: `aria-hidden`, no controls, no audio track.
 *
 * Motion is opt-in rather than declarative. `autoPlay` is deliberately absent
 * so that `prefers-reduced-motion` viewers keep the poster frame as a still
 * image. Playback also pauses while scrolled out of view to save battery.
 *
 * Loading order is tuned for PageSpeed on mobile. The poster is the hero's
 * largest paint, so it is preloaded at high priority. The clip and the paper
 * grain wait for the page's load event, so neither competes with the copy,
 * fonts and poster for a slow connection. The grain fades in when it arrives.
 */
function HeroVideo({ name, scene, grain = 55, className }: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  preload(`/video/${name}.webp`, { as: "image", fetchPriority: "high" });

  React.useEffect(() => {
    const onLoad = () => setLoaded(true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return; // poster frame only

    let observer: IntersectionObserver | undefined;

    const start = () => {
      // Only play while at least partly on screen.
      if (typeof IntersectionObserver === "undefined") {
        void video.play().catch(() => {});
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) void video.play().catch(() => {});
            else video.pause();
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(video);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-scene={scene}
      // `isolate` keeps the grain layer's multiply blend inside this stacking
      // context, so it darkens the clip and nothing else on the page.
      className={cn("pointer-events-none absolute inset-0 -z-10 isolate overflow-hidden", className)}
    >
      {/*
        Full width at the artwork's own aspect ratio, pinned to the bottom.
        Two reasons, both about not fighting the composition: the plate's upper
        third is empty sky, so hero copy lands on near-background pixels instead
        of on ink; and nothing is ever side-cropped, so narrow viewports get the
        whole scene as a band rather than a slice of the middle of the desk.
        On short/wide viewports the sky simply overflows past the top edge.
      */}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={`/video/${name}.webp`}
        className="absolute inset-x-0 bottom-0 h-auto w-full dark:opacity-50 dark:brightness-[0.55] dark:saturate-75"
        style={{
          // Dissolve the clip's own top edge. Anchored to the video box rather
          // than the hero box, so the seam stays invisible at any viewport
          // ratio, where a fixed gradient stop would drift off the edge.
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 20%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 20%)",
        }}
      >
        <source src={`/video/${name}.webm`} type="video/webm" />
        <source src={`/video/${name}.mp4`} type="video/mp4" />
      </video>

      {/*
        Paper grain, multiplied over the clip.
        Deliberately a CSS layer and not baked into the video: encoding the same
        grain into the frames cost 7.2 MB against 668 KB, because per-pixel noise
        is near-incompressible and an inter-frame codec re-pays for it every
        frame. As an overlay it stays pixel-crisp instead of being smeared by the
        encoder, one 64 KB file serves every page's loop, and the strength is a
        style tweak rather than a re-encode.

        Painted with `border-image` (the `fill` keyword draws the image across
        the box) rather than `background-image`. Chrome counts a background
        image as a candidate for Largest Contentful Paint and does not count a
        border image, and a texture at 20% opacity is not the page's content.
        As a background it was the LCP and cost the mobile PageSpeed score
        about a second. The inner box reproduces `background-size: cover`:
        container units size it to the image's 1280:704 ratio, at least as
        large as the hero on both axes, centred.
      */}
      {/* Size containment makes this box a stacking context, so the blend and
          opacity live here, not on the inner box, or it would multiply onto
          nothing. */}
      <div
        className="absolute inset-0 overflow-hidden mix-blend-multiply transition-opacity duration-700 [container-type:size]"
        style={{ opacity: loaded ? grain / 100 : 0 }}
      >
        {loaded && (
          <div className="absolute top-1/2 left-1/2 h-[max(100cqh,calc(100cqw*704/1280))] w-[max(100cqw,calc(100cqh*1280/704))] -translate-x-1/2 -translate-y-1/2 [border-image:url('/video/paper-grain.webp')_0_fill/0/0_stretch]" />
        )}
      </div>

      {/*
        Scrim: dissolves the video's hard top edge into `--background`, keeps a
        light wash over the copy band, stays out of the way where the figures
        are, then closes back to `--background` so the section joins the next
        one with no visible seam.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom," +
            " var(--background) 0%," +
            " color-mix(in srgb, var(--background) 94%, transparent) 30%," +
            " color-mix(in srgb, var(--background) 72%, transparent) 45%," +
            " color-mix(in srgb, var(--background) 12%, transparent) 60%," +
            " color-mix(in srgb, var(--background) 4%, transparent) 82%," +
            " color-mix(in srgb, var(--background) 32%, transparent) 95%," +
            " var(--background) 100%)",
        }}
      />
    </div>
  );
}

export { HeroVideo };
