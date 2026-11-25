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
    return failOAuthRedirect(req, "kakao_cancelled");
  }

  const validState = await verifyOAuthState(state);
  if (!validState) {
    return failOAuthRedirect(req, "invalid_state");
  }

  const clientId = process.env.KAKAO_CLIENT_ID;
  if (!clientId) {
    return failOAuthRedirect(req, "kakao_not_configured");
  }

  const origin = getOrigin(req);
  const redirectUri = `${origin}/api/auth/oauth/kakao/callback`;

  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  });
  if (process.env.KAKAO_CLIENT_SECRET) {
    tokenParams.set("client_secret", process.env.KAKAO_CLIENT_SECRET);
  }

  try {
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: tokenParams,
    });
    if (!tokenRes.ok) {
      return failOAuthRedirect(req, "kakao_token_failed");
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) {
      return failOAuthRedirect(req, "kakao_token_failed");
    }

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    if (!userRes.ok) {
      return failOAuthRedirect(req, "kakao_profile_failed");
    }

    const profile = (await userRes.json()) as {
      id: number;
      kakao_account?: {
        email?: string;
        profile?: { nickname?: string; profile_image_url?: string };
      };
    };

    const user = await upsertOAuthUser({
      provider: "kakao",
      providerId: String(profile.id),
      name: profile.kakao_account?.profile?.nickname || "카카오 성도",
      email:
        profile.kakao_account?.email || `kakao_${profile.id}@kakao.church19.org`,
      avatarUrl: profile.kakao_account?.profile?.profile_image_url,
    });

    return completeOAuthRedirect(req, user, "/");
  } catch {
    return failOAuthRedirect(req, "kakao_error");
  }
}
