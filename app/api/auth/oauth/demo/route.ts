import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieOptions, signSessionToken } from "@/app/lib/auth";
import { toSessionUser, upsertOAuthUser } from "@/app/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      provider?: "kakao" | "google";
      name?: string;
      email?: string;
    };

    const provider = body.provider === "kakao" ? "kakao" : body.provider === "google" ? "google" : null;
    if (!provider) {
      return NextResponse.json(
        { error: "지원하지 않는 로그인 방식입니다." },
        { status: 400 }
      );
    }

    const defaultName = provider === "kakao" ? "카카오 성도" : "구글 성도";
    const defaultEmail =
      provider === "kakao" ? "kakao.member@church19.org" : "google.member@church19.org";

    const name = (body.name ?? "").trim() || defaultName;
    const email = (body.email ?? "").trim() || defaultEmail;

    const user = await upsertOAuthUser({
      provider,
      providerId: `demo_${provider}_${email}`,
      name,
      email,
    });

    const sessionUser = toSessionUser(user);
    const token = signSessionToken(sessionUser);

    const res = NextResponse.json({ user: sessionUser });
    res.cookies.set({
      ...getSessionCookieOptions(),
      value: token,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "소셜 로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
