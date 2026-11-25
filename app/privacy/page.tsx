import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

const SECTIONS = [
  {
    title: "1. 개인정보의 처리 목적",
    body: "church19(이하 '교회')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.\n- 홈페이지 회원가입 및 교인 본인 확인(이메일, 카카오, Google 로그인)\n- 교구 배정, 새가족 양육 및 교육훈련·온라인행정 신청 접수 처리\n- 나눔터 게시판 댓글 작성 및 커뮤니티 운영 관리",
  },
  {
    title: "2. 수집하는 개인정보 항목 및 수집 방법",
    body: "1) 필수 항목\n- 이메일 가입: 이름, 이메일 주소, 비밀번호(단방향 암호화 저장), 소속 교구/부서\n- 카카오·Google 소셜 로그인: 소셜 계정 식별자, 이름(닉네임), 이메일 주소, 프로필 이미지 URL\n2) 선택 항목 (프로필 페이지에서 이용자가 직접 선택 입력)\n- 프로필 아바타 이미지, 학교, 학과/전공, 성별, 취미, 특기\n3) 온라인신청 시 수집 항목\n- 신청자 성함, 연락처(전화번호 또는 이메일), 신청 상세 내용",
  },
  {
    title: "3. 개인정보의 처리 및 보유 기간",
    body: "교회는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 보유·이용 기간 내에서 개인정보를 처리·보유합니다.\n- 회원 계정 및 프로필 정보: 회원 탈퇴 시까지 (탈퇴 요청 시 지체 없이 파기)\n- 온라인신청 및 기부금영수증 관련 기록: 관련 세법 및 교회 행정 보존 기준에 따름",
  },
  {
    title: "4. 개인정보의 제3자 제공 및 처리 위탁",
    body: "교회는 원칙적으로 이용자의 개인정보를 외부에 제3자 제공하지 않습니다. 다만 원활한 인증 및 데이터베이스 운영을 위해 아래와 같이 클라우드 인프라를 활용하고 있습니다.\n- 인증 및 데이터베이스 호스팅: Supabase (계정 인증 세션 및 암호화된 데이터 저장)",
  },
  {
    title: "5. 정보주체의 권리·의무 및 행사 방법",
    body: "이용자는 언제든지 로그인 후 [내 프로필(/profile)] 페이지를 통해 자신의 이름, 소속, 프로필 아바타 및 선택 입력 정보(학교, 학과, 성별, 취미, 특기)를 열람·수정·삭제할 수 있습니다. 또한 회원 탈퇴 및 개인정보 삭제는 교회사무실(contact@church19.org)을 통해 요청하실 수 있습니다.",
  },
  {
    title: "6. 개인정보의 안전성 확보 조치",
    body: "교회는 개인정보의 안전성 확보를 위해 다음과 같은 기술적·관리적 조치를 취하고 있습니다.\n- 비밀번호 단방향 해시 암호화(scrypt / Supabase Auth)\n- HttpOnly·SameSite 보안 쿠키 및 HTTPS 암호화 통신\n- 데이터베이스 행 수준 보안(RLS) 및 역할 기반 접근 제어(일반사용자 / 로그인사용자 / 관리자)",
  },
  {
    title: "7. 개인정보 보호책임자 및 문의처",
    body: "개인정보 처리에 관한 문의, 열람·정정·삭제 요청은 아래 담당 부서로 연락해 주시기 바랍니다.\n- 담당 부서: church19 행정사무실\n- 전화번호: 053-756-1701~2\n- 이메일: contact@church19.org",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />

      {/* Top Banner */}
      <section className="pt-24 pb-6 sm:pt-26 sm:pb-7 bg-gradient-to-br from-[#163125] via-[#214836] to-[#11251d] text-white px-5 lg:px-8">
        <div className="max-w-[920px] mx-auto text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            개인정보 처리방침
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1.5">
            church19는 성도님과 이용자의 개인정보를 소중하게 보호합니다.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[920px] w-full mx-auto px-5 lg:px-8 py-14 space-y-6">
        <div className="bg-white rounded-3xl border border-neutral-200 p-7 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5 text-xs text-neutral-500">
            <span>시행일자: 2026년 11월 25일</span>
            <div className="flex gap-3 font-bold text-[#31702D]">
              <Link href="/terms" className="hover:underline">
                이용약관 →
              </Link>
              <Link href="/profile" className="hover:underline">
                내 프로필 관리 →
              </Link>
            </div>
          </div>

          <div className="space-y-7">
            {SECTIONS.map((sec) => (
              <article key={sec.title} className="space-y-2">
                <h2 className="text-lg font-extrabold text-neutral-900">
                  {sec.title}
                </h2>
                <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed whitespace-pre-line">
                  {sec.body}
                </p>
              </article>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500">
            본 방침은 2026년 11월 25일부터 적용됩니다.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
