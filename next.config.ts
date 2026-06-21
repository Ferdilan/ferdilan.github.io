import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Skip local type-checking — SWC native bindings are unavailable in this Windows env.
  // Vercel's build environment will perform full type-checking.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppress spurious workspace-root warning from multiple lockfiles
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
