import type { MetadataRoute } from "next";

/**
 * PWA manifest (served at /manifest.webmanifest). The installable app opens to
 * the workspace; the service worker (public/sw.js) precaches the demo shell so
 * the zero-secrets demo works offline. Crest theme colors: Verdigris on paper.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Leads Nest",
    short_name: "Leads Nest",
    description:
      "Discover public conversations where people ask for what you sell, score buyer intent, and draft a disclosed reply you post yourself. No auto-posting.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F4F1E9",
    theme_color: "#2E5E45",
    categories: ["business", "productivity", "marketing"],
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
