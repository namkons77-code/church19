import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#60984B] text-white py-12 px-5 lg:px-8">
      <div className="max-w-[1140px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                church19
              </Link>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-semibold">
                생명사역 공동체
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/90">
              (우) 42078 church19 비전센터 · TEL : 053-756-1701~2 · FAX : 053-211-4763
            </p>
            <p className="text-sm text-white/80">E-mail : contact@church19.org</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href="/ministry"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              교회소개
            </Link>
            <Link
              href="/worship"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              예배안내
            </Link>
            <Link
              href="/online"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              온라인신청
            </Link>
            <Link
              href="/sitemap"
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              사이트맵
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-white text-[#31702D] hover:bg-[#FEFEF4] transition-colors font-bold"
            >
              HOME
            </Link>
          </div>
        </div>

        {/* Bottom Legal & Sitemap Bar */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/85">
          <p>Copyright © 2026 church19. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 font-semibold">
            <Link href="/terms" className="hover:underline">
              이용약관
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/privacy" className="font-bold hover:underline">
              개인정보 처리방침
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/sitemap" className="hover:underline">
              사이트맵
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
