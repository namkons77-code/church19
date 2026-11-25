"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { CommunityPost } from "../lib/communityStore";
import { useAuth } from "./AuthProvider";
import UserAvatar from "./UserAvatar";

const CATEGORIES = ["전체", "공지사항", "나눔글", "스토리", "기도제목"] as const;

export default function CommunityBoard() {
  const { user, loading: authLoading } = useAuth();
  const effectiveRole = !user ? "guest" : user.role === "admin" ? "admin" : "member";

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [error, setError] = useState<string | null>(null);

  // Admin post form state
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postCategory, setPostCategory] = useState("나눔글");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postPinned, setPostPinned] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  // Per-post comment draft
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingCommentFor, setSubmittingCommentFor] = useState<string | null>(null);

  async function loadPosts() {
    try {
      const res = await fetch("/api/community/posts", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { posts: CommunityPost[] };
        setPosts(data.posts ?? []);
      }
    } catch {
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/community/posts", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { posts: CommunityPost[] };
        if (active) setPosts(data.posts ?? []);
      })
      .catch(() => {
        if (active) setError("게시글을 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        if (active) setLoadingPosts(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function openNewPostForm() {
    setEditingPostId(null);
    setPostCategory("나눔글");
    setPostTitle("");
    setPostContent("");
    setPostPinned(false);
    setShowPostForm(true);
    setError(null);
  }

  function openEditPostForm(post: CommunityPost) {
    setEditingPostId(post.id);
    setPostCategory(post.category || "나눔글");
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostPinned(post.pinned);
    setShowPostForm(true);
    setError(null);
  }

  async function handlePostSubmit(e: FormEvent) {
    e.preventDefault();
    setSavingPost(true);
    setError(null);

    try {
      const url = editingPostId
        ? `/api/community/posts/${editingPostId}`
        : "/api/community/posts";
      const method = editingPostId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: postCategory,
          title: postTitle,
          content: postContent,
          pinned: postPinned,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "게시글 저장에 실패했습니다.");
        return;
      }

      setShowPostForm(false);
      await loadPosts();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSavingPost(false);
    }
  }

  async function handleDeletePost(postId: string) {
    setError(null);
    try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "게시글 삭제에 실패했습니다.");
        return;
      }
      await loadPosts();
    } catch {
      setError("게시글 삭제 중 오류가 발생했습니다.");
    }
  }

  async function handleTogglePin(post: CommunityPost) {
    setError(null);
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !post.pinned }),
      });
      if (res.ok) {
        await loadPosts();
      }
    } catch {
      setError("고정 상태 변경 중 오류가 발생했습니다.");
    }
  }

  async function handleCommentSubmit(e: FormEvent, postId: string) {
    e.preventDefault();
    const draft = (commentDrafts[postId] ?? "").trim();
    if (!draft) return;

    setSubmittingCommentFor(postId);
    setError(null);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "댓글 작성에 실패했습니다.");
        return;
      }
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      await loadPosts();
    } catch {
      setError("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingCommentFor(null);
    }
  }

  async function handleDeleteComment(commentId: string) {
    setError(null);
    try {
      const res = await fetch(`/api/community/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "댓글 삭제에 실패했습니다.");
        return;
      }
      await loadPosts();
    } catch {
      setError("댓글 삭제 중 오류가 발생했습니다.");
    }
  }

  const filteredPosts =
    selectedCategory === "전체"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <section id="board" className="bg-[#FEFEF4] py-20 px-5 lg:px-8 border-b border-neutral-200/70">
      <div className="max-w-[1140px] mx-auto space-y-8">
        {/* Header & Current Role Permission Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              church19 Community Board
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              나눔터 소통 게시판
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              교회 소식과 은혜 나눔, 기도제목을 함께 읽고 교제하는 공간입니다.
            </p>
          </div>

          {/* Role Status Pill & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {!authLoading && (
              <div
                className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 ${
                  effectiveRole === "admin"
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : effectiveRole === "member"
                      ? "bg-[#60984B]/12 border-[#60984B]/30 text-[#31702D]"
                      : "bg-white border-neutral-300 text-neutral-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    effectiveRole === "admin"
                      ? "bg-amber-500"
                      : effectiveRole === "member"
                        ? "bg-[#60984B]"
                        : "bg-neutral-400"
                  }`}
                />
                {effectiveRole === "admin" && "관리자 · 모든 권한 (작성/수정/삭제/댓글)"}
                {effectiveRole === "member" && "로그인사용자 · 읽기 및 댓글 작성 가능"}
                {effectiveRole === "guest" && "일반사용자 · 읽기 전용"}
              </div>
            )}

            {effectiveRole === "admin" && (
              <>
                <button
                  type="button"
                  onClick={openNewPostForm}
                  className="px-5 py-2.5 rounded-full bg-[#60984B] hover:bg-[#31702D] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
                >
                  + 새 게시글 작성
                </button>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs sm:text-sm font-bold transition-colors"
                >
                  관리자 페이지 →
                </Link>
              </>
            )}

            {effectiveRole === "guest" && !authLoading && (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-[#60984B] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                로그인하고 댓글 쓰기
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            {error}
          </div>
        )}

        {/* Admin Create / Edit Form */}
        {effectiveRole === "admin" && showPostForm && (
          <form
            onSubmit={handlePostSubmit}
            className="bg-white rounded-3xl border-2 border-[#60984B]/40 p-6 sm:p-8 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-neutral-900">
                {editingPostId ? "게시글 수정 (관리자)" : "새 게시글 작성 (관리자)"}
              </h3>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="text-sm font-bold text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                닫기 ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  카테고리
                </label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-neutral-300 text-sm"
                >
                  <option value="공지사항">공지사항</option>
                  <option value="나눔글">나눔글</option>
                  <option value="스토리">스토리</option>
                  <option value="기도제목">기도제목</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="게시글 제목을 입력하세요"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                내용
              </label>
              <textarea
                rows={4}
                required
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="나눔터에 게시할 내용을 입력하세요"
                className="w-full p-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postPinned}
                  onChange={(e) => setPostPinned(e.target.checked)}
                  className="accent-[#60984B]"
                />
                상단 공지로 고정
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={savingPost}
                  className="px-6 py-2.5 rounded-full bg-[#60984B] hover:bg-[#31702D] text-white text-xs font-bold cursor-pointer"
                >
                  {savingPost
                    ? "저장 중..."
                    : editingPostId
                      ? "수정 저장"
                      : "게시글 등록"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  active
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-[#60984B]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Posts List */}
        {loadingPosts ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-10 text-center text-sm text-neutral-500">
            나눔터 게시글을 불러오는 중입니다...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-10 text-center text-sm text-neutral-500">
            등록된 게시글이 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-xs ${
                  post.pinned ? "border-[#60984B] ring-1 ring-[#60984B]/15" : "border-neutral-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.pinned && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#60984B] text-white text-[11px] font-bold">
                          고정
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-[#60984B]/12 text-[#31702D] text-[11px] font-bold">
                        {post.category}
                      </span>
                      <span className="text-xs text-neutral-500">
                        작성자: <strong className="text-neutral-800">{post.author_name}</strong>
                      </span>
                      <span className="text-xs text-neutral-400">
                        · {post.created_at.slice(0, 10)}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-neutral-900">
                      {post.title}
                    </h3>
                  </div>

                  {/* Admin Post Actions */}
                  {effectiveRole === "admin" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => void handleTogglePin(post)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                      >
                        {post.pinned ? "고정해제" : "상단고정"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditPostForm(post)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-[#31702D] hover:bg-[#60984B]/10 cursor-pointer"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeletePost(post.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Comments Section */}
                <div className="mt-6 pt-5 border-t border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-neutral-800">
                      댓글 ({post.comments.length})
                    </h4>
                  </div>

                  {post.comments.length > 0 && (
                    <ul className="space-y-3">
                      {post.comments.map((cmt) => {
                        const canDeleteComment =
                          effectiveRole === "admin" ||
                          (Boolean(user) && cmt.author_id === user?.id);
                        return (
                          <li
                            key={cmt.id}
                            className="rounded-2xl bg-[#FEFEF4] border border-neutral-200/70 px-4 py-3 flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <UserAvatar
                                name={cmt.author_name}
                                avatarUrl={cmt.author_avatar ?? undefined}
                                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                                fallbackClassName="w-8 h-8 rounded-full bg-[#60984B] text-white flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5"
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-extrabold text-neutral-900">
                                    {cmt.author_name}
                                  </span>
                                  {cmt.author_role === "admin" && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                      관리자
                                    </span>
                                  )}
                                  <span className="text-[11px] text-neutral-400">
                                    {cmt.created_at.slice(0, 10)}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-700 mt-1 break-words">
                                  {cmt.content}
                                </p>
                              </div>
                            </div>

                            {canDeleteComment && (
                              <button
                                type="button"
                                onClick={() => void handleDeleteComment(cmt.id)}
                                className="text-xs font-bold text-neutral-400 hover:text-red-600 shrink-0 cursor-pointer"
                              >
                                삭제
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Comment Input: only for member or admin */}
                  {effectiveRole === "guest" ? (
                    <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-600">
                      <span>
                        일반사용자는 읽기 전용입니다. 댓글을 남기려면 로그인해 주세요.
                      </span>
                      <Link
                        href="/login"
                        className="font-bold text-[#31702D] hover:underline shrink-0"
                      >
                        로그인하기 →
                      </Link>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => void handleCommentSubmit(e, post.id)}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="은혜의 댓글을 남겨주세요..."
                        className="flex-1 h-11 px-4 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:border-[#60984B]"
                      />
                      <button
                        type="submit"
                        disabled={submittingCommentFor === post.id}
                        className="px-5 h-11 rounded-xl bg-[#60984B] hover:bg-[#31702D] disabled:opacity-60 text-white text-xs sm:text-sm font-bold shrink-0 cursor-pointer"
                      >
                        {submittingCommentFor === post.id ? "등록 중..." : "댓글 등록"}
                      </button>
                    </form>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
