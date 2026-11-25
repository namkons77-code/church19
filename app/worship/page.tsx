import SubPageShell from "../components/SubPageShell";
import WorshipSection from "../components/WorshipSection";
import { NAV_CATEGORIES } from "../data/churchData";

const category = NAV_CATEGORIES.find((c) => c.id === "worship")!;

const WORSHIP_TIMETABLE = [
  { name: "주일 1부 예배", time: "오전 7:30", place: "대예배실" },
  { name: "주일 2부 예배", time: "오전 9:30", place: "대예배실" },
  { name: "주일 3부 예배", time: "오전 11:30", place: "대예배실 (수어통역)" },
  { name: "주일 4부 예배 (청년)", time: "오후 2:00", place: "비전홀" },
  { name: "수요 말씀 예배", time: "수요일 저녁 7:30", place: "대예배실" },
  { name: "금요 기도폭풍집회", time: "금요일 저녁 8:30", place: "대예배실" },
  { name: "새벽 기도회", time: "월~토 오전 5:30", place: "은혜채플" },
];

export default function WorshipPage() {
  return (
    <SubPageShell category={category}>
      <div id="sermons">
        <WorshipSection />
      </div>

      {/* Worship Timetable */}
      <section id="schedule" className="py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-[1140px] mx-auto">
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Worship Schedule
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
              예배 시간 및 장소 안내
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FEFEF4] border-b border-neutral-200 text-sm font-bold text-neutral-700">
                  <th className="py-4 px-6">예배 구분</th>
                  <th className="py-4 px-6">시간</th>
                  <th className="py-4 px-6">장소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm sm:text-base">
                {WORSHIP_TIMETABLE.map((row) => (
                  <tr key={row.name} className="hover:bg-[#FEFEF4]/60">
                    <td className="py-4 px-6 font-bold text-neutral-900">{row.name}</td>
                    <td className="py-4 px-6 text-[#31702D] font-semibold">{row.time}</td>
                    <td className="py-4 px-6 text-neutral-600">{row.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Praise & Location */}
      <section id="praise" className="py-20 px-5 lg:px-8 bg-[#FEFEF4] border-t border-neutral-200/70">
        <div id="location" className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 space-y-3">
            <span className="text-xs font-bold text-[#60984B] uppercase">Praise Team</span>
            <h3 className="text-2xl font-extrabold text-neutral-900">경배와 찬양</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              할렐루야 찬양대, 시온 찬양대, 그리고 경배와찬양팀이 매 예배마다 영과 진리로
              하나님께 찬양의 제사를 올려드립니다.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 space-y-3">
            <span className="text-xs font-bold text-[#60984B] uppercase">Parking &amp; Shuttle</span>
            <h3 className="text-2xl font-extrabold text-neutral-900">주차 및 교회차량 안내</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              본당 지하 1~3층 주차장과 비전센터 외부 주차장을 이용하실 수 있으며, 주일 2·3부 예배
              시간에 맞춰 인근 지하철역 셔틀버스가 15분 간격으로 운행됩니다.
            </p>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
