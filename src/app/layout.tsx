import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "LeadParrot — Find customers already asking for what you sell",
  description:
    "LeadParrot monitors public conversations, scores buyer intent, and drafts helpful replies — so you can show up at the right moment. No auto-posting. No auto-DMs.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "LeadParrot",
    description:
      "Find people already asking for what you sell — and get a useful reply draft before your competitors see the thread. No auto-posting. No auto-DMs.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
