import SubPageShell from "../components/SubPageShell";
import { NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "parish")!;

const DISTRICTS = [
  { name: "1교구", area: "만촌 · 수성권역", pastor: "김도현 목사", leader: "이영수 장로" },
  { name: "2교구", area: "범어 · 황금권역", pastor: "박은지 목사", leader: "최미라 권사" },
  { name: "3교구", area: "시지 · 경산권역", pastor: "정우성 목사", leader: "강태호 안수집사" },
  { name: "4교구", area: "동구 · 북구권역", pastor: "한소망 목사", leader: "윤정희 권사" },
];

export default function ParishPage() {
  return (
    <SubPageShell category={category}>
      <section id="districts" className="py-20 px-5 lg:px-8 bg-[#FEFEF4]">
        <div className="max-w-[1140px] mx-auto space-y-12">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Parish Districts
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
              1~4교구 및 순모임 안내
            </h2>
            <p className="text-neutral-600 mt-2">
              주일 말씀이 삶의 나눔과 기도로 이어지는 작은 교회, 교구와 순모임에 함께하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DISTRICTS.map((d) => (
              <div
                key={d.name}
                className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-2"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[#60984B]/12 text-[#31702D] text-xs font-bold">
                  {d.area}
                </span>
                <h3 className="text-2xl font-extrabold text-neutral-900 pt-1">
                  {d.name}
                </h3>
                <p className="text-sm text-neutral-600">담당 교역자: {d.pastor}</p>
                <p className="text-sm text-neutral-500">교구장: {d.leader}</p>
              </div>
            ))}
          </div>

          <div
            id="soon"
            className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900">순모임 안내</h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                매주 주중 또는 주일 예배 후 각 순별로 모여 말씀을 나누고 서로를 위해 기도합니다.
                새가족 양육 수료 후 거주 지역과 연령에 맞는 순으로 배정됩니다.
              </p>
            </div>
            <div id="fellowship">
              <h3 className="text-xl font-extrabold text-neutral-900">남·여전도회</h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                연령별 남전도회(1~6남전도회)와 여전도회(1~8여전도회)가 교회 절기 봉사,
                선교 후원, 성도 친교 사역을 활발히 감당하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
