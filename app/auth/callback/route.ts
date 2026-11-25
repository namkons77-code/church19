import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getOrigin } from "@/app/lib/oauthHelpers";
import { isSupabaseConfigured, mapSupabaseUser } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";

export async function GET(req: NextRequest) {
  const origin = getOrigin(req);
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type") as EmailOtpType | null;
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") || "/";
  const safeNext = next.startsWith("/") ? next : "/";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/login?error=supabase_not_configured", origin));
  }

  if (oauthError) {
    const errUrl = new URL("/login", origin);
    const mappedError =
      oauthError === "access_denied" ? "oauth_cancelled" : "oauth_exchange_failed";
    errUrl.searchParams.set("error", mappedError);
    if (errorDescription) {
      errUrl.searchParams.set("detail", errorDescription);
    }
    return NextResponse.redirect(errUrl);
  }

  const supabase = await createServerSupabaseClient();
  let authUser = null;

  if (tokenHash && otpType) {
    const { data, error } = await supabase.auth.verifyOtp({
      type: otpType,
      token_hash: tokenHash,
    });
    if (error || !data.user) {
      return NextResponse.redirect(new URL("/login?error=oauth_exchange_failed", origin));
    }
    authUser = data.user;
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      const msg = error?.message.toLowerCase() ?? "";
      // Email confirmation opened in another browser/app lacks PKCE code verifier,
      // even though Supabase has already verified the user's email.
      if (msg.includes("code verifier") || msg.includes("both auth code and code verifier")) {
        return NextResponse.redirect(new URL("/login?verified=1", origin));
      }
      return NextResponse.redirect(new URL("/login?error=oauth_exchange_failed", origin));
    }
    authUser = data.user;
  } else {
    return NextResponse.redirect(new URL("/login?error=oauth_cancelled", origin));
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select(
      "name, parish, provider, role, avatar_url, school, department, gender, hobby, specialty, profile_completed"
    )
    .eq("id", authUser.id)
    .maybeSingle();

  const mapped = mapSupabaseUser(authUser, existingProfile);

  if (!existingProfile) {
    await supabase.from("profiles").upsert(
      {
        id: authUser.id,
        email: mapped.email,
        name: mapped.name,
        parish: mapped.parish ?? "새가족",
        provider: mapped.provider,
        role: mapped.role,
        avatar_url: mapped.avatarUrl ?? null,
        profile_completed: mapped.profileCompleted ?? false,
      },
      { onConflict: "id" }
    );
  }

  const destination = mapped.profileCompleted ? safeNext : "/profile?welcome=1";
  return NextResponse.redirect(new URL(destination, origin));
}
