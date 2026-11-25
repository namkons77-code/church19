"use client";

import { useState } from "react";

export default function HeroSection() {
  const [showLiveModal, setShowLiveModal] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950 text-white"
    >
      {/* Atmospheric Sanctuary Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(96,152,75,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(90,173,167,0.28),_transparent_55%),linear-gradient(160deg,#0b1712_0%,#11241c_45%,#091311_100%)]"
      />
      {/* Subtle Architectural Grid / Light Rays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative z-10 max-w-[1140px] mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium tracking-wider text-[#B6DC9F] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#7FA550] animate-pulse" />
          church19 · LIFE MINISTRY COMMUNITY
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl">
          복음으로 사람을{" "}
          <span className="text-[#8FD17A]">살리고, 키우고, 고치는</span>
          <br className="hidden sm:block" /> 생명사역 공동체
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
          예배의 감격이 삶의 현장으로 이어지는 곳, church19에 오신 것을 환영합니다.
          말씀과 기도, 따뜻한 공동체 안에서 하나님 나라의 비전을 함께 세워갑니다.
        </p>

        {/* Central Play / Live Worship Button (inspired by #section-0 .videoBTN) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setShowLiveModal(true)}
            className="group inline-flex items-center gap-3.5 px-7 py-4 rounded-full bg-[#60984B] hover:bg-[#7FA550] text-white font-bold text-base shadow-lg shadow-[#60984B]/30 transition-all duration-200 cursor-pointer"
          >
            <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span>실시간 예배 · 설교 영상</span>
          </button>

          <a
            href="#intro"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/35 bg-white/5 hover:bg-white hover:text-neutral-900 text-white font-semibold text-base transition-all duration-200"
          >
            새가족 · 교회안내
          </a>
        </div>

        {/* Worship Quick Info Bar */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full max-w-3xl bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-left">
          <div>
            <p className="text-xs text-[#A8D695] font-semibold">주일예배</p>
            <p className="text-sm sm:text-base font-bold mt-0.5">1~4부 (07:30~14:00)</p>
          </div>
          <div>
            <p className="text-xs text-[#A8D695] font-semibold">수요예배</p>
            <p className="text-sm sm:text-base font-bold mt-0.5">수요일 오후 7:30</p>
          </div>
          <div>
            <p className="text-xs text-[#A8D695] font-semibold">금요기도집회</p>
            <p className="text-sm sm:text-base font-bold mt-0.5">금요일 오후 8:30</p>
          </div>
          <div>
            <p className="text-xs text-[#A8D695] font-semibold">새벽기도회</p>
            <p className="text-sm sm:text-base font-bold mt-0.5">월~토 오전 5:30</p>
          </div>
        </div>
      </div>

      {/* Scroll Down Cue */}
      <a
        href="#worship"
        aria-label="예배와 말씀 섹션으로 스크롤"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors"
      >
        <span className="text-[11px] tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>

      {/* Worship Video Preview Modal */}
      {showLiveModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLiveModal(false)}
        >
          <div
            className="bg-neutral-900 border border-white/15 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-[#7FA550] uppercase tracking-wider">
                  church19 Live &amp; Sermon
                </span>
                <h3 className="text-xl font-bold mt-0.5">주일예배 실시간 및 최근 설교</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-[#162b22] to-[#0b1511] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#60984B]/90 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-lg font-bold">합리주의의 함정을 넘어 믿음의 길로</p>
              <p className="text-sm text-white/65 mt-1">고린도전서 1:18~25 · church19 담임목사</p>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <a
                href="#worship"
                onClick={() => setShowLiveModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#60984B] hover:bg-[#7FA550] text-sm font-bold transition-colors"
              >
                전체 말씀 보러가기
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
