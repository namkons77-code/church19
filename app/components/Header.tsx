"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_CATEGORIES } from "../data/churchData";
import { useAuth } from "./AuthProvider";
import UserAvatar from "./UserAvatar";

const PROVIDER_LABELS: Record<string, string> = {
  email: "이메일",
  kakao: "카카오",
  google: "Google",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/profile" ||
    pathname === "/admin" ||
    pathname.startsWith("/oauth");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidHeader = scrolled || isAuthPage;

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    router.refresh();
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidHeader
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 text-neutral-900"
          : "bg-black/25 backdrop-blur-xs border-b border-white/15 text-white"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo: church19 */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="church19 홈으로 이동"
        >
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              solidHeader
                ? "bg-[#60984B] text-white"
                : "bg-white/15 text-white border border-white/30"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18" />
              <path d="M6 9h12" />
            </svg>
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight">
              church<span className="text-[#7FA550]">19</span>
            </span>
            <span
              className={`text-[10px] tracking-widest uppercase mt-0.5 ${
                solidHeader ? "text-neutral-500" : "text-white/70"
              }`}
            >
              Life Ministry
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="주 메뉴">
          {NAV_CATEGORIES.map((cat) => {
            const isCurrent =
              pathname === cat.href || pathname.startsWith(`${cat.href}/`);
            return (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setOpenDropdown(cat.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={cat.href}
                  className={`relative px-3.5 py-2 text-[15px] font-bold tracking-wide rounded-full transition-all duration-200 inline-block ${
                    isCurrent || openDropdown === cat.id
                      ? "bg-[#7FA550] text-white"
                      : solidHeader
                        ? "text-neutral-800 hover:bg-[#7FA550] hover:text-white"
                        : "text-white hover:bg-[#7FA550] hover:text-white"
                  }`}
                >
                  {cat.label}
                </Link>

                {/* Dropdown Panel */}
                {openDropdown === cat.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-52 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-neutral-100 py-2.5 px-2 text-neutral-800">
                      {cat.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-[#60984B]/10 hover:text-[#31702D] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Auth & Utility Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!loading && user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors ${
                    pathname === "/admin"
                      ? "bg-amber-500 text-white"
                      : solidHeader
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        : "bg-amber-400/90 text-neutral-950 hover:bg-amber-300"
                  }`}
                >
                  관리자
                </Link>
              )}
              <Link
                href="/profile"
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  solidHeader
                    ? "bg-[#FEFEF4] border-neutral-200 text-neutral-800 hover:border-[#60984B]"
                    : "bg-white/15 border-white/25 text-white hover:bg-white/25"
                }`}
              >
                <UserAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  className="w-6 h-6 rounded-full object-cover border border-white/40"
                  fallbackClassName="w-6 h-6 rounded-full bg-[#60984B] text-white flex items-center justify-center text-[11px] font-extrabold"
                />
                <span className="px-1.5 py-0.5 rounded-full bg-[#60984B] text-white text-[10px]">
                  {user.role === "admin"
                    ? "관리자"
                    : PROVIDER_LABELS[user.provider] ?? user.provider}
                </span>
                <span>{user.name}님</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  solidHeader
                    ? "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                    : "border-white/35 text-white hover:bg-white/15"
                }`}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  solidHeader
                    ? "border-neutral-300 text-neutral-700 hover:border-[#60984B] hover:text-[#60984B]"
                    : "border-white/35 text-white hover:bg-white/15"
                }`}
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  solidHeader
                    ? "bg-[#60984B] text-white hover:bg-[#31702D]"
                    : "bg-white text-neutral-900 hover:bg-[#FEFEF4]"
                }`}
              >
                회원가입
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`xl:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              solidHeader
                ? "text-neutral-800 hover:bg-neutral-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="모바일 메뉴 열기"
            aria-expanded={mobileOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white text-neutral-900 border-t border-neutral-200 shadow-xl max-h-[82vh] overflow-y-auto">
          <div className="px-5 py-4 space-y-4">
            {/* Mobile Auth Bar */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-bold text-neutral-900"
                  >
                    <UserAvatar
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                      fallbackClassName="w-7 h-7 rounded-full bg-[#60984B] text-white flex items-center justify-center text-xs font-extrabold"
                    />
                    <span>{user.name}님 · 프로필</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold"
                      >
                        관리자
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-3.5 py-1.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-700"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 w-full">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-neutral-300 text-center text-sm font-bold text-neutral-800"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-[#60984B] text-center text-sm font-bold text-white"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>

            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.id} className="border-b border-neutral-100 pb-3 last:border-none">
                <Link
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-bold text-base text-[#31702D] mb-1.5"
                >
                  {cat.label}
                </Link>
                <div className="flex flex-wrap gap-2">
                  {cat.subItems.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 hover:bg-[#60984B]/15"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
