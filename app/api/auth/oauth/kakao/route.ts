import { NextRequest, NextResponse } from "next/server";
import { createOAuthState, getOrigin } from "@/app/lib/oauthHelpers";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { startSupabaseOAuth } from "@/app/lib/supabase/oauth";

export async function GET(req: NextRequest) {
  if (isSupabaseConfigured()) {
    return startSupabaseOAuth(req, "kakao");
  }

  const clientId = process.env.KAKAO_CLIENT_ID;
  const origin = getOrigin(req);

  if (!clientId) {
    const demoUrl = new URL("/oauth/demo", origin);
    demoUrl.searchParams.set("provider", "kakao");
    return NextResponse.redirect(demoUrl);
  }

  const state = await createOAuthState();
  const redirectUri = `${origin}/api/auth/oauth/kakao/callback`;

  const authUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl);
}
