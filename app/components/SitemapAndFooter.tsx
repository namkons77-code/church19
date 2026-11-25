"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_CATEGORIES } from "../data/churchData";
import Footer from "./Footer";

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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
                church19 Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                한눈에 보는 church19 사역 안내
              </h2>
            </div>
            <Link
              href={activeCategory.href}
              className="text-sm font-bold text-[#31702D] hover:underline self-start sm:self-end"
            >
              {activeCategory.label} 페이지로 이동 →
            </Link>
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
                <Link
                  href={sub.href}
                  className="block px-4 py-3 border-2 border-[#60984B] text-neutral-900 font-bold text-base hover:bg-[#60984B] hover:text-white transition-colors"
                >
                  {sub.label}
                </Link>
                {sub.children && (
                  <ul className="space-y-2 pl-2">
                    {sub.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="text-sm text-neutral-600 hover:text-[#31702D] hover:font-semibold transition-colors"
                        >
                          · {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
