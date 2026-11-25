import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { SessionUser } from "./auth";
import { isSupabaseConfigured } from "./supabase/config";
import { createServerSupabaseClient } from "./supabase/server";

export type PostCategory = "공지사항" | "나눔글" | "스토리" | "기도제목";

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string | null;
  author_name: string;
  author_avatar?: string | null;
  author_role: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string | null;
  author_name: string;
  category: PostCategory | string;
  title: string;
  content: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
  comments: CommunityComment[];
}

interface LocalCommunityDb {
  posts: Omit<CommunityPost, "comments">[];
  comments: CommunityComment[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const COMMUNITY_FILE = path.join(DATA_DIR, "community.json");

function createSeedDb(): LocalCommunityDb {
  const now = new Date();
  const iso = (daysAgo: number) =>
    new Date(now.getTime() - daysAgo * 86_400_000).toISOString();

  return {
    posts: [
      {
        id: "post_welcome_notice",
        author_id: "usr_demo_admin",
        author_name: "최관리자 목사",
        category: "공지사항",
        title: "[안내] church19 나눔터 게시판 이용 및 권한 안내",
        content:
          "church19 나눔터에 오신 것을 환영합니다.\n\n일반사용자(비로그인)는 모든 공지와 나눔 글을 자유롭게 열람하실 수 있으며, 로그인사용자는 게시글에 따뜻한 댓글로 교제하실 수 있습니다. 게시글 작성 및 관리는 교회 관리자가 담당합니다.",
        pinned: true,
        created_at: iso(3),
        updated_at: iso(3),
      },
      {
        id: "post_thanksgiving",
        author_id: "usr_demo_admin",
        author_name: "최관리자 목사",
        category: "스토리",
        title: "2026 추수감사주일 및 순장 소풍 감사 나눔",
        content:
          "한 해 동안 우리 공동체를 인도해 주신 하나님께 감사드립니다. 지난 추수감사주일 예배와 순장 소풍에서 받은 은혜와 기도제목을 댓글로 함께 나누어 주세요.",
        pinned: false,
        created_at: iso(2),
        updated_at: iso(2),
      },
      {
        id: "post_prayer",
        author_id: "usr_demo_admin",
        author_name: "최관리자 목사",
        category: "기도제목",
        title: "11월 마지막 주 공동체 중보기도 제목",
        content:
          "1. 다음 세대 교회학교와 청년아포슬 겨울 수련회 준비를 위해\n2. 열방에 파송된 선교사님들과 다문화 예배부를 위해\n3. 환우 성도님들의 치유와 회복을 위해 함께 기도해 주세요.",
        pinned: false,
        created_at: iso(1),
        updated_at: iso(1),
      },
    ],
    comments: [
      {
        id: "cmt_seed_1",
        post_id: "post_thanksgiving",
        author_id: "usr_demo_member",
        author_name: "김은혜 성도",
        author_role: "member",
        content: "추수감사주일 예배를 통해 큰 은혜를 받았습니다. 함께 섬겨주신 모든 분들께 감사드립니다!",
        created_at: iso(1),
      },
    ],
  };
}

async function readLocalDb(): Promise<LocalCommunityDb> {
  try {
    const raw = await fs.readFile(COMMUNITY_FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalCommunityDb;
    if (Array.isArray(parsed?.posts) && Array.isArray(parsed?.comments)) {
      return parsed;
    }
    const seed = createSeedDb();
    await writeLocalDb(seed);
    return seed;
  } catch {
    const seed = createSeedDb();
    await writeLocalDb(seed);
    return seed;
  }
}

async function writeLocalDb(db: LocalCommunityDb): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(COMMUNITY_FILE, JSON.stringify(db, null, 2), "utf8");
}

function isMissingTableError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === "PGRST205" ||
    err.code === "42P01" ||
    Boolean(err.message?.includes("Could not find the table"))
  );
}

function sortPosts(posts: CommunityPost[]): CommunityPost[] {
  return [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function listCommunityPosts(): Promise<{
  posts: CommunityPost[];
  storage: "supabase" | "local";
}> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data: postRows, error: postErr } = await supabase
      .from("community_posts")
      .select("id, author_id, author_name, category, title, content, pinned, created_at, updated_at")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (!postErr && postRows) {
      const { data: commentRows } = await supabase
        .from("community_comments")
        .select("id, post_id, author_id, author_name, author_avatar, author_role, content, created_at")
        .order("created_at", { ascending: true });

      const commentsByPost = new Map<string, CommunityComment[]>();
      for (const c of (commentRows ?? []) as CommunityComment[]) {
        const arr = commentsByPost.get(c.post_id) ?? [];
        arr.push(c);
        commentsByPost.set(c.post_id, arr);
      }

      const combined: CommunityPost[] = (postRows as Omit<CommunityPost, "comments">[]).map(
        (p) => ({
          ...p,
          comments: commentsByPost.get(p.id) ?? [],
        })
      );
      return { posts: combined, storage: "supabase" };
    }

    if (!isMissingTableError(postErr)) {
      throw new Error(postErr?.message || "게시글 조회에 실패했습니다.");
    }
  }

  const db = await readLocalDb();
  const commentsByPost = new Map<string, CommunityComment[]>();
  for (const c of db.comments) {
    const arr = commentsByPost.get(c.post_id) ?? [];
    arr.push(c);
    commentsByPost.set(c.post_id, arr);
  }
  const combined: CommunityPost[] = db.posts.map((p) => ({
    ...p,
    comments: commentsByPost.get(p.id) ?? [],
  }));
  return { posts: sortPosts(combined), storage: "local" };
}

