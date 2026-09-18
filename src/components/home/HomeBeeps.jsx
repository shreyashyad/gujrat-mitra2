import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getBeeps } from "../../services/newsService.js";
import BeepsModal from "../beeps/BeepsModal.jsx";

export default function HomeBeeps() {
  const { data: beeps, loading, error } = useAsyncData(getBeeps, []);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchParams] = useSearchParams();

  // Deep-link support
  useEffect(() => {
    const idFromUrl = searchParams.get("beep");
    if (idFromUrl && beeps?.length) {
      setOpenIndex(idFromUrl);
    }
  }, [searchParams, beeps]);

  return (
    <section className="mt-6 md:hidden">
      <div className="flex items-center gap-2">
        <h2 className="font-gu text-2xl font-bold text-[#e48d0b]">
          બીપ્સ
        </h2>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {loading && (
        <div className="flex gap-4 overflow-x-auto pb-0 animate-pulse no-scrollbar [-webkit-overflow-scrolling:touch]">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-[70vw] sm:w-[280px] shrink-0 rounded-2xl p-4 bg-black/[0.02] dark:bg-white/[0.02] h-36 flex flex-col justify-between"
            >
              <div className="h-4 w-1/3 rounded bg-black/5 dark:bg-white/5" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-black/5 dark:bg-white/5" />
                <div className="h-3.5 w-4/5 rounded bg-black/5 dark:bg-white/5" />
              </div>
              <div className="h-3 w-1/4 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-center">
          <p className="font-gu text-sm font-semibold text-red-600 dark:text-red-400">
            બીપ્સ લોડ કરવામાં સમસ્યા આવી.
          </p>
        </div>
      )}

      {!loading && !error && beeps && (
        <div
          className="home-x-scroll flex gap-4 overflow-x-auto overflow-y-hidden pb-0 scroll-smooth snap-x snap-proximity
           no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]
           [&::-webkit-scrollbar]:hidden"
        >
          {beeps.map((beep, index) => (
            <button
              key={beep.id ?? index}
              type="button"
              onClick={() => setOpenIndex(beep.id)}
              className="group flex w-[70vw] sm:w-[280px] shrink-0 snap-start flex-col justify-between rounded-2xl bg-black/[0.01] dark:bg-white/[0.02] p-4 text-left transition-transform duration-300 ease-in-out will-change-transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer border border-black/[0.01] dark:border-white/[0.01]"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-block rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-medium pt-1 uppercase tracking-wider text-white shadow-sm">
                    SHORT &amp; SNAPPY
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-[#e48d0b] opacity-80 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </div>

                <h3 className="article-headline group-hover:text-[#e48d0b] dark:group-hover:text-[#e6c27a]">
                  {beep.text}
                </h3>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-1.5 dark:border-white/5">
                {beep.source ? (
                  <p className="font-gu font-medium text-[#e48d0b] truncate max-w-[120px] text-[14px]">
                    {beep.source}
                  </p>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1 font-gu text-ink/50 dark:text-ink-dark/50 shrink-0 text-[14px]">
                  <Clock size={12} className="text-[#e48d0b]" />
                  <span className="font-medium leading-none">{beep.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && beeps && (
        <BeepsModal
          beeps={beeps}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}