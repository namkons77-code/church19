import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

const ARTICLES = [
  {
    title: "제1조 (목적)",
    body: "본 약관은 church19(이하 '교회')가 운영하는 공식 홈페이지 및 관련 온라인 서비스(이하 '서비스')의 이용 조건과 절차, 교회와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.",
  },
  {
    title: "제2조 (용어의 정의)",
    body: "1. '일반사용자'란 회원가입 또는 로그인을 하지 않고 서비스의 공개 콘텐츠(예배 안내, 뉴스, 나눔터 게시글 등)를 열람하는 이용자를 말합니다.\n2. '로그인사용자'란 이메일, 카카오, Google 계정을 통해 가입·인증하여 댓글 작성, 온라인신청, 프로필 관리 서비스를 이용하는 성도 및 회원을 말합니다.\n3. '관리자'란 교회가 지정하여 공지사항·나눔터 게시글 관리, 회원 역할 관리, 온라인신청 처리를 수행하는 운영자를 말합니다.",
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    body: "본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 교회는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용 일자와 변경 사유를 홈페이지 공지사항을 통해 사전에 안내합니다.",
  },
  {
    title: "제4조 (회원가입 및 계정 관리)",
    body: "1. 회원가입은 이메일 가입 또는 카카오·Google 소셜 로그인 연동을 통해 이루어집니다.\n2. 이용자는 가입 시 정확하고 최신의 정보를 제공해야 하며, 타인의 정보를 도용해서는 안 됩니다.\n3. 첫 로그인 시 프로필 설정 페이지에서 아바타 및 선택 정보(학교, 학과, 성별, 취미, 특기 등)를 자유롭게 입력·수정할 수 있습니다.",
  },
  {
    title: "제5조 (서비스의 제공 및 이용 권한)",
    body: "1. 교회는 예배·말씀 영상 안내, 교육·훈련 및 선교 소식, 온라인신청(교육신청, 기부금증명서, 온라인헌금, 온라인행정), 나눔터 게시판을 제공합니다.\n2. 나눔터 게시판의 이용 권한은 역할에 따라 구분됩니다.\n  - 일반사용자: 게시글 및 댓글 열람(읽기 전용)\n  - 로그인사용자: 게시글 및 댓글 열람, 댓글 작성 및 본인 댓글 삭제\n  - 관리자: 게시글 작성·수정·고정·삭제, 모든 댓글 관리 및 운영 전반",
  },
  {
    title: "제6조 (이용자의 의무 및 게시물 관리)",
    body: "1. 이용자는 건전한 신앙 공동체 문화를 해치는 비방, 욕설, 허위사실 유포, 영리 목적의 광고성 댓글 등을 게시해서는 안 됩니다.\n2. 교회는 본 약관에 위배되거나 공동체 질서를 저해하는 게시물·댓글을 사전 통지 없이 숨김 또는 삭제할 수 있습니다.",
  },
  {
    title: "제7조 (회원 탈퇴 및 자격 제한)",
    body: "회원은 언제든지 교회사무실 또는 고객지원 이메일(contact@church19.org)을 통해 회원 탈퇴를 요청할 수 있으며, 교회는 관련 법령에 따라 지체 없이 처리합니다.",
  },
  {
    title: "제8조 (저작권 및 면책)",
    body: "1. 교회가 제작한 설교 영상, 말씀 자료, 이미지 등 콘텐츠의 저작권은 church19에 있습니다.\n2. 천재지변, 시스템 점검, 외부 인증 서비스(카카오·Google 등) 장애 등 불가항력적 사유로 서비스 제공이 일시 중단될 경우 교회는 고의·중과실이 없는 한 책임을 지지 않습니다.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />

      {/* Top Banner */}
      <section className="pt-24 pb-6 sm:pt-26 sm:pb-7 bg-gradient-to-br from-[#163125] via-[#214836] to-[#11251d] text-white px-5 lg:px-8">
        <div className="max-w-[920px] mx-auto text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            이용약관
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1.5">
            church19 홈페이지 및 온라인 성도 서비스 이용에 관한 기본 약관입니다.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[920px] w-full mx-auto px-5 lg:px-8 py-14 space-y-6">
        <div className="bg-white rounded-3xl border border-neutral-200 p-7 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5 text-xs text-neutral-500">
            <span>시행일자: 2026년 11월 25일</span>
            <div className="flex gap-3 font-bold text-[#31702D]">
              <Link href="/privacy" className="hover:underline">
                개인정보 처리방침 →
              </Link>
              <Link href="/sitemap" className="hover:underline">
                사이트맵 →
              </Link>
            </div>
          </div>

          <div className="space-y-7">
            {ARTICLES.map((article) => (
              <article key={article.title} className="space-y-2">
                <h2 className="text-lg font-extrabold text-neutral-900">
                  {article.title}
                </h2>
                <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed whitespace-pre-line">
                  {article.body}
                </p>
              </article>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500">
            문의: church19 교회사무실 · TEL 053-756-1701 · E-mail contact@church19.org
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
