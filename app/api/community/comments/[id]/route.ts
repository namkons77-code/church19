import { NextRequest, NextResponse } from "next/server";
import { deleteCommunityComment } from "@/app/lib/communityStore";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentSessionUser();
  const role = getEffectiveRole(user);

  if (role === "guest" || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const result = await deleteCommunityComment(user, id);

    if (result === "not_found") {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    if (result === "forbidden") {
      return NextResponse.json(
        { error: "본인 댓글 또는 관리자만 삭제할 수 있습니다." },
        { status: 403 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "댓글 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
