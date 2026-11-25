import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieOptions, isAdminEmail, signSessionToken } from "@/app/lib/auth";
import { getOrigin } from "@/app/lib/oauthHelpers";
import { isSupabaseConfigured, mapSupabaseUser } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";
import { createEmailUser, toSessionUser } from "@/app/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      parish?: string;
    };

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const password = body.password ?? "";
    const parish = (body.parish ?? "").trim() || "새가족";

    if (name.length < 2) {
      return NextResponse.json(
        { error: "이름을 2자 이상 입력해 주세요." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 주소를 입력해 주세요." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "비밀번호는 8자 이상으로 설정해 주세요." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const origin = getOrigin(req);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, parish },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists")) {
          return NextResponse.json(
            { error: "이미 가입된 이메일 주소입니다." },
            { status: 409 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (!data.user) {
        return NextResponse.json(
          { error: "회원가입 처리 중 사용자 정보를 생성하지 못했습니다." },
          { status: 500 }
        );
      }

      // If email confirmation is enabled in Supabase, session may be null until verified
      if (!data.session) {
        return NextResponse.json(
          {
            user: null,
            needsEmailVerification: true,
            message:
              "인증 메일이 발송되었습니다. 이메일 인증을 완료한 후 로그인해 주세요.",
          },
          { status: 201 }
        );
      }

      const assignedRole = isAdminEmail(email) ? "admin" : "member";

      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email,
          name,
          parish,
          provider: "email",
          role: assignedRole,
        },
        { onConflict: "id" }
      );

      return NextResponse.json(
        {
          user: mapSupabaseUser(data.user, {
            name,
            parish,
            provider: "email",
            role: assignedRole,
          }),
        },
        { status: 201 }
      );
    }

    const created = await createEmailUser({ name, email, password, parish });
    const sessionUser = toSessionUser(created);
    const token = signSessionToken(sessionUser);

    const res = NextResponse.json({ user: sessionUser }, { status: 201 });
    res.cookies.set({
      ...getSessionCookieOptions(),
      value: token,
    });
    return res;
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "이미 가입된 이메일 주소입니다." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
