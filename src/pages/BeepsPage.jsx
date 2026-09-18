import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainGrid from "../components/layout/MainGrid.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { getBeeps } from "../services/newsService.js";
import BeepsModal from "../components/beeps/BeepsModal.jsx";
import { Sparkles, Clock } from "lucide-react";

export default function BeepsPage() {
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
    <MainGrid>
      <div className="mx-auto w-full min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-5 inline-block">
          <h1 className="font-gu text-2xl sm:text-3xl font-bold text-[#e48d0b] dark:text-ink-dark flex gap-x-2 items-center">
            બીપ્સ
            <span className="flex items-center gap-0.5 mb-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/100" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/75" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/25" />
            </span>
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-[10px] bg-black/5 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-[7px] bg-red-500/10 text-center">
            <p className="font-gu text-sm font-semibold text-red-600 dark:text-red-400">
              બીપ્સ લોડ કરવામાં સમસ્યા આવી. કૃપા કરીને થોડી વાર પછી પ્રયત્ન કરો.
            </p>
          </div>
        )}

        {/* Beeps Grid */}
        {!loading && !error && beeps && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {beeps.map((beep, i) => (
              <button
                key={beep.id ?? i}
                type="button"
                onClick={() => setOpenIndex(beep.id)}
                className="group flex flex-col w-full text-left
                           rounded-[10px] overflow-hidden
                           bg-white dark:bg-[#1c1c1e]
                           border border-black/8 dark:border-white/10
                           shadow-sm
                           transition-transform duration-300 ease-out
                           hover:-translate-y-0.5
                           cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/5">
                  {/* Ribbon */}
                  <div className="absolute top-2 left-0 z-10">
                    <div
                      className="bg-red-600 text-[10px] font-black uppercase tracking-wide text-white pl-2 pr-3 py-0.5 shadow-sm"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)",
                      }}
                    >
                      SHORT &amp; SNAPPY
                    </div>
                  </div>

                  {beep.img ? (
                    <img
                      src={beep.img}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles
                        size={28}
                        className="text-black/20 dark:text-white/20"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col p-3.5 gap-1.5">
                  <h2 className="font-gu text-[18px] sm:text-[20px] font-normal text-ink dark:text-ink-dark leading-[1.35] line-clamp-4">
                    {beep.text}
                  </h2>

                  <div className="flex items-center gap-1.5 text-[13px] font-gu text-ink/50 dark:text-ink-dark/50">
                    {beep.source && (
                      <>
                        <span className="font-semibold text-[#e48d0b]/90 truncate">
                          {beep.source}
                        </span>
                        <span className="opacity-40">•</span>
                      </>
                    )}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <Clock size={12} className="text-[#e48d0b]" />
                      <span>{beep.time}</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {openIndex !== null && beeps && (
        <BeepsModal
          beeps={beeps}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </MainGrid>
  );
}