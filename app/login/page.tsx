"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { useAuth } from "../components/AuthProvider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SocialAuthButtons from "../components/SocialAuthButtons";
import type { SessionUser } from "../lib/auth";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  kakao_cancelled: "카카오 로그인이 취소되었습니다.",
  google_cancelled: "Google 로그인이 취소되었습니다.",
  invalid_state: "보안 검증(state)에 실패했습니다. 다시 시도해 주세요.",
  kakao_token_failed: "카카오 인증 토큰 발급에 실패했습니다.",
  google_token_failed: "Google 인증 토큰 발급에 실패했습니다.",
  kakao_profile_failed: "카카오 프로필 정보를 불러오지 못했습니다.",
  google_profile_failed: "Google 프로필 정보를 불러오지 못했습니다.",
  kakao_error: "카카오 로그인 중 오류가 발생했습니다.",
  google_error: "Google 로그인 중 오류가 발생했습니다.",
  oauth_cancelled: "소셜 로그인이 취소되었습니다.",
  oauth_exchange_failed:
    "외부 인증 코드 교환에 실패했습니다. (카카오 Client ID/Secret 설정을 확인해 주세요)",
  supabase_not_configured: "Supabase 환경변수가 아직 설정되지 않았습니다.",
};

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEmailVerified = searchParams.get("verified") === "1";
  const [error, setError] = useState<string | null>(() => {
    const errKey = searchParams.get("error");
    const detail = searchParams.get("detail");
    if (!errKey) return null;
    const base = OAUTH_ERROR_MESSAGES[errKey] ?? "소셜 로그인에 실패했습니다.";
    return detail ? `${base} (${detail})` : base;
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { user?: SessionUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error ?? "로그인에 실패했습니다.");
        return;
      }
      setUser(data.user);
      router.push(data.user.profileCompleted ? "/" : "/profile?welcome=1");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoAccount(kind: "member" | "admin") {
    if (kind === "admin") {
      setEmail("admin@church19.org");
      setPassword("admin19!1234");
    } else {
      setEmail("member@church19.org");
      setPassword("church19!1234");
    }
    setError(null);
  }

  if (user) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-8 sm:p-10 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#60984B]/15 text-[#31702D] mx-auto flex items-center justify-center text-2xl font-extrabold">
          {user.name.slice(0, 1)}
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#60984B] text-white text-xs font-bold mb-2">
            로그인 완료 ({user.provider.toUpperCase()})
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900">
            환영합니다, {user.name}님
          </h1>
          <p className="text-sm text-neutral-500 mt-1">{user.email}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors"
            >
              관리자 페이지
            </Link>
          )}
          <Link
            href="/profile"
            className="flex-1 py-3 rounded-xl bg-[#60984B] hover:bg-[#31702D] text-white font-bold text-sm transition-colors"
          >
            프로필 설정
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-800 hover:bg-neutral-50 font-bold text-sm transition-colors"
          >
            홈으로 이동
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold text-sm transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-8 sm:p-10">
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
          church19 Member
        </span>
        <h1 className="font-serif text-3xl font-bold text-neutral-900 mt-1.5">
          로그인
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          이메일 또는 카카오·Google 계정으로 church19 서비스를 이용하세요.
        </p>
      </div>

      {isEmailVerified && !error && (
        <div
          role="status"
          className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium"
        >
          이메일 인증이 완료되었습니다! 가입하신 이메일과 비밀번호로 로그인해 주세요.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
        >
          {error}
        </div>
      )}

      {/* Email Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-bold text-neutral-800 mb-1.5"
          >
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@church19.org"
            className="w-full h-12 px-4 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-bold text-neutral-800"
            >
              비밀번호
            </label>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoAccount("member")}
                className="text-xs font-semibold text-[#60984B] hover:underline cursor-pointer"
              >
                체험 성도
              </button>
              <span className="text-neutral-300 text-xs">|</span>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin")}
                className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
              >
                체험 관리자
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-12 pl-4 pr-16 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
            >
              {showPassword ? "숨김" : "보기"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl bg-[#60984B] hover:bg-[#31702D] disabled:opacity-60 text-white font-bold text-base transition-colors shadow-sm cursor-pointer"
        >
          {submitting ? "로그인 중..." : "이메일로 로그인"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-neutral-400 font-medium">
            또는 간편 소셜 로그인
          </span>
        </div>
      </div>

      {/* Kakao & Google OAuth */}
      <SocialAuthButtons mode="login" />

      <p className="mt-7 text-center text-sm text-neutral-600">
        아직 church19 회원이 아니신가요?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#31702D] hover:underline"
        >
          회원가입하기
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 pt-28 pb-20">
        <div className="w-full max-w-[440px]">
          <Suspense
            fallback={
              <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-10 text-center text-sm text-neutral-500">
                로그인 화면을 불러오는 중...
              </div>
            }
          >
            <LoginFormContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
