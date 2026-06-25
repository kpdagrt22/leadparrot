import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";

/**
 * OAuth / email-confirmation callback. Exchanges the `code` for a session and
 * redirects into the app. No-op in demo mode (no Supabase client).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Validate the post-auth destination to prevent open-redirect abuse.
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createServerSupabase();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }
  return NextResponse.redirect(`${origin}${next}`);
}
