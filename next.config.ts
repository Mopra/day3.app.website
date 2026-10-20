import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Inline the stylesheet into the HTML. A separate render-blocking request
    // cost a round trip before first paint, which PageSpeed's mobile run
    // measured at about 340 ms and which dragged Speed Index down with it.
    inlineCss: true,
  },
  async redirects() {
    return [
      // Deliverability lives at the top-level /deliverability page. The old
      // templated feature page was a duplicate, so send its link equity there.
      {
        source: "/features/deliverability",
        destination: "/deliverability",
        permanent: true,
      },
      // ConvertKit renamed itself Kit, and search is following. The page moved to
      // /compare/kit-alternative; this keeps the old URL's links and rankings.
      {
        source: "/compare/convertkit-alternative",
        destination: "/compare/kit-alternative",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
