"use client";

import * as React from "react";
import Image from "next/image";

import { Container } from "@/components/marketing/container";
import { Reveal } from "@/components/marketing/reveal";

/**
 * The one place on the homepage that shows the actual product.
 *
 * Everything else on the page is an argument; this is the evidence. It sits
 * directly under the hero because the first question a stranger asks of a
 * $1/month tool from a brand they've never heard of isn't "how is it priced" —
 * it's "does this exist". A watercolour and four animated abstractions can't
 * answer that. One frame of the real composer can.
 *
 * `shot` is null until the asset lands, and the section then renders nothing at
 * all. A placeholder frame or a broken <img> on a live page costs more trust
 * than a missing section, and trust is this section's entire job.
 *
 * To turn it on, drop the file into `public/product/` and fill in `shot`:
 *  - screen recording → { kind: "video", name: "composer", … }, which expects
 *    `composer.webm`, `composer.mp4`, and a `composer.jpg` poster frame. Keep it
 *    short, silent, and loopable — it's a demo, not a film.
 *  - still screenshot → { kind: "image", src: "/product/composer.png", … } with
 *    the file's real pixel dimensions, so Next can reserve the space.
 *
 * `alt` is not optional in either case: this is content, not decoration.
 */
type Shot =
  | {
      kind: "video";
      /** Basename under /public/product, without extension. */
      name: string;
      alt: string;
    }
  | {
      kind: "image";
      src: string;
      width: number;
      height: number;
      alt: string;
    };

const shot: Shot | null = null;

/** Caption under the frame. Names what you're looking at, in one line. */
const caption = "The composer — write the update, pick who gets it, send.";

function ComposerShot() {
  if (!shot) return null;

  return (
    <section className="border-t border-border">
      <Container className="pb-20 pt-16 sm:pb-24 sm:pt-20">
        <Reveal>
          {/*
            Same border, radius and shadow as the animated panels further down
            the page, so the real screenshot and the illustrations read as one
            family rather than two different pitches.
          */}
          <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_50px_-34px_color-mix(in_srgb,var(--espresso)_40%,transparent)]">
            {shot.kind === "video" ? (
              <ShotVideo name={shot.name} alt={shot.alt} />
            ) : (
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                priority
                className="h-auto w-full"
              />
            )}
          </figure>
          <figcaption className="mt-4 text-center text-sm text-muted-foreground">
            {caption}
          </figcaption>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * Autoplaying, silent, looping product loop. Same three rules as the hero clip:
 * `autoPlay` is set in JS rather than as an attribute so a reduced-motion
 * viewer keeps the poster frame as a still, playback pauses off-screen, and
 * there's no audio track to surprise anyone.
 */
function ShotVideo({ name, alt }: { name: string; alt: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (typeof IntersectionObserver === "undefined") {
      void video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) void video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      poster={`/product/${name}.jpg`}
      className="block h-auto w-full"
    >
      <source src={`/product/${name}.webm`} type="video/webm" />
      <source src={`/product/${name}.mp4`} type="video/mp4" />
    </video>
  );
}

export { ComposerShot };
