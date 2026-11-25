import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  getSessionUser,
  signSessionToken,
} from "@/app/lib/auth";
import { isSupabaseConfigured, mapSupabaseUser } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";
import { findUserById, toSessionUser, updateUserProfile } from "@/app/lib/userStore";

const PROFILE_SELECT =
  "name, parish, provider, role, avatar_url, school, department, gender, hobby, specialty, profile_completed";

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json(
      { user: mapSupabaseUser(user, profile) },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const cookieUser = await getSessionUser();
  if (!cookieUser) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  const stored = await findUserById(cookieUser.id);
  return NextResponse.json(
    { user: stored ? toSessionUser(stored) : cookieUser },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      parish?: string;
      avatarUrl?: string | null;
      school?: string;
      department?: string;
      gender?: string;
      hobby?: string;
      specialty?: string;
    };

    const name = body.name !== undefined ? body.name.trim() : undefined;
    if (name !== undefined && name.length < 2) {
      return NextResponse.json(
        { error: "이름을 2자 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    const avatarUrl =
      body.avatarUrl === null
        ? null
        : typeof body.avatarUrl === "string"
          ? body.avatarUrl.trim() || null
          : undefined;

    if (avatarUrl && avatarUrl.length > 200_000) {
      return NextResponse.json(
        { error: "아바타 이미지 용량이 너무 큽니다. 다른 이미지를 선택해 주세요." },
        { status: 400 }
      );
    }

    const parish = body.parish?.trim();
    const school = body.school?.trim() ?? "";
    const department = body.department?.trim() ?? "";
    const gender = body.gender?.trim() ?? "";
    const hobby = body.hobby?.trim() ?? "";
    const specialty = body.specialty?.trim() ?? "";

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
      }

      const currentMapped = mapSupabaseUser(user);
      const nextName = name || currentMapped.name;
      const nextParish = parish || currentMapped.parish || "새가족";
      const nextAvatar =
        avatarUrl === undefined ? currentMapped.avatarUrl ?? null : avatarUrl;

      // Always persist in auth user_metadata so it works even before SQL schema is executed
      const { data: updatedAuth, error: authErr } = await supabase.auth.updateUser({
        data: {
          name: nextName,
          parish: nextParish,
          avatar_url: nextAvatar,
          avatar_cleared: avatarUrl === null,
          school,
          department,
          gender,
          hobby,
          specialty,
          profile_completed: true,
        },
      });

      if (authErr) {
        return NextResponse.json(
          { error: "프로필 저장 중 오류가 발생했습니다: " + authErr.message },
          { status: 500 }
        );
      }

      // Also upsert into public.profiles when table exists
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: currentMapped.email,
          name: nextName,
          parish: nextParish,
          provider: currentMapped.provider,
          avatar_url: nextAvatar,
          school,
          department,
          gender,
          hobby,
          specialty,
          profile_completed: true,
        },
        { onConflict: "id" }
      );

      const finalUser = mapSupabaseUser(updatedAuth.user ?? user, {
        name: nextName,
        parish: nextParish,
        provider: currentMapped.provider,
        role: currentMapped.role,
        avatar_url: nextAvatar,
        school,
        department,
        gender,
        hobby,
        specialty,
        profile_completed: true,
      });

      return NextResponse.json({ user: finalUser });
    }

    const cookieUser = await getSessionUser();
    if (!cookieUser) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const updated = await updateUserProfile(cookieUser.id, {
      name,
      parish,
      avatarUrl,
      school,
      department,
      gender,
      hobby,
      specialty,
      profileCompleted: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const sessionUser = toSessionUser(updated);
    const token = signSessionToken(sessionUser);
    const res = NextResponse.json({ user: sessionUser });
    res.cookies.set({
      ...getSessionCookieOptions(),
      value: token,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "프로필 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
