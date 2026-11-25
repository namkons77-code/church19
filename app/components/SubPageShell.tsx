import Link from "next/link";
import type { ReactNode } from "react";
import type { NavCategory } from "../data/churchData";
import Footer from "./Footer";
import Header from "./Header";

interface SubPageShellProps {
  category: NavCategory;
  activeSubHref?: string;
  pageTitle?: string;
  pageDescription?: string;
  children: ReactNode;
}

export default function SubPageShell({
  category,
  activeSubHref,
  pageTitle,
  pageDescription,
  children,
}: SubPageShellProps) {
  const displayTitle = pageTitle ?? category.label;
  const displayDescription = pageDescription ?? category.description;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Sub-page Compact Top Banner */}
      <section className="relative pt-20 bg-gradient-to-br from-[#163125] via-[#214836] to-[#11251d] text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_30%,#7FA550_0%,transparent_50%),radial-gradient(circle_at_80%_75%,#5AADA7_0%,transparent_45%)]"
        />

        <div className="relative z-10 max-w-[1140px] mx-auto px-5 lg:px-8 py-4 sm:py-5 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            {displayTitle}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-snug">
            {displayDescription}
          </p>
        </div>

        {/* Sub-menu Strip */}
        <div className="relative z-10 bg-[#489B7C]/85 backdrop-blur-xs border-t border-white/15">
          <div className="max-w-[1140px] mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center gap-1.5 py-2">
            <Link
              href={category.href}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-colors ${
                !activeSubHref
                  ? "bg-white text-[#1f4735]"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              전체보기
            </Link>
            {category.subItems.map((sub) => {
              const isActive = activeSubHref === sub.href;
              return (
                <Link
                  key={sub.label}
                  href={sub.href}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-white text-[#1f4735]"
                      : "text-white/90 hover:bg-white/15"
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
