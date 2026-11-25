"use client";

import { useState } from "react";
import { SERMONS, WORSHIP_CATEGORIES } from "../data/churchData";

export default function WorshipSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("sunday");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const activeSermon = SERMONS[selectedCategory] ?? SERMONS.sunday;

  return (
    <section
      id="worship"
      className="bg-[#FEFEF4] py-24 lg:py-28 px-5 lg:px-8 border-b border-neutral-200/60"
    >
      <div className="max-w-[1140px] mx-auto">
        {/* Featured Sermon Spotlight */}
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl border border-neutral-200/80 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#5F9848]/12 text-[#5F9848] text-sm font-bold">
                  {activeSermon.category}
                </span>
                <span className="text-[#5F9848] font-bold text-lg tracking-tight">
                  {activeSermon.date}
                </span>
                <span className="text-sm text-neutral-500">
                  · {activeSermon.duration}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#5AADA7] leading-tight tracking-tight">
                {activeSermon.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-lg font-semibold text-neutral-800 pt-1">
                <span>{activeSermon.pastor}</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-600 font-medium">
                  {activeSermon.scripture}
                </span>
              </div>

              <p className="text-neutral-600 text-base leading-relaxed pt-1">
                {activeSermon.summary}
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() =>
                  setPlayingId(playingId === activeSermon.id ? null : activeSermon.id)
                }
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-neutral-950 text-white hover:bg-white hover:text-neutral-950 border-2 border-neutral-950 font-bold text-lg transition-all duration-200 cursor-pointer shadow-md"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  {playingId === activeSermon.id ? (
                    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
                <span>{playingId === activeSermon.id ? "재생 중지" : "말씀 듣기"}</span>
              </button>
            </div>
          </div>

          {playingId === activeSermon.id && (
            <div className="mt-6 pt-5 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FEFEF4] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#5F9848] animate-ping" />
                <span className="text-sm font-bold text-neutral-800">
                  현재 재생 중: {activeSermon.title} ({activeSermon.scripture})
                </span>
              </div>
              <div className="w-full sm:w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#5AADA7] rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* 5 Worship Category Selector Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {WORSHIP_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const sermon = SERMONS[cat.id];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`group text-left p-5 rounded-2xl border transition-all duration-200 hover-float cursor-pointer flex items-center lg:flex-col lg:items-start gap-4 ${
                  isActive
                    ? "bg-white border-[#60984B] ring-2 ring-[#60984B]/20 shadow-md"
                    : "bg-white/70 border-neutral-200/80 hover:bg-white hover:border-[#60984B]/50"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-bold text-white transition-colors ${
                    isActive
                      ? "bg-[#60984B]"
                      : "bg-neutral-800 group-hover:bg-[#5AADA7]"
                  }`}
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    {cat.label}
                  </h3>
                  <p className="text-xs font-bold text-[#31702D] mt-0.5 truncate">
                    {sermon.date}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                    {cat.time}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
