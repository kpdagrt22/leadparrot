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
};

export default nextConfig;
