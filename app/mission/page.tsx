import SubPageShell from "../components/SubPageShell";
import { MISSION_PARTS, NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "mission")!;

const MISSION_REGIONS = [
  { region: "동남아시아", count: "18가정", focus: "캠퍼스 선교, 교회 개척, 현지 목회자 양성" },
  { region: "중앙아시아 · 러시아", count: "9가정", focus: "이주민 사역, 신학교 교육, 의료·구제" },
  { region: "국내 다문화", count: "3개 예배부", focus: "유학생·근로자 예배, 한국어 교실, 정착 지원" },
];

export default function MissionPage() {
  return (
    <SubPageShell category={category}>
      <section id="vision" className="py-20 px-5 lg:px-8 bg-[#FEFEF4]">
        <div className="max-w-[1140px] mx-auto space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Global Mission
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-2">
              온 천하에 다니며 만민에게 복음을 전파하라
            </h2>
            <p className="text-neutral-600 mt-3 leading-relaxed">
              church19 세계선교회는 파송 선교사와 협력 선교지, 그리고 국내에 거주하는 다문화
              이웃들을 섬기며 복음의 지경을 넓혀가고 있습니다.
            </p>
          </div>

          <div id="missionaries" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MISSION_REGIONS.map((item) => (
              <div
                key={item.region}
                className="bg-white rounded-3xl border border-neutral-200 p-7"
              >
                <span className="text-xs font-bold text-[#60984B]">{item.count}</span>
                <h3 className="text-xl font-extrabold text-neutral-900 mt-1">
                  {item.region}
                </h3>
                <p className="text-sm text-neutral-600 mt-2.5 leading-relaxed">
                  {item.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="multicultural" className="py-20 px-5 lg:px-8 bg-white border-t border-neutral-200/70">
        <div className="max-w-[1140px] mx-auto">
          <h2 className="text-3xl font-extrabold text-neutral-900 mb-8">
            다문화 예배부 안내
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MISSION_PARTS.map((part) => (
              <div
                key={part.id}
                className="rounded-3xl border border-neutral-200 bg-[#FEFEF4] p-7 flex items-center gap-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#60984B] text-white flex items-center justify-center font-black text-lg shrink-0">
                  {part.code}
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{part.en}</p>
                  <h3 className="text-xl font-extrabold text-neutral-900">{part.ko}</h3>
                  <p className="text-xs font-bold text-[#31702D] mt-1">{part.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
