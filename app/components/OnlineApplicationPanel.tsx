"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ONLINE_SERVICES } from "../data/churchData";
import { useAuth } from "./AuthProvider";

interface SubmittedApplication {
  id: string;
  service_title: string;
  status: string;
  created_at: string;
  note: string;
}

export default function OnlineApplicationPanel({
  initialServiceId = "edu-apply",
}: {
  initialServiceId?: string;
}) {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(initialServiceId);
  const [applicantName, setApplicantName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentApps, setRecentApps] = useState<SubmittedApplication[]>([]);

  const selectedService =
    ONLINE_SERVICES.find((s) => s.id === selectedId) ?? ONLINE_SERVICES[0];

  useEffect(() => {
    if (!user) return;
    let active = true;
    fetch("/api/online", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { applications?: SubmittedApplication[] } | null) => {
        if (active && data?.applications) {
          setRecentApps(data.applications);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmittedMsg(null);
    setSubmitting(true);

    const finalName = applicantName.trim() || user?.name || "";
    const finalContact = contact.trim() || user?.email || "";

    try {
      const res = await fetch("/api/online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          applicantName: finalName,
          contact: finalContact,
          note,
        }),
      });
      const data = (await res.json()) as {
        application?: SubmittedApplication;
        error?: string;
      };
      if (!res.ok || !data.application) {
        setErrorMsg(data.error ?? "신청 접수에 실패했습니다.");
        return;
      }

      setSubmittedMsg(
        `${finalName}님의 [${selectedService.title}] 접수가 완료되었습니다. 담당 부서에서 확인 후 안내드리겠습니다.`
      );
      setNote("");
      setRecentApps((prev) => [data.application!, ...prev].slice(0, 5));
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 sm:py-20 px-5 lg:px-8 bg-[#FEFEF4]">
      <div className="max-w-[1140px] mx-auto space-y-10">
        {/* 4 Online Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ONLINE_SERVICES.map((svc, idx) => {
            const active = svc.id === selectedId;
            return (
              <button
                key={svc.id}
                id={svc.id}
                type="button"
                onClick={() => {
                  setSelectedId(svc.id);
                  setSubmittedMsg(null);
                  setErrorMsg(null);
                }}
                className={`text-left rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                  active
                    ? "bg-[#60984B] text-white border-[#60984B] shadow-lg"
                    : "bg-white text-neutral-900 border-neutral-200 hover:border-[#60984B]"
                }`}
              >
                <span
                  className={`inline-flex w-9 h-9 rounded-full items-center justify-center text-xs font-extrabold mb-4 ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#60984B]/12 text-[#31702D]"
                  }`}
                >
                  0{idx + 1}
                </span>
                <h2 className="text-xl font-extrabold">{svc.title}</h2>
                <p
                  className={`text-xs mt-1 ${
                    active ? "text-white/85" : "text-neutral-500"
                  }`}
                >
                  {svc.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Application Form */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#60984B]">
              Online Application
            </span>
            <h3 className="text-2xl font-extrabold text-neutral-900">
              {selectedService.title} 신청
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {selectedService.description}
            </p>

            {user ? (
              <div className="p-4 rounded-2xl bg-[#FEFEF4] border border-[#60984B]/30 text-sm">
                <p className="font-bold text-[#31702D]">
                  로그인 계정 연동됨: {user.name}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm space-y-2">
                <p className="text-neutral-700 font-medium">
                  로그인하시면 성도 정보 및 신청 내역이 자동으로 저장됩니다.
                </p>
                <Link
                  href="/login"
                  className="inline-block text-xs font-bold text-[#31702D] hover:underline"
                >
                  로그인하러 가기 →
                </Link>
              </div>
            )}

            {user && recentApps.length > 0 && (
              <div className="pt-2 space-y-2">
                <p className="text-xs font-bold text-neutral-700">최근 나의 신청 내역</p>
                <ul className="space-y-1.5">
                  {recentApps.map((app) => (
                    <li
                      key={app.id}
                      className="text-xs px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2"
                    >
                      <span className="font-semibold text-neutral-800 truncate">
                        {app.service_title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#60984B]/15 text-[#31702D] font-bold shrink-0">
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {errorMsg}
              </div>
            )}
            {submittedMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                {submittedMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neutral-800 mb-1.5">
                  신청자 성함
                </label>
                <input
                  type="text"
                  required
                  value={applicantName || user?.name || ""}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="성함을 입력하세요"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-800 mb-1.5">
                  연락처 또는 이메일
                </label>
                <input
                  type="text"
                  required
                  value={contact || user?.email || ""}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-1.5">
                신청 상세 내용
              </label>
              <textarea
                rows={4}
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`${selectedService.title} 관련 요청 사항이나 희망 일정을 적어주세요.`}
                className="w-full p-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-full bg-[#60984B] hover:bg-[#31702D] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {submitting ? "접수 처리 중..." : `${selectedService.title} 접수하기`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
