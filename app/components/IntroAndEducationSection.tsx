import { EDUCATION_CARDS } from "../data/churchData";

const INTRO_CARDS = [
  {
    title: "교회소개",
    desc: "church19의 비전과 걸어온 길",
    href: "#sitemap",
  },
  {
    title: "새가족안내",
    desc: "등록 및 새가족 양육 과정",
    href: "#online",
  },
  {
    title: "예배안내",
    desc: "주일·수요·금요·새벽 예배시간",
    href: "#worship",
  },
  {
    title: "생명사역 훈련원",
    desc: "제자훈련 및 사역자 양육",
    href: "#education",
  },
];

export default function IntroAndEducationSection() {
  return (
    <>
      {/* Section: church19 소개 (#section-1 style) */}
      <section
        id="intro"
        className="relative py-24 lg:py-32 px-5 lg:px-8 bg-gradient-to-br from-[#f3f8f0] via-white to-[#eef6f5] overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-[#60984B]/8 blur-3xl"
        />
        <div className="max-w-[1140px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              About church19
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-snug">
              church19를 소개합니다.
            </h2>
            <div className="w-16 border-t-[3px] border-neutral-900" />
            <p className="text-lg text-neutral-700 leading-relaxed font-medium">
              생명사역, 교회소개, 섬기는 사람들 등 자세한 안내를 받으실 수 있습니다.
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed">
              복음의 본질 위에 세워진 건강한 공동체, 다음 세대와 지역 사회를 섬기는
              church19의 문은 언제나 열려 있습니다.
            </p>
          </div>

          {/* Right 2x2 Outlined Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INTRO_CARDS.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group h-44 rounded-3xl border-[3px] border-neutral-900 bg-white/80 hover:border-[#6A9F59] hover:bg-[#88B170]/12 transition-all duration-200 flex flex-col items-center justify-center p-6 text-center shadow-xs"
              >
                <h3 className="text-2xl font-extrabold text-neutral-900 group-hover:text-[#31702D] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-2">{card.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section: 교육·훈련 (#section-3 style) */}
      <section
        id="education"
        className="bg-[#FEFEF4] py-24 lg:py-28 px-5 lg:px-8 border-t border-neutral-200/60"
      >
        <div className="max-w-[1140px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-lg sm:text-xl font-bold text-[#94BAC3]">
                사람을 살리고, 키우고, 고치는 생명사역 공동체
              </p>
              <div className="w-20 border-t border-neutral-900 my-4" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900">
                교육·훈련
              </h2>
            </div>
            <p className="text-base text-neutral-500 max-w-md leading-relaxed">
              우리는 신앙교육공동체로서 회심한 그리스도인으로 양육하여 생명사역자가 되도록 합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EDUCATION_CARDS.map((item) => (
              <a
                key={item.id}
                href="#sitemap"
                className="group block hover-float-loop"
              >
                <div
                  className={`h-72 rounded-3xl bg-gradient-to-br ${item.gradient} p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10"
                  />
                  <span className="inline-block self-start px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold tracking-wider">
                    {item.badge}
                  </span>
                  <div>
                    <p className="text-xs text-white/75 font-semibold">
                      {item.subtitle}
                    </p>
                    <p className="text-sm text-white/90 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <h3 className="text-center text-xl font-extrabold text-neutral-900 mt-5 group-hover:text-[#60984B] transition-colors">
                  {item.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
