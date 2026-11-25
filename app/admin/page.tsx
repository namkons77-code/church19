"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../components/AuthProvider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserAvatar from "../components/UserAvatar";
import type { AuthenticatedRole, SessionUser } from "../lib/auth";
import type { CommunityPost } from "../lib/communityStore";

interface AdminApplication {
  id: string;
  service_id: string;
  service_title: string;
  applicant_name: string;
  contact: string;
  note: string;
  status: string;
  created_at: string;
}

interface AdminOverview {
  stats: {
    totalPosts: number;
    totalComments: number;
    totalUsers: number;
    totalAdmins: number;
    totalApplications: number;
  };
  users: SessionUser[];
  posts: CommunityPost[];
  applications: AdminApplication[];
  storage: "supabase" | "local";
}

type AdminTab = "community" | "users" | "applications";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("community");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Admin quick post composer
  const [category, setCategory] = useState("공지사항");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  async function loadOverview() {
    setLoadingData(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "관리자 데이터를 불러오지 못했습니다.");
        return;
      }
      const data = (await res.json()) as AdminOverview;
      setOverview(data);
    } catch {
      setError("관리자 데이터를 불러오는 중 네트워크 오류가 발생했습니다.");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    if (user?.role !== "admin") return;
    let active = true;
    fetch("/api/admin/overview", { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as AdminOverview & { error?: string };
        if (!active) return;
        if (!res.ok) {
          setError(data.error ?? "관리자 데이터를 불러오지 못했습니다.");
          return;
        }
        setOverview(data);
      })
      .catch(() => {
        if (active) setError("관리자 데이터를 불러오는 중 네트워크 오류가 발생했습니다.");
      })
      .finally(() => {
        if (active) setLoadingData(false);
      });
    return () => {
      active = false;
    };
  }, [user?.role]);

  async function handleCreatePost(e: FormEvent) {
    e.preventDefault();
    setSavingPost(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, content, pinned }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "게시글 등록에 실패했습니다.");
        return;
      }
      setTitle("");
      setContent("");
      setPinned(false);
      setFeedback("나눔터 게시글이 등록되었습니다.");
      await loadOverview();
    } catch {
      setError("게시글 등록 중 오류가 발생했습니다.");
    } finally {
      setSavingPost(false);
    }
  }

  async function handleDeletePost(postId: string) {
    setError(null);
    setFeedback(null);
    const res = await fetch(`/api/community/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      setFeedback("게시글을 삭제했습니다.");
      await loadOverview();
    }
  }

  async function handleTogglePin(post: CommunityPost) {
    const res = await fetch(`/api/community/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !post.pinned }),
    });
    if (res.ok) {
      await loadOverview();
    }
  }

  async function handleDeleteComment(commentId: string) {
    setError(null);
    setFeedback(null);
    const res = await fetch(`/api/community/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setFeedback("댓글을 삭제했습니다.");
      await loadOverview();
    }
  }

  async function handleRoleChange(userId: string, nextRole: AuthenticatedRole) {
    setError(null);
    setFeedback(null);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: nextRole }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "역할 변경에 실패했습니다.");
      return;
    }
    setFeedback("회원 역할이 변경되었습니다.");
    await loadOverview();
  }

  async function handleApplicationStatus(id: string, status: string) {
    setError(null);
    setFeedback(null);
    const res = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "신청 상태 변경에 실패했습니다.");
      return;
    }
    setFeedback("신청 상태가 업데이트되었습니다.");
    await loadOverview();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />

      <main className="flex-1 max-w-[1180px] w-full mx-auto px-5 lg:px-8 pt-28 pb-20">
        {authLoading ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center text-sm text-neutral-500">
            권한을 확인하는 중입니다...
          </div>
        ) : !user || user.role !== "admin" ? (
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-neutral-200 p-10 text-center space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
              관리자 전용 페이지
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-900">
              접근 권한이 없습니다
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              현재 역할은{" "}
              <strong className="text-neutral-900">
                {!user ? "일반사용자(비로그인)" : "로그인사용자(member)"}
              </strong>
              입니다. 관리자 페이지는 <strong>관리자(admin)</strong> 계정으로 로그인해야
              이용할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/login"
                className="flex-1 py-3 rounded-xl bg-[#60984B] hover:bg-[#31702D] text-white font-bold text-sm transition-colors"
              >
                관리자 계정으로 로그인
              </Link>
              <Link
                href="/community"
                className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold text-sm transition-colors"
              >
                나눔터로 이동
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Admin Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
                  church19 Administration
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
                  관리자 대시보드
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  나눔터 전체 관리, 회원 역할(로그인사용자/관리자) 설정, 온라인신청 현황을
                  관리합니다.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/community"
                  className="px-5 py-2.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-xs sm:text-sm font-bold text-neutral-800"
                >
                  나눔터 보기 →
                </Link>
                <button
                  type="button"
                  onClick={() => void loadOverview()}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-[#60984B] text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors"
                >
                  새로고침
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            {feedback && (
              <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                {feedback}
              </div>
            )}

            {/* Stats Cards */}
            {overview && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                  <p className="text-xs font-bold text-neutral-500">나눔터 게시글</p>
                  <p className="text-3xl font-extrabold text-neutral-900 mt-1">
                    {overview.stats.totalPosts}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                  <p className="text-xs font-bold text-neutral-500">전체 댓글</p>
                  <p className="text-3xl font-extrabold text-[#5AADA7] mt-1">
                    {overview.stats.totalComments}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                  <p className="text-xs font-bold text-neutral-500">등록 회원 (관리자)</p>
                  <p className="text-3xl font-extrabold text-[#60984B] mt-1">
                    {overview.stats.totalUsers}{" "}
                    <span className="text-sm font-bold text-neutral-400">
                      ({overview.stats.totalAdmins})
                    </span>
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                  <p className="text-xs font-bold text-neutral-500">온라인 신청</p>
                  <p className="text-3xl font-extrabold text-neutral-900 mt-1">
                    {overview.stats.totalApplications}
                  </p>
                </div>
              </div>
            )}

            {/* Management Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
              {[
                { id: "community", label: "나눔터 게시글 · 댓글 관리" },
                { id: "users", label: "회원 · 역할 관리" },
                { id: "applications", label: "온라인신청 관리" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#60984B] text-white"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:border-[#60984B]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loadingData && !overview ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-10 text-center text-sm text-neutral-500">
                데이터를 불러오는 중입니다...
              </div>
            ) : activeTab === "community" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* New Post Composer */}
                <form
                  onSubmit={handleCreatePost}
                  className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 space-y-4 h-fit"
                >
                  <h2 className="text-lg font-extrabold text-neutral-900">
                    나눔터 새 글 작성
                  </h2>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-neutral-300 text-sm"
                    >
                      <option value="공지사항">공지사항</option>
                      <option value="나눔글">나눔글</option>
                      <option value="스토리">스토리</option>
                      <option value="기도제목">기도제목</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      내용
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="내용을 입력하세요"
                      className="w-full p-4 rounded-xl border border-neutral-300 text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="accent-[#60984B]"
                    />
                    상단 공지 고정
                  </label>
                  <button
                    type="submit"
                    disabled={savingPost}
                    className="w-full h-11 rounded-xl bg-[#60984B] hover:bg-[#31702D] text-white text-sm font-bold cursor-pointer"
                  >
                    {savingPost ? "등록 중..." : "게시글 등록"}
                  </button>
                </form>

                {/* Existing Posts & Comment Moderation */}
                <div className="lg:col-span-7 space-y-4">
                  {(overview?.posts ?? []).map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            {post.pinned && (
                              <span className="px-2 py-0.5 rounded-full bg-[#60984B] text-white font-bold">
                                고정
                              </span>
                            )}
                            <span className="font-bold text-[#31702D]">
                              {post.category}
                            </span>
                            <span className="text-neutral-400">
                              · {post.created_at.slice(0, 10)}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-neutral-900 mt-1">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => void handleTogglePin(post)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                          >
                            {post.pinned ? "해제" : "고정"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeletePost(post.id)}
                            className="px-2.5 py-1 rounded-lg border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {post.comments.length > 0 && (
                        <div className="pt-2 border-t border-neutral-100 space-y-2">
                          <p className="text-xs font-bold text-neutral-500">
                            댓글 {post.comments.length}개
                          </p>
                          {post.comments.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-center justify-between gap-2 text-xs bg-[#FEFEF4] px-3 py-2 rounded-lg"
                            >
                              <span className="text-neutral-700 truncate">
                                <strong className="mr-1.5">{c.author_name}:</strong>
                                {c.content}
                              </span>
                              <button
                                type="button"
                                onClick={() => void handleDeleteComment(c.id)}
                                className="text-red-600 font-bold shrink-0 cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "users" ? (
              <div className="bg-white rounded-3xl border border-neutral-200 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FEFEF4] border-b border-neutral-200 text-xs font-bold text-neutral-600">
                      <th className="py-3.5 px-5">회원</th>
                      <th className="py-3.5 px-5">이메일</th>
                      <th className="py-3.5 px-5">가입경로</th>
                      <th className="py-3.5 px-5">소속</th>
                      <th className="py-3.5 px-5">역할</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-sm">
                    {(overview?.users ?? []).map((u) => (
                      <tr key={u.id}>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              name={u.name}
                              avatarUrl={u.avatarUrl}
                              className="w-8 h-8 rounded-full object-cover"
                              fallbackClassName="w-8 h-8 rounded-full bg-[#60984B] text-white flex items-center justify-center text-xs font-extrabold"
                            />
                            <span className="font-bold text-neutral-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-neutral-600">{u.email}</td>
                        <td className="py-3.5 px-5 uppercase text-xs font-bold text-neutral-500">
                          {u.provider}
                        </td>
                        <td className="py-3.5 px-5 text-neutral-600">
                          {u.parish || "새가족"}
                        </td>
                        <td className="py-3.5 px-5">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              void handleRoleChange(
                                u.id,
                                e.target.value as AuthenticatedRole
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                              u.role === "admin"
                                ? "bg-amber-50 border-amber-300 text-amber-900"
                                : "bg-white border-neutral-300 text-neutral-700"
                            }`}
                          >
                            <option value="member">로그인사용자 (member)</option>
                            <option value="admin">관리자 (admin)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-neutral-200 overflow-x-auto">
                {(overview?.applications ?? []).length === 0 ? (
                  <p className="p-10 text-center text-sm text-neutral-500">
                    접수된 온라인 신청 내역이 없습니다.
                  </p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FEFEF4] border-b border-neutral-200 text-xs font-bold text-neutral-600">
                        <th className="py-3.5 px-5">구분</th>
                        <th className="py-3.5 px-5">신청자</th>
                        <th className="py-3.5 px-5">연락처</th>
                        <th className="py-3.5 px-5">내용</th>
                        <th className="py-3.5 px-5">상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-sm">
                      {(overview?.applications ?? []).map((app) => (
                        <tr key={app.id}>
                          <td className="py-3.5 px-5 font-bold text-[#31702D]">
                            {app.service_title}
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-neutral-900">
                            {app.applicant_name}
                          </td>
                          <td className="py-3.5 px-5 text-neutral-600">{app.contact}</td>
                          <td className="py-3.5 px-5 text-neutral-600 max-w-xs truncate">
                            {app.note}
                          </td>
                          <td className="py-3.5 px-5">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                void handleApplicationStatus(app.id, e.target.value)
                              }
                              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                            >
                              <option value="접수완료">접수완료</option>
                              <option value="처리중">처리중</option>
                              <option value="완료">완료</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
