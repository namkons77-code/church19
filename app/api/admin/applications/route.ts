import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";

const ALLOWED_STATUSES = ["접수완료", "처리중", "완료"] as const;

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (getEffectiveRole(currentUser) !== "admin") {
    return NextResponse.json(
      { error: "관리자만 신청 상태를 변경할 수 있습니다." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as { id?: string; status?: string };
    const id = (body.id ?? "").trim();
    const status = (body.status ?? "").trim();

    if (!id || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return NextResponse.json(
        { error: "올바른 신청 ID와 상태를 지정해 주세요." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("online_applications")
        .update({ status })
        .eq("id", id)
        .select("id, status")
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { error: "상태 변경에 실패했습니다: " + error.message },
          { status: 500 }
        );
      }
      if (!data) {
        return NextResponse.json(
          { error: "신청 내역을 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ application: data });
    }

    const file = path.join(process.cwd(), ".data", "applications.json");
    const raw = await fs.readFile(file, "utf8");
    const list = JSON.parse(raw) as Array<{ id: string; status: string }>;
    const idx = list.findIndex((item) => item.id === id);
    if (idx < 0) {
      return NextResponse.json(
        { error: "신청 내역을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    list[idx].status = status;
    await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
    return NextResponse.json({ application: list[idx] });
  } catch {
    return NextResponse.json(
      { error: "상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