export async function createCommunityPost(
  user: SessionUser,
  input: { category: string; title: string; content: string; pinned?: boolean }
): Promise<CommunityPost> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        author_id: user.id,
        author_name: user.name,
        category: input.category,
        title: input.title,
        content: input.content,
        pinned: Boolean(input.pinned),
      })
      .select("id, author_id, author_name, category, title, content, pinned, created_at, updated_at")
      .single();

    if (!error && data) {
      return { ...(data as Omit<CommunityPost, "comments">), comments: [] };
    }
    if (!isMissingTableError(error)) {
      throw new Error(error?.message || "게시글 등록에 실패했습니다.");
    }
  }

  const db = await readLocalDb();
  const now = new Date().toISOString();
  const created: Omit<CommunityPost, "comments"> = {
    id: `post_${crypto.randomUUID()}`,
    author_id: user.id,
    author_name: user.name,
    category: input.category,
    title: input.title,
    content: input.content,
    pinned: Boolean(input.pinned),
    created_at: now,
    updated_at: now,
  };
  db.posts.unshift(created);
  await writeLocalDb(db);
  return { ...created, comments: [] };
}

export async function updateCommunityPost(
  postId: string,
  input: { category?: string; title?: string; content?: string; pinned?: boolean }
): Promise<CommunityPost | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("community_posts")
      .update({
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.pinned !== undefined ? { pinned: input.pinned } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .select("id, author_id, author_name, category, title, content, pinned, created_at, updated_at")
      .maybeSingle();

    if (!error) {
      if (!data) return null;
      return { ...(data as Omit<CommunityPost, "comments">), comments: [] };
    }
    if (!isMissingTableError(error)) {
      throw new Error(error?.message || "게시글 수정에 실패했습니다.");
    }
  }

  const db = await readLocalDb();
  const idx = db.posts.findIndex((p) => p.id === postId);
  if (idx < 0) return null;

  db.posts[idx] = {
    ...db.posts[idx],
    ...(input.category !== undefined ? { category: input.category } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.content !== undefined ? { content: input.content } : {}),
    ...(input.pinned !== undefined ? { pinned: input.pinned } : {}),
    updated_at: new Date().toISOString(),
  };
  await writeLocalDb(db);
  return {
    ...db.posts[idx],
    comments: db.comments.filter((c) => c.post_id === postId),
  };
}

export async function deleteCommunityPost(postId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("community_posts").delete().eq("id", postId);
    if (!error) return true;
    if (!isMissingTableError(error)) {
      throw new Error(error.message || "게시글 삭제에 실패했습니다.");
    }
  }

  const db = await readLocalDb();
  const before = db.posts.length;
  db.posts = db.posts.filter((p) => p.id !== postId);
  db.comments = db.comments.filter((c) => c.post_id !== postId);
  if (db.posts.length === before) return false;
  await writeLocalDb(db);
  return true;
}

export async function addCommunityComment(
  user: SessionUser,
  postId: string,
  content: string
): Promise<CommunityComment> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("community_comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        author_name: user.name,
        author_avatar: user.avatarUrl ?? null,
        author_role: user.role,
        content,
      })
      .select("id, post_id, author_id, author_name, author_avatar, author_role, content, created_at")
      .single();

    if (!error && data) {
      return data as CommunityComment;
    }
    if (!isMissingTableError(error)) {
      throw new Error(error?.message || "댓글 작성에 실패했습니다.");
    }
  }

  const db = await readLocalDb();
  if (!db.posts.some((p) => p.id === postId)) {
    throw new Error("POST_NOT_FOUND");
  }
  const comment: CommunityComment = {
    id: `cmt_${crypto.randomUUID()}`,
    post_id: postId,
    author_id: user.id,
    author_name: user.name,
    author_avatar: user.avatarUrl ?? null,
    author_role: user.role,
    content,
    created_at: new Date().toISOString(),
  };
  db.comments.push(comment);
  await writeLocalDb(db);
  return comment;
}

export async function deleteCommunityComment(
  user: SessionUser,
  commentId: string
): Promise<"deleted" | "forbidden" | "not_found"> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("community_comments")
      .select("id, author_id")
      .eq("id", commentId)
      .maybeSingle();

    if (!fetchErr) {
      if (!existing) return "not_found";
      if (user.role !== "admin" && existing.author_id !== user.id) {
        return "forbidden";
      }
      const { error: delErr } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId);
      if (delErr) {
        throw new Error(delErr.message || "댓글 삭제에 실패했습니다.");
      }
      return "deleted";
    }
    if (!isMissingTableError(fetchErr)) {
      throw new Error(fetchErr.message || "댓글 삭제에 실패했습니다.");
    }
  }

  const db = await readLocalDb();
  const target = db.comments.find((c) => c.id === commentId);
  if (!target) return "not_found";
  if (user.role !== "admin" && target.author_id !== user.id) {
    return "forbidden";
  }
  db.comments = db.comments.filter((c) => c.id !== commentId);
  await writeLocalDb(db);
  return "deleted";
}
