import Link from "next/link";
import SubPageShell from "../components/SubPageShell";
import { NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "service")!;

const SERVICE_TEAMS = [
  {
    id: "welfare",
    title: "긍휼·복지사역 (사랑의 나눔)",
    desc: "지역 내 독거 어르신, 한부모 가정, 위기 가정을 정기적으로 방문하고 생필품과 장학금을 지원합니다.",
  },
  {
    id: "teams",
    title: "예배 안내 및 새가족 섬김팀",
    desc: "주일과 주중 예배에 오시는 모든 성도님과 새가족을 미소로 맞이하고 좌석 및 시설을 안내합니다.",
  },
  {
    id: "media",
    title: "미디어 · 방송 사역팀",
    desc: "예배 실시간 중계, 음향, 자막, 영상 제작을 통해 온·오프라인 예배 현장을 섬깁니다.",
  },
  {
    id: "parking",
    title: "주차 및 셔틀버스 봉사팀",
    desc: "주일 혼잡 시간대 안전한 차량 유도 및 거동이 불편한 성도님들의 이동을 돕습니다.",
  },
];

export default function ServicePage() {
  return (
    <SubPageShell category={category}>
      <section className="py-20 px-5 lg:px-8 bg-[#FEFEF4]">
        <div className="max-w-[1140px] mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICE_TEAMS.map((team) => (
              <div
                key={team.id}
                id={team.id}
                className="bg-white rounded-3xl border border-neutral-200 p-8 space-y-3"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[#60984B]/12 text-[#31702D] text-xs font-bold">
                  Ministry Team
                </span>
                <h2 className="text-xl font-extrabold text-neutral-900">
                  {team.title}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {team.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#1b3a2c] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold">함께 섬길 봉사자를 기다립니다</h3>
              <p className="text-sm text-white/80 mt-2">
                하나님이 주신 은사로 church19 공동체와 지역 사회를 섬기기를 원하신다면 온라인으로 지원해 주세요.
              </p>
            </div>
            <Link
              href="/online"
              className="shrink-0 px-7 py-3.5 rounded-full bg-[#7FA550] hover:bg-white hover:text-neutral-900 text-white font-bold text-sm transition-colors text-center"
            >
              봉사 지원 신청 →
            </Link>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
