import { NextRequest, NextResponse } from "next/server";
import { getOrigin } from "../oauthHelpers";
import { createServerSupabaseClient } from "./server";

export async function startSupabaseOAuth(
  req: NextRequest,
  provider: "kakao" | "google"
): Promise<NextResponse> {
  const origin = getOrigin(req);
  const next = req.nextUrl.searchParams.get("next") || "/";
  const redirectTo =
    next && next !== "/"
      ? `${origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `${origin}/auth/callback`;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      ...(provider === "google"
        ? { queryParams: { access_type: "offline", prompt: "select_account" } }
        : {}),
    },
  });

  if (error || !data.url) {
    const errUrl = new URL("/login", origin);
    errUrl.searchParams.set("error", `${provider}_error`);
    return NextResponse.redirect(errUrl);
  }

  return NextResponse.redirect(data.url);
}
