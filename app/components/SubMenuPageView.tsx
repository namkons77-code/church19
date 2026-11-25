import Link from "next/link";
import { notFound } from "next/navigation";
import { NAV_CATEGORIES } from "../data/churchData";
import { getSubMenuConfig } from "../data/submenuData";
import CommunityBoard from "./CommunityBoard";
import NewsSection from "./NewsSection";
import OnlineApplicationPanel from "./OnlineApplicationPanel";
import SubPageShell from "./SubPageShell";
import WorshipSection from "./WorshipSection";

export default function SubMenuPageView({
  categoryId,
  slug,
}: {
  categoryId: string;
  slug: string;
}) {
  const category = NAV_CATEGORIES.find((c) => c.id === categoryId);
  const config = getSubMenuConfig(categoryId, slug);

  if (!category || !config) {
    notFound();
  }

  const activeSubHref = `/${categoryId}/${slug}`;

  return (
    <SubPageShell
      category={category}
      activeSubHref={activeSubHref}
      pageTitle={config.title}
      pageDescription={config.intro}
    >
      {/* Special interactive widgets for specific submenu pages */}
      {config.specialWidget === "worship" && (
        <div id="sermons">
          <WorshipSection />
        </div>
      )}
      {config.specialWidget === "community-board" && <CommunityBoard />}
      {config.specialWidget === "community-news" && (
        <div id="newsroom">
          <NewsSection />
        </div>
      )}
      {config.specialWidget === "online-edu-apply" && (
        <OnlineApplicationPanel initialServiceId="edu-apply" />
      )}
      {config.specialWidget === "online-donation-cert" && (
        <OnlineApplicationPanel initialServiceId="donation-cert" />
      )}
      {config.specialWidget === "online-offering" && (
        <OnlineApplicationPanel initialServiceId="online-offering" />
      )}
      {config.specialWidget === "online-admin" && (
        <OnlineApplicationPanel initialServiceId="online-admin" />
      )}

      {/* Structured Editorial Content Sections */}
      {config.sections.map((section, sIdx) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 sm:py-20 px-5 lg:px-8 ${
            sIdx % 2 === 0 ? "bg-[#FEFEF4]" : "bg-white border-t border-neutral-200/70"
          }`}
        >
          <div className="max-w-[1140px] mx-auto space-y-10">
            <div>
              {section.subheading && (
                <span className="text-xs font-bold tracking-widest uppercase text-[#60984B]">
                  {section.subheading}
                </span>
              )}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
                {section.heading}
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 gap-6 ${
                section.items.length === 1
                  ? "md:grid-cols-1"
                  : section.items.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3"
              }`}
            >
              {section.items.map((item) => (
                <div
                  key={item.title}
                  id={item.id}
                  className="bg-white rounded-3xl border border-neutral-200 p-7 sm:p-8 shadow-xs space-y-3"
                >
                  {item.badge && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#60984B]/12 text-[#31702D] text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold text-neutral-900">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs font-bold text-[#5AADA7]">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.body}
                  </p>
                  {item.meta && item.meta.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.meta.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full bg-[#FEFEF4] border border-neutral-200 text-neutral-700 font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Optional CTA & Related Submenu Navigation */}
      <section className="py-14 px-5 lg:px-8 bg-white border-t border-neutral-200/70">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#60984B]">
              {category.label} 다른 메뉴
            </span>
            <div className="flex flex-wrap gap-2 pt-2">
              {category.subItems.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors ${
                    sub.href === activeSubHref
                      ? "bg-[#60984B] text-white border-[#60984B]"
                      : "bg-[#FEFEF4] text-neutral-700 border-neutral-200 hover:border-[#60984B]"
                  }`}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>

          {config.cta && (
            <Link
              href={config.cta.href}
              className="shrink-0 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-[#60984B] text-white text-sm font-bold transition-colors text-center"
            >
              {config.cta.label} →
            </Link>
          )}
        </div>
      </section>
    </SubPageShell>
  );
}
