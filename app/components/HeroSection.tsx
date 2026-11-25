"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroSlide {
  id: string;
  imageUrl: string;
  imageAlt: string;
  sourceLabel: string;
  title: string;
  subtitleLines: string[];
  ctaLabel: string;
  ctaHref: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    imageUrl:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "찬양과 경배 가운데 손을 들고 예배하는 성도들",
    sourceLabel: "Unsplash",
    title: "복음으로 사람을 살리고, 키우고, 고치는 교회",
    subtitleLines: [
      "church19는 하나님의 계획 가운데 세워진 생명사역 공동체입니다.",
      "이 시대에 하나님의 참다운 뜻을 알리고 영혼을 살리는 교회로 나아갑니다.",
    ],
    ctaLabel: "church19 소개 바로가기",
    ctaHref: "/ministry",
  },
  {
    id: "slide-2",
    imageUrl:
      "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "맑은 하늘 아래 자리한 현대적 교회 건축물과 십자가",
    sourceLabel: "Unsplash",
    title: "한국교회와 다음 세대를 세우는 생명사역",
    subtitleLines: [
      "church19는 신앙교육공동체로서 다음 세대와 온 성도를",
      "말씀과 제자훈련으로 건강하게 양육하고 있습니다.",
    ],
    ctaLabel: "교육·훈련 안내 바로가기",
    ctaHref: "/education",
  },
  {
    id: "slide-3",
    imageUrl:
      "https://images.pexels.com/photos/15852743/pexels-photo-15852743.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "푸른 하늘을 배경으로 서 있는 교회 지붕 위의 십자가",
    sourceLabel: "Pexels",
    title: "하나님 사랑, 이웃 사랑을 실천하는 공동체",
    subtitleLines: [
      "지역 사회와 열방을 향해 복음의 빛을 비추며",
      "세상을 섬기고 치유하는 선교적 사명을 감당합니다.",
    ],
    ctaLabel: "세계선교 안내 바로가기",
    ctaHref: "/mission",
  },
  {
    id: "slide-4",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "묵상과 말씀 읽기를 위해 펼쳐진 책과 따뜻한 아침 풍경",
    sourceLabel: "Unsplash",
    title: "매일의 삶 속에서 누리는 말씀과 기도의 은혜",
    subtitleLines: [
      "주일예배와 수요예배, 금요기도집회와 새벽기도회를 통해",
      "날마다 새로워지는 영적 회복을 경험하시기 바랍니다.",
    ],
    ctaLabel: "예배와 말씀 바로가기",
    ctaHref: "/worship",
  },
];

const AUTOPLAY_INTERVAL_MS = 5500;

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, goNext, currentIndex]);

  return (
    <section
      id="hero"
      aria-label="church19 메인 비주얼 캐러셀"
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-neutral-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(deltaX) > 45) {
          if (deltaX > 0) goPrev();
          else goNext();
        }
        touchStartX.current = null;
      }}
      tabIndex={0}
    >
      {/* Full-Bleed Slides */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Photo with subtle zoom */}
            <div
              className={`relative w-full h-full transition-transform duration-[6000ms] ease-out ${
                isActive ? "scale-100" : "scale-105"
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            {/* 52ch.kr style Dark Overlay Gradient */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
            />

            {/* Centered Text & CTA (52ch.kr slider-text-inner layout) */}
            <div className="relative z-20 h-full max-w-[1140px] mx-auto px-6 sm:px-12 flex flex-col items-center justify-center text-center pt-16">
              <div
                className={`transition-all duration-700 ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-medium leading-tight tracking-tight text-white drop-shadow-md max-w-4xl mx-auto">
                  {slide.title}
                </h1>

                <p className="mt-5 sm:mt-6 text-base sm:text-xl lg:text-2xl font-light text-white/90 leading-relaxed max-w-3xl mx-auto">
                  {slide.subtitleLines.map((line, lineIdx) => (
                    <span key={lineIdx} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <div className="mt-9 sm:mt-11">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-[35px] border-[3px] border-white text-white text-base sm:text-xl font-semibold tracking-tight hover:bg-white hover:text-neutral-900 transition-all duration-200 shadow-lg"
                  >
                    {slide.ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Carousel Arrow Controls */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="이전 슬라이드"
        className="hidden sm:flex absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/25 hover:bg-black/55 border border-white/25 text-white items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="다음 슬라이드"
        className="hidden sm:flex absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/25 hover:bg-black/55 border border-white/25 text-white items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom Flexslider-style Pagination Dots & Pause Toggle */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2.5" role="tablist" aria-label="슬라이드 선택">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${idx + 1}번 슬라이드로 이동`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-8 bg-white/90"
                    : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? "자동 재생 시작" : "자동 재생 일시정지"}
          className="ml-1 w-7 h-7 rounded-full bg-black/30 hover:bg-black/55 border border-white/25 flex items-center justify-center text-white/85 transition-colors cursor-pointer"
        >
          {isPaused ? (
            <svg className="w-3 h-3 fill-current translate-x-[0.5px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
