import { NextRequest } from "next/server";
import {
  completeOAuthRedirect,
  failOAuthRedirect,
  getOrigin,
  verifyOAuthState,
} from "@/app/lib/oauthHelpers";
import { upsertOAuthUser } from "@/app/lib/userStore";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return failOAuthRedirect(req, "google_cancelled");
  }

  const validState = await verifyOAuthState(state);
  if (!validState) {
    return failOAuthRedirect(req, "invalid_state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failOAuthRedirect(req, "google_not_configured");
  }

  const origin = getOrigin(req);
  const redirectUri = `${origin}/api/auth/oauth/google/callback`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) {
      return failOAuthRedirect(req, "google_token_failed");
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) {
      return failOAuthRedirect(req, "google_token_failed");
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    if (!userRes.ok) {
      return failOAuthRedirect(req, "google_profile_failed");
    }

    const profile = (await userRes.json()) as {
      id: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    const user = await upsertOAuthUser({
      provider: "google",
      providerId: profile.id,
      name: profile.name || "Google 성도",
      email: profile.email || `google_${profile.id}@google.church19.org`,
      avatarUrl: profile.picture,
    });

    return completeOAuthRedirect(req, user, "/");
  } catch {
    return failOAuthRedirect(req, "google_error");
  }
}
