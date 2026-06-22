import * as React from "react";

/**
 * Ambient, slowly drifting warm-toned blobs behind the hero. Pure CSS,
 * decorative, and frozen under prefers-reduced-motion (see globals.css).
 */
function HeroAurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-24 -top-24 size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--caramel)_24%,transparent),transparent_70%)] blur-3xl animate-aurora-1" />
      <div className="absolute -right-16 top-[4%] size-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--olive)_20%,transparent),transparent_70%)] blur-3xl animate-aurora-2" />
      <div className="absolute left-1/3 top-[28%] size-[24rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--clay)_16%,transparent),transparent_70%)] blur-3xl animate-aurora-3" />
    </div>
  );
}

export { HeroAurora };
