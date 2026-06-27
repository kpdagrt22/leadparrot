import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Run on app pages; skip static assets, Next internals, the bearer-only
    // extension API (no session cookie), and the PWA service worker + manifest
    // (root-scoped statics that must bypass the Supabase session refresh).
    "/((?!api/extension|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
