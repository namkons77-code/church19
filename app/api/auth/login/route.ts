import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  signSessionToken,
  verifyPassword,
} from "@/app/lib/auth";
import { isSupabaseConfigured, mapSupabaseUser } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";
import { findEmailUser, toSessionUser } from "@/app/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email ?? "").trim();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        const msg = error?.message.toLowerCase() ?? "";
        if (msg.includes("email not confirmed")) {
          return NextResponse.json(
            { error: "이메일 인증이 아직 완료되지 않았습니다. 메일함을 확인해 주세요." },
            { status: 401 }
          );
        }
        return NextResponse.json(
          { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
          { status: 401 }
        );
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "name, parish, provider, role, avatar_url, school, department, gender, hobby, specialty, profile_completed"
        )
        .eq("id", data.user.id)
        .maybeSingle();

      return NextResponse.json({ user: mapSupabaseUser(data.user, profile) });
    }

    const user = await findEmailUser(email);
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

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
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
