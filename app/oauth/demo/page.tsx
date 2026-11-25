"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { useAuth } from "../../components/AuthProvider";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { SessionUser } from "../../lib/auth";

function DemoOAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const provider =
    searchParams.get("provider") === "kakao" ? "kakao" : "google";
  const isKakao = provider === "kakao";

  const [name, setName] = useState(isKakao ? "김카카오 성도" : "이구글 성도");
  const [email, setEmail] = useState(
    isKakao ? "kakao.member@church19.org" : "google.member@church19.org"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConsent(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/oauth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, name, email }),
      });
      const data = (await res.json()) as { user?: SessionUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error ?? "소셜 로그인 처리에 실패했습니다.");
        return;
      }
      setUser(data.user);
      router.push(data.user.profileCompleted ? "/" : "/profile?welcome=1");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl border border-neutral-200 p-8 sm:p-9">
      <div className="text-center mb-6">
        <div
          className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 font-extrabold text-xl ${
            isKakao
              ? "bg-[#FEE500] text-[#191919]"
              : "bg-neutral-100 text-neutral-900 border border-neutral-200"
          }`}
        >
          {isKakao ? "K" : "G"}
        </div>
        <h1 className="text-xl font-extrabold text-neutral-900">
          {isKakao ? "카카오계정으로 로그인" : "Google 계정으로 로그인"}
        </h1>
        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
          현재 환경에{" "}
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
            {isKakao ? "KAKAO_CLIENT_ID" : "GOOGLE_CLIENT_ID"}
          </code>{" "}
          가 설정되지 않아 개발용 OAuth 동의 화면으로 연결되었습니다.
          <br />
          아래 계정 정보로 즉시 로그인 세션을 생성할 수 있습니다.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleConsent} className="space-y-4">
        <div>
          <label
            htmlFor="oauth-name"
            className="block text-xs font-bold text-neutral-700 mb-1"
          >
            프로필 이름
          </label>
          <input
            id="oauth-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
          />
        </div>
        <div>
          <label
            htmlFor="oauth-email"
            className="block text-xs font-bold text-neutral-700 mb-1"
          >
            연동 이메일
          </label>
          <input
            id="oauth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full h-12 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
            isKakao
              ? "bg-[#FEE500] hover:bg-[#F5DC00] text-[#191919]"
              : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"
          }`}
        >
          {submitting ? "인증 처리 중..." : "동의하고 church19 로그인"}
        </button>

        <Link
          href="/login"
          className="block w-full py-2.5 text-center text-xs font-semibold text-neutral-500 hover:text-neutral-800"
        >
          로그인 페이지로 돌아가기
        </Link>
      </form>
    </div>
  );
}

export default function DemoOAuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 pt-28 pb-20">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-9 text-sm text-neutral-500">
              OAuth 인증 화면을 준비 중입니다...
            </div>
          }
        >
          <DemoOAuthContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
