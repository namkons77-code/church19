import { NextRequest, NextResponse } from "next/server";
import { addCommunityComment } from "@/app/lib/communityStore";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentSessionUser();
  const role = getEffectiveRole(user);

  // Only logged-in users (member or admin) can write comments; guest is read-only
  if (role === "guest" || !user) {
    return NextResponse.json(
      { error: "로그인사용자 이상만 댓글을 작성할 수 있습니다." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해 주세요." },
        { status: 400 }
      );
    }

    const comment = await addCommunityComment(user, id, content);
    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "POST_NOT_FOUND") {
      return NextResponse.json(
        { error: "존재하지 않는 게시글입니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "댓글 작성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
