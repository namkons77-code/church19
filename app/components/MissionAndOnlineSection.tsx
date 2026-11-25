"use client";

import { useState } from "react";
import { MISSION_PARTS, ONLINE_SERVICES } from "../data/churchData";

export default function MissionAndOnlineSection() {
  const [activeService, setActiveService] = useState<(typeof ONLINE_SERVICES)[number] | null>(
    null
  );

  return (
    <>
      {/* Section: 선교 (#section-4 style) */}
      <section
        id="mission"
        className="relative py-24 lg:py-28 px-5 lg:px-8 bg-gradient-to-br from-[#1b3a2c] via-[#264e3b] to-[#132920] text-white overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,#81A652_0%,transparent_45%),radial-gradient(circle_at_80%_70%,#5AADA7_0%,transparent_45%)]"
        />

        <div className="max-w-[1140px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold tracking-widest uppercase text-[#B6DC9F]">
                World Mission
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold">선교</h2>
              <p className="text-xl sm:text-2xl font-bold text-[#CBE8B8]">
                church19 세계선교회
              </p>
              <p className="text-base text-white/80 leading-relaxed pt-1">
                &ldquo;너희는 온 천하에 다니며 만민에게 복음을 전파하라&rdquo;
                <br />
                지역 복음화! 한국 복음화! 세계선교회!
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="#sitemap"
                  className="px-7 py-3 rounded-full bg-white text-neutral-900 hover:bg-neutral-950 hover:text-white font-bold text-sm transition-colors"
                >
                  바로가기
                </a>
                <a
                  href="#worship"
                  className="px-7 py-3 rounded-full bg-white/15 border border-white/35 text-white hover:bg-white hover:text-neutral-900 font-bold text-sm transition-colors"
                >
                  선교영상
                </a>
              </div>
            </div>

            <a
              href="#mission"
              className="text-sm font-bold text-white/85 hover:text-white inline-flex items-center gap-1.5 self-start lg:self-end"
            >
              <span>선교 소식 더보기</span>
              <span>→</span>
            </a>
          </div>

          {/* Multicultural Worship Bar */}
          <div className="bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {MISSION_PARTS.map((part) => (
              <div
                key={part.id}
                className="flex items-center gap-5 py-4 md:py-2 md:px-6 first:pt-0 last:pb-0 hover-float"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#60984B]/12 border border-[#60984B]/30 flex items-center justify-center shrink-0">
                  <span className="text-lg font-black text-[#31702D]">{part.code}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">{part.en}</p>
                  <h3 className="text-xl font-extrabold text-neutral-900 mt-0.5">
                    {part.ko}
                  </h3>
                  <p className="text-xs font-bold text-[#81A652] mt-1">{part.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: 온라인신청 (#section-5 style) */}
      <section
        id="online"
        className="py-24 lg:py-28 px-5 lg:px-8 bg-gradient-to-b from-white to-[#f6f9f4]"
      >
        <div className="max-w-[1140px] mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Online Services
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mt-2">
              온라인신청
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mt-4 leading-relaxed">
              교육훈련신청 / 온라인헌금 / 온라인서류발급 / 교회장소·차량신청 등
              온라인으로 쉽고 빠르게 예약하고 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {ONLINE_SERVICES.map((svc, idx) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => setActiveService(svc)}
                className="group w-44 h-44 sm:w-52 sm:h-52 rounded-full border-[3px] border-neutral-900 bg-white hover:bg-neutral-950 hover:text-white transition-all duration-200 flex flex-col items-center justify-center p-5 text-center cursor-pointer shadow-sm"
              >
                <span className="w-10 h-10 rounded-full bg-[#60984B]/12 text-[#31702D] group-hover:bg-[#7FA550] group-hover:text-white flex items-center justify-center font-extrabold text-sm mb-3 transition-colors">
                  0{idx + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {svc.title}
                </h3>
                <p className="text-xs text-neutral-500 group-hover:text-white/75 mt-1.5">
                  {svc.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Online Service Modal */}
        {activeService && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveService(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-neutral-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#60984B] uppercase tracking-wider">
                    church19 Online
                  </span>
                  <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">
                    {activeService.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
                {activeService.description}
              </p>
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="px-5 py-2.5 rounded-full bg-[#60984B] hover:bg-[#31702D] text-white text-sm font-bold cursor-pointer"
                >
                  신청 페이지로 이동
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
