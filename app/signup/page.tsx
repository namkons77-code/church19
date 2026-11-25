"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "../components/AuthProvider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SocialAuthButtons from "../components/SocialAuthButtons";
import type { SessionUser } from "../lib/auth";

const PARISH_OPTIONS = [
  "새가족",
  "1교구",
  "2교구",
  "3교구",
  "4교구",
  "청년아포슬",
  "교회학교 학부모",
];

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [parish, setParish] = useState("새가족");
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setVerificationMsg(null);

    if (password !== passwordConfirm) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!agreed) {
      setError("이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, parish }),
      });
      const data = (await res.json()) as {
        user?: SessionUser | null;
        needsEmailVerification?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "회원가입에 실패했습니다.");
        return;
      }
      if (data.needsEmailVerification) {
        setVerificationMsg(
          data.message ??
            "인증 메일이 발송되었습니다. 이메일 인증 후 로그인해 주세요."
        );
        return;
      }
      if (!data.user) {
        setError(data.error ?? "회원가입에 실패했습니다.");
        return;
      }
      setUser(data.user);
      router.push("/profile?welcome=1");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-5 pt-28 pb-20">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Join church19
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 mt-1.5">
              회원가입
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              church19 교인 등록 및 온라인행정 서비스를 위해 계정을 만들어 주세요.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
            >
              {error}
            </div>
          )}

          {verificationMsg && (
            <div
              role="status"
              className="mb-5 px-4 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium space-y-2"
            >
              <p>{verificationMsg}</p>
              <Link
                href="/login"
                className="inline-block font-bold text-[#31702D] underline"
              >
                인증 완료 후 로그인하러 가기 →
              </Link>
            </div>
          )}

          {/* Social Quick Signup */}
          <SocialAuthButtons mode="signup" />

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-neutral-400 font-medium">
                또는 이메일로 회원가입
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-bold text-neutral-800 mb-1.5"
                >
                  이름
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-parish"
                  className="block text-sm font-bold text-neutral-800 mb-1.5"
                >
                  소속 교구 / 부서
                </label>
                <select
                  id="signup-parish"
                  value={parish}
                  onChange={(e) => setParish(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm"
                >
                  {PARISH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                이메일
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                비밀번호 (8자 이상)
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password-confirm"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                비밀번호 확인
              </label>
              <input
                id="signup-password-confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-50/50 focus:bg-white focus:border-[#60984B] focus:outline-none text-sm"
              />
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-[#60984B]"
              />
              <span className="text-xs text-neutral-600 leading-relaxed">
                church19 홈페이지{" "}
                <Link
                  href="/terms"
                  className="font-bold text-[#31702D] underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  이용약관
                </Link>{" "}
                및{" "}
                <Link
                  href="/privacy"
                  className="font-bold text-[#31702D] underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-[#60984B] hover:bg-[#31702D] disabled:opacity-60 text-white font-bold text-base transition-colors shadow-sm cursor-pointer mt-2"
            >
              {submitting ? "가입 처리 중..." : "이메일로 회원가입 완료"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-neutral-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-bold text-[#31702D] hover:underline"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
