"use client";

import { useState } from "react";
import {
  GALLERY_ITEMS,
  MINISTRY_STORIES,
  NEWSROOM_ITEMS,
  NOTICES,
  PRESS_ITEMS,
} from "../data/churchData";

export default function NewsSection() {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  return (
    <section id="news" className="bg-white py-24 px-5 lg:px-8 space-y-24">
      {/* 1. church19 뉴스룸 */}
      <div className="max-w-[1140px] mx-auto">
        <div className="flex items-end justify-between border-b-2 border-neutral-900 pb-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              church19 Newsroom
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              church19 뉴스룸
            </h2>
          </div>
          <a
            href="#news"
            className="text-sm font-bold text-neutral-600 hover:text-[#60984B] transition-colors"
          >
            전체보기 +
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Video News */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1f3b2c] via-[#274b39] to-[#13261d] text-white p-8 flex flex-col justify-between min-h-[280px] relative group">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
                영상뉴스
              </span>
              <span className="text-sm text-white/70">2026-11-22</span>
            </div>
            <div className="my-6">
              <h3 className="text-2xl font-extrabold leading-snug">
                church19 주간 영상뉴스
                <br />
                1. 추수감사주일 · 2. 순장 소풍
              </h3>
              <p className="text-sm text-white/75 mt-2">
                지난 한 주간 church19 공동체에 허락하신 은혜의 현장을 영상으로 나눕니다.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#7FA550] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-sm font-bold">영상뉴스 보기</span>
            </div>
          </div>

          {/* Newsroom List */}
          <div className="lg:col-span-6 flex flex-col justify-between divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {NEWSROOM_ITEMS.map((item) => (
              <a
                key={item.id}
                href="#news"
                className="py-4 px-2 flex items-center justify-between gap-4 hover:bg-[#FEFEF4] transition-colors group"
              >
                <span className="font-semibold text-neutral-800 group-hover:text-[#60984B] transition-colors truncate">
                  {item.title}
                </span>
                <span className="text-sm text-neutral-400 shrink-0">{item.date}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 생명사역 스토리 + 공지사항 + 포토 갤러리 */}
      <div className="max-w-[1140px] mx-auto border-t border-b border-[#60994C] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: 생명사역 스토리 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
                <span>생명사역 스토리</span>
                <span className="w-6 h-6 rounded-full bg-[#60984B]/15 text-[#60984B] text-base flex items-center justify-center">
                  +
                </span>
              </h3>
            </div>
            <div className="divide-y divide-neutral-200">
              {MINISTRY_STORIES.map((story) => (
                <article key={story.id} className="py-5 first:pt-0 last:pb-0 group">
                  <a href="#news" className="flex items-start gap-4">
                    <div
                      className={`w-24 h-24 rounded-xl shrink-0 bg-gradient-to-br ${story.accentColor} text-white flex flex-col items-center justify-center p-2 text-center shadow-xs`}
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                        church19
                      </span>
                      <span className="text-xs font-extrabold mt-0.5">{story.tag}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#60984B] transition-colors line-clamp-1">
                        {story.title}
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {story.excerpt}
                      </p>
                      <span className="inline-block text-xs text-neutral-400 mt-2">
                        {story.date}
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* Right: 공지사항 + 포토 갤러리 */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
                  <span>공지사항</span>
                  <span className="w-6 h-6 rounded-full bg-[#60984B]/15 text-[#60984B] text-base flex items-center justify-center">
                    +
                  </span>
                </h3>
              </div>
              <ul className="divide-y divide-neutral-200/80">
                {NOTICES.map((notice) => (
                  <li key={notice.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedNotice(selectedNotice === notice.id ? null : notice.id)
                      }
                      className="w-full py-3 flex items-center justify-between gap-4 text-left hover:text-[#60984B] transition-colors cursor-pointer"
                    >
                      <span className="text-[15px] font-medium text-neutral-800 truncate">
                        {notice.title}
                      </span>
                      <span className="text-sm text-neutral-400 shrink-0">
                        {notice.date}
                      </span>
                    </button>
                    {selectedNotice === notice.id && (
                      <p className="pb-3 text-xs text-neutral-600 bg-[#FEFEF4] px-3 py-2 rounded-lg mb-2">
                        [안내] 자세한 일정 및 참여 신청은 church19 온라인신청 또는 교회사무실(053-756-1701)로 문의해 주세요.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 포토 갤러리 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-neutral-900">
                  사역 포토 갤러리
                </h3>
                <span className="text-xs font-semibold text-[#60984B]">GALLERY</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GALLERY_ITEMS.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div
                      className={`h-24 rounded-xl bg-gradient-to-br ${item.gradient} border border-neutral-200/70 flex items-end p-2.5 overflow-hidden group-hover:scale-[1.03] transition-transform`}
                    >
                      <span className="text-[10px] font-bold text-neutral-700 bg-white/80 px-2 py-0.5 rounded-full">
                        {item.date.slice(5)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-neutral-800 mt-2 truncate">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRESS ROOM */}
      <div className="max-w-[1140px] mx-auto">
        <div className="flex items-end justify-between border-b-2 border-neutral-900 pb-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#5AADA7]">
              Media &amp; Press
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              PRESS ROOM
            </h2>
          </div>
          <a
            href="#news"
            className="text-sm font-bold text-neutral-600 hover:text-[#60984B] transition-colors"
          >
            전체보기 +
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 rounded-2xl bg-[#FEFEF4] border border-neutral-200 p-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#60984B]">
                {PRESS_ITEMS[0].date}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-2 leading-snug">
                {PRESS_ITEMS[0].title}
              </h3>
              <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
                선교단체와 지역교회가 연합하는 초교파적 선교 동원 운동에 church19가 함께 참여하여,
                다음 세대 선교 비전과 지역교회 제자훈련의 방향을 나눕니다.
              </p>
            </div>
            <a
              href="#news"
              className="mt-6 inline-flex items-center text-sm font-bold text-[#31702D] hover:underline"
            >
              기사 전문 보기 →
            </a>
          </div>

          <div className="lg:col-span-6 divide-y divide-neutral-200 border-t border-b border-neutral-200 flex flex-col justify-center">
            {PRESS_ITEMS.slice(1).map((item) => (
              <a
                key={item.id}
                href="#news"
                className="py-5 px-2 flex items-center justify-between gap-4 hover:bg-[#FEFEF4] transition-colors group"
              >
                <span className="font-semibold text-neutral-800 group-hover:text-[#60984B] transition-colors">
                  {item.title}
                </span>
                <span className="text-sm text-neutral-400 shrink-0">{item.date}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
