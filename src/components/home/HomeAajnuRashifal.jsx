import { useState } from "react";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getRashi } from "../../services/newsService.js";
import RashifalModal from "../rashifal/RashifalModal.jsx";

export default function HomeAajnuRashifal() {
  const { data, loading, error } = useAsyncData(getRashi, []);
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-6 md:hidden">
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-gu text-2xl font-bold text-[#e48d0b]">
          આજનું રાશિફળ
        </h2>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="home-x-scroll flex gap-3 overflow-x-auto scroll-smooth snap-x snap-proximity
           no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-24 w-24 shrink-0 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02]"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-center">
          <p className="font-gu text-sm font-semibold text-red-600 dark:text-red-400">
            રાશિફળ લોડ કરવામાં સમસ્યા આવી.
          </p>
        </div>
      )}

      {/* Rashifal Compact Cards (Icon + Name Only) */}
      {!loading && !error && data && (
        <div className="home-x-scroll flex gap-3 overflow-x-auto scroll-smooth snap-x snap-proximity
           no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">
          {data.rashiList.map((rashi, index) => (
            <button
              key={rashi.id || rashi.name}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group flex size-28 shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-2xl bg-black/[0.01] dark:bg-white/[0.02] border border-black/[0.01] dark:border-white/[0.01] text-center transition-transform duration-300 ease-in-out will-change-transform hover:-translate-y-0.5 active:scale-[0.96] cursor-pointer"
            >
              <div className="text-2xl text-[#e48d0b] leading-none">
                {rashi.sym}
              </div>
              <h3 className="font-gu font-medium leading-tight text-[16px] sm:text-[17px] text-ink transition-colors duration-200 group-hover:text-[#e48d0b] dark:text-ink-dark dark:group-hover:text-[#e6c27a]">
                {rashi.name}
              </h3>
            </button>
          ))}
        </div>
      )}

      {/* Rashifal Modal */}
      {openIndex !== null && data && (
        <RashifalModal
          rashiList={data.rashiList}
          rashiTips={data.rashiTips}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}