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
    ];
  },
};

export default nextConfig;
