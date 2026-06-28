/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // LeadParrot keeps the build lean; external API calls (Reddit, HN, RSS) run
  // server-side from route handlers, never via the browser.
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      {
        // Allow the service worker to control the whole origin from /sw.js, and
        // keep the worker itself uncached so updates ship immediately.
        source: "/sw.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
