import { NextRequest, NextResponse } from "next/server";
import {
  createCommunityPost,
  listCommunityPosts,
} from "@/app/lib/communityStore";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";

export async function GET() {
  try {
    const { posts, storage } = await listCommunityPosts();
    return NextResponse.json(
      { posts, storage },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentSessionUser();
  const role = getEffectiveRole(user);

  if (role === "guest" || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json(
      { error: "게시글 작성 권한이 없습니다. (관리자 전용)" },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      category?: string;
      title?: string;
      content?: string;
      pinned?: boolean;
    };

    const category = (body.category ?? "나눔글").trim() || "나눔글";
    const title = (body.title ?? "").trim();
    const content = (body.content ?? "").trim();

    if (title.length < 2 || content.length < 2) {
      return NextResponse.json(
        { error: "제목과 내용을 2자 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    const post = await createCommunityPost(user, {
      category,
      title,
      content,
      pinned: Boolean(body.pinned),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "게시글 등록 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
