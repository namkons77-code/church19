import { NextRequest, NextResponse } from "next/server";
import {
  deleteCommunityPost,
  updateCommunityPost,
} from "@/app/lib/communityStore";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentSessionUser();
  const role = getEffectiveRole(user);

  if (role === "guest" || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json(
      { error: "게시글 수정 권한이 없습니다. (관리자 전용)" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const body = (await req.json()) as {
      category?: string;
      title?: string;
      content?: string;
      pinned?: boolean;
    };

    const updated = await updateCommunityPost(id, {
      category: body.category?.trim(),
      title: body.title?.trim(),
      content: body.content?.trim(),
      pinned: body.pinned,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ post: updated });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "게시글 수정 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentSessionUser();
  const role = getEffectiveRole(user);

  if (role === "guest" || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json(
      { error: "게시글 삭제 권한이 없습니다. (관리자 전용)" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteCommunityPost(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "게시글 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
