import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// The Crest type system: Newsreader (display serif), IBM Plex Sans (body),
// IBM Plex Mono (labels, buttons, data). Each exposes a CSS variable the
// Tailwind theme + globals.css reference.
const display = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leads Nest — Find customers already asking for what you sell",
  description:
    "Leads Nest monitors public conversations, scores buyer intent, and drafts helpful replies — so you can show up at the right moment. No auto-posting. No auto-DMs.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://theleadsnest.com"),
  openGraph: {
    title: "Leads Nest",
    description:
      "Find people already asking for what you sell — and get a useful reply draft before your competitors see the thread. No auto-posting. No auto-DMs.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
