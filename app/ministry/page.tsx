import Link from "next/link";
import SubPageShell from "../components/SubPageShell";
import { NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "ministry")!;

const VISION_PILLARS = [
  {
    code: "01",
    title: "살리는 사역 (Save)",
    desc: "십자가의 복음을 선포하여 영혼이 거듭나고 하나님과 화목하게 되는 구원의 사역입니다.",
  },
  {
    code: "02",
    title: "키우는 사역 (Nurture)",
    desc: "말씀과 제자훈련, 소그룹 순모임을 통해 그리스도의 장성한 분량까지 자라가도록 양육합니다.",
  },
  {
    code: "03",
    title: "고치는 사역 (Heal)",
    desc: "상처 입은 가정과 마음을 복음과 성령의 위로로 회복시켜 건강한 공동체를 세웁니다.",
  },
];

const LEADERS = [
  { role: "담임목사", name: "김은성 목사", area: "말씀 사역 · 생명사역 총괄" },
  { role: "수석부목사", name: "박지훈 목사", area: "교구 · 양육훈련 총괄" },
  { role: "교육총괄목사", name: "이서연 목사", area: "다음세대 · 청년아포슬" },
  { role: "선교담당목사", name: "정민수 목사", area: "세계선교회 · 다문화예배" },
];

export default function MinistryPage() {
  return (
    <SubPageShell category={category}>
      {/* Vision */}
      <section id="vision" className="py-20 px-5 lg:px-8 bg-[#FEFEF4]">
        <div className="max-w-[1140px] mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Vision &amp; Core Value
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-2">
              생명사역 비전
            </h2>
            <p className="text-neutral-600 mt-3 leading-relaxed">
              church19는 복음의 능력으로 사람을 살리고, 말씀으로 키우며, 사랑으로 고치는
              건강한 신앙 공동체를 지향합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VISION_PILLARS.map((item) => (
              <div
                key={item.code}
                className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs"
              >
                <span className="inline-flex w-10 h-10 rounded-full bg-[#60984B]/12 text-[#31702D] font-extrabold text-sm items-center justify-center mb-4">
                  {item.code}
                </span>
                <h3 className="text-xl font-extrabold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CI & History */}
      <section id="ci" className="py-20 px-5 lg:px-8 bg-white border-t border-neutral-200/70">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-[#1b3a2c] to-[#28543f] text-white rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-8 h-8"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 3v18M6 9h12" />
              </svg>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">
              church<span className="text-[#8FD17A]">19</span>
            </p>
            <p className="text-xs tracking-widest uppercase text-white/70 mt-1">
              Life Ministry Community
            </p>
          </div>

          <div id="history" className="space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Identity &amp; History
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900">
              로고 CI 및 교회 연혁
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              십자가와 생명의 잎사귀를 상징하는 올리브 그린 컬러(#60984B)는 복음 안에서
              자라나는 생명력을 의미합니다.
            </p>
            <ul className="space-y-2.5 pt-2 text-sm text-neutral-700 border-t border-neutral-200">
              <li>
                <strong className="text-[#31702D] mr-3">2007</strong> church19 개척 및 생명사역 비전 선포
              </li>
              <li>
                <strong className="text-[#31702D] mr-3">2015</strong> 생명사역훈련원 개원 및 다음세대 비전센터 완공
              </li>
              <li>
                <strong className="text-[#31702D] mr-3">2022</strong> 다문화 예배부(중국·베트남·러시아) 확장
              </li>
              <li>
                <strong className="text-[#31702D] mr-3">2026</strong> 온라인 성도 플랫폼 및 통합 사역 시스템 오픈
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Leaders & Newcomer */}
      <section id="leaders" className="py-20 px-5 lg:px-8 bg-[#FEFEF4] border-t border-neutral-200/70">
        <div className="max-w-[1140px] mx-auto space-y-16">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-8">
              섬기는 분들
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {LEADERS.map((leader) => (
                <div
                  key={leader.name}
                  className="bg-white rounded-2xl border border-neutral-200 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#60984B]/12 text-[#31702D] font-extrabold text-xl mx-auto flex items-center justify-center mb-4">
                    {leader.name.slice(0, 1)}
                  </div>
                  <span className="text-xs font-bold text-[#60984B]">
                    {leader.role}
                  </span>
                  <h3 className="text-lg font-extrabold text-neutral-900 mt-1">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-2">{leader.area}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="newcomer"
            className="bg-white rounded-3xl border-2 border-[#60984B]/30 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <span className="text-xs font-bold text-[#60984B] uppercase tracking-wider">
                Welcome Newcomers
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">
                새가족 등록 및 양육 안내
              </h3>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl leading-relaxed">
                주일 예배 후 본당 로비 새가족실을 방문하시거나 온라인으로 등록하시면
                담당 교역자와 바나바가 따뜻하게 안내해 드립니다.
              </p>
            </div>
            <Link
              href="/online"
              className="shrink-0 px-7 py-3.5 rounded-full bg-[#60984B] hover:bg-[#31702D] text-white font-bold text-sm transition-colors text-center"
            >
              새가족 온라인 등록 →
            </Link>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
