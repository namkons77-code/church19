"use client";

import { useState } from "react";
import { NAV_CATEGORIES } from "../data/churchData";

export default function SitemapAndFooter() {
  const [activeTabId, setActiveTabId] = useState(NAV_CATEGORIES[0].id);

  const activeCategory =
    NAV_CATEGORIES.find((c) => c.id === activeTabId) ?? NAV_CATEGORIES[0];

  return (
    <>
      {/* Section: Interactive Tabbed Sitemap (#section-6 style) */}
      <section
        id="sitemap"
        className="py-24 px-5 lg:px-8 bg-gradient-to-br from-[#e9f1e5] via-[#f4f8f1] to-[#e4eff0]"
      >
        <div className="max-w-[1140px] mx-auto bg-white/92 backdrop-blur-md rounded-[36px] shadow-xl border border-white p-6 sm:p-10 lg:p-12">
          <div className="mb-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              church19 Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              한눈에 보는 church19 사역 안내
            </h2>
          </div>

          {/* Top Category Tabs */}
          <div className="flex flex-wrap gap-1 border-b-2 border-neutral-200 pb-0 overflow-x-auto">
            {NAV_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeTabId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTabId(cat.id)}
                  className={`px-4 py-3.5 text-base font-bold transition-all border-b-[3px] -mb-[2px] cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "border-[#7FA550] text-[#7FA550]"
                      : "border-transparent text-neutral-700 hover:text-[#60984B]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sub-menu 4-Column Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCategory.subItems.map((sub) => (
              <div key={sub.label} className="space-y-3">
                <a
                  href={sub.href}
                  className="block px-4 py-3 border-2 border-[#60984B] text-neutral-900 font-bold text-base hover:bg-[#60984B] hover:text-white transition-colors"
                >
                  {sub.label}
                </a>
                {sub.children && (
                  <ul className="space-y-2 pl-2">
                    {sub.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="text-sm text-neutral-600 hover:text-[#31702D] hover:font-semibold transition-colors"
                        >
                          · {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (#section-7 style: #60984B green) */}
      <footer id="footer" className="bg-[#60984B] text-white py-12 px-5 lg:px-8">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-extrabold tracking-tight">church19</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-semibold">
                생명사역 공동체
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/90">
              (우) 42078 church19 비전센터 · TEL : 053-756-1701~2 · FAX : 053-211-4763
            </p>
            <p className="text-sm text-white/80">
              E-mail : contact@church19.org
            </p>
            <p className="text-xs text-white/70 pt-2">
              Copyright © 2026 church19. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a
              href="#intro"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              교회소개
            </a>
            <a
              href="#worship"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              예배안내
            </a>
            <a
              href="#online"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              온라인신청
            </a>
            <a
              href="#hero"
              className="px-4 py-2 rounded-full bg-white text-[#31702D] hover:bg-[#FEFEF4] transition-colors font-bold"
            >
              TOP ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
