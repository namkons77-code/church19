import { NextRequest, NextResponse } from "next/server";
import type { AuthenticatedRole } from "@/app/lib/auth";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";
import { toSessionUser, updateLocalUserRole } from "@/app/lib/userStore";

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentSessionUser();
  const effectiveRole = getEffectiveRole(currentUser);

  if (effectiveRole === "guest" || !currentUser) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (effectiveRole !== "admin") {
    return NextResponse.json(
      { error: "관리자만 회원 역할을 변경할 수 있습니다." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      userId?: string;
      role?: AuthenticatedRole;
    };
    const userId = (body.userId ?? "").trim();
    const nextRole =
      body.role === "admin" ? "admin" : body.role === "member" ? "member" : null;

    if (!userId || !nextRole) {
      return NextResponse.json(
        { error: "올바른 사용자 ID와 역할을 지정해 주세요." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: nextRole })
        .eq("id", userId)
        .select("id, email, name, parish, provider, role, avatar_url, profile_completed")
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { error: "역할 변경에 실패했습니다: " + error.message },
          { status: 500 }
        );
      }
      if (!data) {
        return NextResponse.json(
          { error: "해당 사용자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ user: data });
    }

    const updated = await updateLocalUserRole(userId, nextRole);
    if (!updated) {
      return NextResponse.json(
        { error: "해당 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ user: toSessionUser(updated) });
  } catch {
    return NextResponse.json(
      { error: "역할 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
