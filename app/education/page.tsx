import Link from "next/link";
import SubPageShell from "../components/SubPageShell";
import { EDUCATION_CARDS, NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "education")!;

const SCHOOL_DEPARTMENTS = [
  { name: "영아부 (0~3세)", time: "주일 오전 11:30", room: "비전관 1층 사랑방" },
  { name: "유치부 (4~7세)", time: "주일 오전 11:30", room: "비전관 2층 기쁨홀" },
  { name: "유년·초등부 (1~4학년)", time: "주일 오전 11:30", room: "비전관 3층 비전홀" },
  { name: "소년부 (5~6학년)", time: "주일 오전 9:30", room: "비전관 4층 믿음홀" },
  { name: "청소년부 (중·고등)", time: "주일 오전 9:30", room: "교육관 2층 드림홀" },
  { name: "청년아포슬 (대학·청년)", time: "주일 오후 2:00", room: "대예배실 / 비전홀" },
];

export default function EducationPage() {
  return (
    <SubPageShell category={category}>
      <section id="school" className="py-20 px-5 lg:px-8 bg-[#FEFEF4]">
        <div className="max-w-[1140px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {EDUCATION_CARDS.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className={`rounded-3xl bg-gradient-to-br ${item.gradient} p-7 text-white flex flex-col justify-between min-h-[240px] shadow-md`}
              >
                <span className="self-start px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold">
                  {item.badge}
                </span>
                <div>
                  <p className="text-xs text-white/75 font-semibold">{item.subtitle}</p>
                  <h2 className="text-2xl font-extrabold mt-0.5">{item.title}</h2>
                  <p className="text-xs text-white/90 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-extrabold text-neutral-900 mb-6">
            다음 세대 부서별 예배 안내
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCHOOL_DEPARTMENTS.map((dept) => (
              <div
                key={dept.name}
                className="bg-white rounded-2xl border border-neutral-200 p-6"
              >
                <h4 className="text-lg font-extrabold text-neutral-900">{dept.name}</h4>
                <p className="text-sm font-bold text-[#60984B] mt-2">{dept.time}</p>
                <p className="text-sm text-neutral-500 mt-1">{dept.room}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="training" className="py-20 px-5 lg:px-8 bg-white border-t border-neutral-200/70">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[#FEFEF4] rounded-3xl border border-neutral-200 p-8 sm:p-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#60984B]">
              Life Ministry Academy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              생명사역훈련원 제자훈련 과정 신청
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              새가족반 → 확신반 → 성장반 → 제자반 → 사역반으로 이어지는 체계적인 양육 커리큘럼을
              온라인신청 페이지에서 바로 신청하실 수 있습니다.
            </p>
          </div>
          <Link
            href="/online"
            className="shrink-0 px-7 py-3.5 rounded-full bg-[#60984B] hover:bg-[#31702D] text-white font-bold text-sm transition-colors"
          >
            교육과정 신청하기 →
          </Link>
        </div>
      </section>
    </SubPageShell>
  );
}
