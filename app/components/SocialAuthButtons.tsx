"use client";

export default function SocialAuthButtons({
  mode = "login",
}: {
  mode?: "login" | "signup";
}) {
  const kakaoLabel =
    mode === "signup" ? "카카오로 3초 회원가입" : "카카오로 로그인";
  const googleLabel =
    mode === "signup" ? "Google 계정으로 가입" : "Google로 로그인";

  return (
    <div className="space-y-3">
      <a
        href="/api/auth/oauth/kakao"
        className="w-full h-12 rounded-xl bg-[#FEE500] hover:bg-[#F5DC00] text-[#191919] font-bold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-xs"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919" aria-hidden="true">
          <path d="M12 3C6.477 3 2 6.463 2 10.736c0 2.742 1.842 5.15 4.623 6.52-.204.76-.738 2.755-.845 3.18-.132.528.194.521.408.379.168-.112 2.677-1.816 3.76-2.553.666.095 1.352.145 2.054.145 5.523 0 10-3.463 10-7.671C22 6.463 17.523 3 12 3Z" />
        </svg>
        <span>{kakaoLabel}</span>
      </a>

      <a
        href="/api/auth/oauth/google"
        className="w-full h-12 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm border border-neutral-300 flex items-center justify-center gap-2.5 transition-colors shadow-xs"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A11.99 11.99 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4-3.1Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.28 6.6l4 3.1c.95-2.84 3.6-4.95 6.72-4.95Z"
          />
        </svg>
        <span>{googleLabel}</span>
      </a>
    </div>
  );
}
