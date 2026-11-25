"use client";

import { useEffect, useState } from "react";
import { SECTION_ANCHORS } from "../data/churchData";

export default function FullpageNav() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.05 }
    );

    SECTION_ANCHORS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-label="섹션 빠른 이동"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2.5"
    >
      {SECTION_ANCHORS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-2.5 py-0.5"
          >
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-[#60984B] text-white shadow-sm opacity-100 translate-x-0"
                  : "bg-black/60 text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-200 border ${
                isActive
                  ? "w-3.5 h-3.5 bg-[#7FA550] border-[#7FA550] scale-110"
                  : "w-2.5 h-2.5 bg-neutral-400/50 border-white/70 group-hover:bg-[#7FA550]"
              }`}
            />
          </a>
        );
      })}
    </aside>
  );
}
