import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
