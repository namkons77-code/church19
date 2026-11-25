import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { NAV_CATEGORIES } from "../data/churchData";

const UTILITY_GROUPS = [
  {
    title: "회원 및 계정",
    links: [
      { label: "홈 (메인페이지)", href: "/" },
      { label: "로그인 (이메일·카카오·Google)", href: "/login" },
      { label: "회원가입", href: "/signup" },
      { label: "내 프로필 설정 (아바타·추가정보)", href: "/profile" },
      { label: "관리자 페이지 (관리자 전용)", href: "/admin" },
    ],
  },
  {
    title: "약관 및 안내",
    links: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보 처리방침", href: "/privacy" },
      { label: "전체 사이트맵 (현재 페이지)", href: "/sitemap" },
      { label: "검색엔진 XML 사이트맵", href: "/sitemap.xml" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />

      {/* Top Banner */}
      <section className="pt-24 pb-6 sm:pt-26 sm:pb-7 bg-gradient-to-br from-[#163125] via-[#214836] to-[#11251d] text-white px-5 lg:px-8">
        <div className="max-w-[1140px] mx-auto text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            사이트맵
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1.5">
            church19 홈페이지의 모든 메뉴와 서비스 페이지를 한눈에 찾아보세요.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1140px] w-full mx-auto px-5 lg:px-8 py-14 space-y-12">
        {/* Main 8 Menu Categories */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              Main Navigation
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">
              주요 메뉴 안내
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NAV_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <Link
                    href={cat.href}
                    className="flex items-center justify-between pb-3 border-b-2 border-[#60984B] group"
                  >
                    <span className="text-lg font-extrabold text-neutral-900 group-hover:text-[#60984B] transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-xs font-bold text-[#60984B]">→</span>
                  </Link>

                  <ul className="space-y-3">
                    {cat.subItems.map((sub) => (
                      <li key={sub.label} className="space-y-1">
                        <Link
                          href={sub.href}
                          className="text-sm font-bold text-neutral-800 hover:text-[#31702D] block"
                        >
                          {sub.label}
                        </Link>
                        {sub.children && (
                          <ul className="pl-2.5 space-y-1 border-l border-neutral-200">
                            {sub.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  className="text-xs text-neutral-500 hover:text-[#60984B]"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={cat.href}
                  className="text-xs font-bold text-[#31702D] hover:underline pt-2"
                >
                  {cat.label} 페이지 바로가기 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Account & Legal Pages */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#5AADA7]">
              Account &amp; Policy
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">
              회원 서비스 · 약관 · 정책
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UTILITY_GROUPS.map((group) => (
              <div
                key={group.title}
                className="bg-white rounded-3xl border border-neutral-200 p-7 shadow-xs space-y-4"
              >
                <h3 className="text-lg font-extrabold text-neutral-900 pb-3 border-b border-neutral-200">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between text-sm font-semibold text-neutral-700 hover:text-[#60984B] py-1"
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-neutral-400">{item.href}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
