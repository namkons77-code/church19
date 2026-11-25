"use client";

import { useEffect, useState } from "react";
import { NAV_CATEGORIES } from "../data/churchData";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 text-neutral-900"
          : "bg-black/25 backdrop-blur-xs border-b border-white/15 text-white"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: church19 */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="church19 홈으로 이동"
        >
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              scrolled
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
                scrolled ? "text-neutral-500" : "text-white/70"
              }`}
            >
              Life Ministry
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="주 메뉴">
          {NAV_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => setOpenDropdown(cat.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={cat.href}
                className={`relative px-4 py-2.5 text-[15px] font-bold tracking-wide rounded-full transition-all duration-200 inline-block ${
                  openDropdown === cat.id
                    ? "bg-[#7FA550] text-white"
                    : scrolled
                      ? "text-neutral-800 hover:bg-[#7FA550] hover:text-white"
                      : "text-white hover:bg-[#7FA550] hover:text-white"
                }`}
              >
                {cat.label}
              </a>

              {/* Dropdown Panel */}
              {openDropdown === cat.id && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-52 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-neutral-100 py-2.5 px-2 text-neutral-800">
                    {cat.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-[#60984B]/10 hover:text-[#31702D] transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#online"
            className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              scrolled
                ? "border-neutral-300 text-neutral-700 hover:border-[#60984B] hover:text-[#60984B]"
                : "border-white/35 text-white hover:bg-white/15"
            }`}
          >
            온라인행정
          </a>
          <a
            href="#sitemap"
            className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              scrolled
                ? "bg-[#60984B] text-white hover:bg-[#31702D]"
                : "bg-white text-neutral-900 hover:bg-[#FEFEF4]"
            }`}
          >
            <span>전체메뉴</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-neutral-800 hover:bg-neutral-100" : "text-white hover:bg-white/10"
            }`}
            aria-label="모바일 메뉴 열기"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
        <div className="lg:hidden bg-white text-neutral-900 border-t border-neutral-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-5 py-4 space-y-3">
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.id} className="border-b border-neutral-100 pb-3 last:border-none">
                <a
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-bold text-base text-[#31702D] mb-1.5"
                >
                  {cat.label}
                </a>
                <div className="flex flex-wrap gap-2">
                  {cat.subItems.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 hover:bg-[#60984B]/15"
                    >
                      {sub.label}
                    </a>
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
