import { NextRequest, NextResponse } from "next/server";
import { createOAuthState, getOrigin } from "@/app/lib/oauthHelpers";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { startSupabaseOAuth } from "@/app/lib/supabase/oauth";

export async function GET(req: NextRequest) {
  if (isSupabaseConfigured()) {
    return startSupabaseOAuth(req, "google");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const origin = getOrigin(req);

  if (!clientId) {
    const demoUrl = new URL("/oauth/demo", origin);
    demoUrl.searchParams.set("provider", "google");
    return NextResponse.redirect(demoUrl);
  }

  const state = await createOAuthState();
  const redirectUri = `${origin}/api/auth/oauth/google/callback`;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl);
}
