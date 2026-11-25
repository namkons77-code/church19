"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useAuth } from "../components/AuthProvider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserAvatar from "../components/UserAvatar";
import type { SessionUser } from "../lib/auth";

const PARISH_OPTIONS = [
  "새가족",
  "1교구",
  "2교구",
  "3교구",
  "4교구",
  "청년아포슬",
  "교회학교 학부모",
];

const GENDER_OPTIONS = [
  { value: "", label: "선택안함" },
  { value: "남성", label: "남성" },
  { value: "여성", label: "여성" },
];

const PRESET_AVATARS = [
  {
    id: "olive",
    label: "올리브",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60984B"/><stop offset="100%" stop-color="#31702D"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><path d="M60 28v64M38 50h44" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`
    )}`,
  },
  {
    id: "teal",
    label: "평화 틸",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#5AADA7"/><stop offset="100%" stop-color="#276E69"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="60" cy="46" r="16" fill="#fff" opacity="0.9"/><path d="M30 96c4-18 17-28 30-28s26 10 30 28" fill="#fff" opacity="0.9"/></svg>`
    )}`,
  },
  {
    id: "dawn",
    label: "새벽빛",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F6B86D"/><stop offset="100%" stop-color="#C96F3B"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="60" cy="54" r="22" fill="#FFF7E8"/><path d="M20 88q40-18 80 0v32H20z" fill="#31702D" opacity="0.85"/></svg>`
    )}`,
  },
  {
    id: "sky",
    label: "푸른 하늘",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6EB5E5"/><stop offset="100%" stop-color="#2D6A9F"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><path d="M60 30c-12 18-24 28-24 42a24 24 0 0 0 48 0c0-14-12-24-24-42z" fill="#fff" opacity="0.9"/></svg>`
    )}`,
  },
  {
    id: "forest",
    label: "생명의 잎",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7FA550"/><stop offset="100%" stop-color="#1E4B35"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><path d="M84 34C54 34 36 52 36 82c30 0 48-18 48-48z" fill="#fff" opacity="0.9"/><path d="M36 82L70 48" stroke="#31702D" stroke-width="5" stroke-linecap="round"/></svg>`
    )}`,
  },
  {
    id: "plum",
    label: "은혜 퍼플",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8A74C9"/><stop offset="100%" stop-color="#4B3980"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="60" cy="46" r="15" fill="#fff" opacity="0.92"/><path d="M32 94c5-16 17-25 28-25s23 9 28 25" fill="#fff" opacity="0.92"/></svg>`
    )}`,
  },
];

async function resizeImageToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
      el.src = objectUrl;
    });

    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("캔버스를 초기화할 수 없습니다.");

    const minSide = Math.min(img.width, img.height);
    const sx = (img.width - minSide) / 2;
    const sy = (img.height - minSide) / 2;
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const { user, loading, setUser } = useAuth();
  const isWelcome = searchParams.get("welcome") === "1";

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-12 text-center text-sm text-neutral-500">
        프로필 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-10 text-center space-y-5 max-w-md mx-auto">
        <h1 className="font-serif text-2xl font-bold text-neutral-900">
          로그인이 필요합니다
        </h1>
        <p className="text-sm text-neutral-600">
          프로필 아바타와 개인정보를 수정하려면 먼저 로그인해 주세요.
        </p>
        <Link
          href="/login"
          className="inline-block px-7 py-3 rounded-full bg-[#60984B] hover:bg-[#31702D] text-white font-bold text-sm transition-colors"
        >
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  return (
    <ProfileForm
      key={user.id}
      user={user}
      setUser={setUser}
      isWelcome={isWelcome}
    />
  );
}

function ProfileForm({
  user,
  setUser,
  isWelcome,
}: {
  user: SessionUser;
  setUser: (u: SessionUser | null) => void;
  isWelcome: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user.name || "");
  const [parish, setParish] = useState(user.parish || "새가족");
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || "");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showUrlBox, setShowUrlBox] = useState(false);

  const [school, setSchool] = useState(user.school || "");
  const [department, setDepartment] = useState(user.department || "");
  const [gender, setGender] = useState(user.gender || "");
  const [hobby, setHobby] = useState(user.hobby || "");
  const [specialty, setSpecialty] = useState(user.specialty || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function handleAvatarFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setAvatarUrl(dataUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이미지 변환 중 오류가 발생했습니다."
      );
    } finally {
      e.target.value = "";
    }
  }

  async function saveProfile(skipToHome = false) {
    setError(null);
    setSavedMessage(null);
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || user.name,
          parish,
          avatarUrl: avatarUrl || null,
          school,
          department,
          gender,
          hobby,
          specialty,
        }),
      });
      const data = (await res.json()) as { user?: SessionUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error ?? "프로필 저장에 실패했습니다.");
        return;
      }

      setUser(data.user);
      if (skipToHome) {
        router.push("/");
        router.refresh();
        return;
      }
      setSavedMessage("프로필 정보가 성공적으로 저장되었습니다.");
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void saveProfile(false);
  }

  return (
    <div className="space-y-6">
      {(isWelcome || !user.profileCompleted) && (
        <div className="rounded-2xl bg-[#60984B] text-white p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Welcome to church19
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-0.5">
              첫 로그인을 환영합니다, {user.name}님!
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              프로필 아바타와 학교·학과·성별·취미·특기 등의 선택 정보를 자유롭게 입력해 주세요.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveProfile(true)}
            className="shrink-0 px-5 py-2.5 rounded-full bg-white text-[#31702D] hover:bg-[#FEFEF4] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            다음에 입력하고 홈으로 →
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-7 sm:p-10 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
              My Profile
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 mt-1">
              내 프로필 설정
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {user.email} ·{" "}
              <span className="font-semibold text-[#31702D]">
                {user.provider.toUpperCase()} 연동
              </span>
            </p>
          </div>

          <Link
            href="/"
            className="self-start sm:self-auto px-4 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            {error}
          </div>
        )}

        {savedMessage && (
          <div
            role="status"
            className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between gap-3"
          >
            <span>{savedMessage}</span>
            <Link href="/" className="font-bold underline shrink-0">
              홈으로 이동 →
            </Link>
          </div>
        )}

        {/* Avatar Editor */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-neutral-900">
            프로필 아바타
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <UserAvatar
                name={name || user.name}
                avatarUrl={avatarUrl || undefined}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#60984B]/25 shadow-sm"
                fallbackClassName="w-24 h-24 rounded-full bg-[#60984B]/15 text-[#31702D] border-4 border-[#60984B]/20 flex items-center justify-center text-3xl font-extrabold"
              />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#60984B] hover:bg-[#31702D] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  사진 업로드
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlBox((prev) => !prev)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  이미지 URL 입력
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-red-600 cursor-pointer"
                  >
                    아바타 제거
                  </button>
                )}
              </div>

              {showUrlBox && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 h-10 px-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#60984B]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setAvatarUrl(customUrlInput.trim());
                        setShowUrlBox(false);
                      }
                    }}
                    className="px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                  >
                    적용
                  </button>
                </div>
              )}

              <div>
                <p className="text-xs text-neutral-500 mb-2">
                  또는 기본 아바타 아이콘 선택:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      title={preset.label}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                        avatarUrl === preset.url
                          ? "border-neutral-900 ring-2 ring-[#60984B]"
                          : "border-neutral-200"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-neutral-200">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-bold text-neutral-800 mb-1.5"
            >
              이름 <span className="text-[#60984B]">*</span>
            </label>
            <input
              id="profile-name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-parish"
              className="block text-sm font-bold text-neutral-800 mb-1.5"
            >
              소속 교구 / 부서
            </label>
            <select
              id="profile-parish"
              value={parish}
              onChange={(e) => setParish(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
            >
              {PARISH_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Info */}
        <div className="space-y-5 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-neutral-900">
              추가 개인정보{" "}
              <span className="text-xs font-semibold text-neutral-400 ml-1">
                (선택 입력)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="profile-school"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                학교
              </label>
              <input
                id="profile-school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="예: 경북대학교 / 수성고등학교"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
              />
            </div>

            <div>
              <label
                htmlFor="profile-department"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                학과 / 전공
              </label>
              <input
                id="profile-department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="예: 컴퓨터학부 / 기악과"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-bold text-neutral-800 mb-2">
              성별
            </span>
            <div className="flex flex-wrap gap-2.5">
              {GENDER_OPTIONS.map((opt) => {
                const active = gender === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setGender(opt.value)}
                    className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                      active
                        ? "bg-[#60984B] text-white border-[#60984B]"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-[#60984B]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="profile-hobby"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                취미
              </label>
              <input
                id="profile-hobby"
                type="text"
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
                placeholder="예: 독서, 찬양 감상, 등산"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
              />
            </div>

            <div>
              <label
                htmlFor="profile-specialty"
                className="block text-sm font-bold text-neutral-800 mb-1.5"
              >
                특기
              </label>
              <input
                id="profile-specialty"
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="예: 피아노 반주, 영상 편집, 영어 회화"
                className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#60984B]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveProfile(true)}
            className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-sm font-bold transition-colors cursor-pointer"
          >
            저장 없이 홈으로
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full bg-[#60984B] hover:bg-[#31702D] disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            {saving ? "저장 중..." : "프로필 저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEF4]">
      <Header />
      <main className="flex-1 max-w-[820px] w-full mx-auto px-5 pt-28 pb-20">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-12 text-center text-sm text-neutral-500">
              프로필 화면을 준비 중입니다...
            </div>
          }
        >
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
