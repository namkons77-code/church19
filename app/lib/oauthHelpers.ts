import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieOptions, signSessionToken } from "./auth";
import { toSessionUser, upsertOAuthUser } from "./userStore";

export const OAUTH_STATE_COOKIE = "church19_oauth_state";

export function getOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function createOAuthState(): Promise<string> {
  const state = crypto.randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return state;
}

export async function verifyOAuthState(stateParam: string | null): Promise<boolean> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);
  if (!saved || !stateParam) return false;
  return saved === stateParam;
}

export function completeOAuthRedirect(
  req: NextRequest,
  user: Awaited<ReturnType<typeof upsertOAuthUser>>,
  redirectTo = "/"
): NextResponse {
  const sessionUser = toSessionUser(user);
  const token = signSessionToken(sessionUser);
  const target = sessionUser.profileCompleted ? redirectTo : "/profile?welcome=1";
  const res = NextResponse.redirect(new URL(target, getOrigin(req)));
  res.cookies.set({
    ...getSessionCookieOptions(),
    value: token,
  });
  return res;
}

export function failOAuthRedirect(req: NextRequest, reason: string): NextResponse {
  const url = new URL("/login", getOrigin(req));
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}
