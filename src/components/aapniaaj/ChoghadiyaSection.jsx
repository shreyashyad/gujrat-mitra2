// src/components/aapniAaj/ChoghadiyaSection.jsx
import { useMemo, useState } from "react";
import { Sun, Moon, Share } from "lucide-react";
import { computeChoghadiya, formatMin } from "../../utils/aapniAajUtils.js";

const NATURE_CLASS = {
  good: "text-emerald-600 dark:text-emerald-400",
  bad: "text-red-600 dark:text-red-400",
  neutral: "text-[#b97f26] dark:text-[#e48d0b]",
};

export function SectionCard({ title, children, onShare }) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white dark:bg-white/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden p-4 sm:p-5">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-gu text-[26px] font-semibold text-ink">
            {title}
          </h3>
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="p-1.5 rounded-lg text-black/50 dark:text-white/50 hover:text-[#e48d0b] dark:hover:text-[#e48d0b] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default function ChoghadiyaSection({ sunriseMin, sunsetMin }) {
  const [period, setPeriod] = useState("day"); // day | night
  const chogh = useMemo(
    () => computeChoghadiya(sunriseMin, sunsetMin),
    [sunriseMin, sunsetMin]
  );
  const slots = period === "day" ? chogh.daySlots : chogh.nightSlots;

  const handleShare = async () => {
    const titleText = period === "day" ? "દિવસના ચોઘડિયા" : "રાત્રિના ચોઘડિયા";
    if (navigator.share) {
      try {
        await navigator.share({
          title: titleText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white dark:bg-white/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden p-4 sm:p-5">
      
      {/* Top Header Toggle Switch */}
      <div className="flex items-center justify-between mb-5 px-1">
        <span
          className={`font-gu text-[26px] transition-all duration-200 ${
            period === "day"
              ? "font-semibold text-ink dark:text-ink-dark scale-105"
              : "font-medium text-ink/40 dark:text-ink-dark/40"
          }`}
        >
          દિવસના ચોઘડિયા
        </span>

        {/* Custom Toggle Switch */}
        <button
          type="button"
          onClick={() => setPeriod((p) => (p === "day" ? "night" : "day"))}
          className="relative flex items-center w-[82px] h-[42px] p-1 rounded-full border border-gray-300/80 dark:border-white/20 bg-gray-50 dark:bg-white/5 cursor-pointer select-none transition-colors"
          aria-label="Toggle Day/Night Choghadiya"
        >
          {/* Animated Sliding Pill */}
          <div
            className={`absolute w-9 h-9 rounded-full bg-[#e48d0b] shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${
              period === "night" ? "translate-x-[38px]" : "translate-x-0"
            }`}
          >
            {period === "day" ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Inactive Background Icons */}
          <div className="flex w-full justify-between items-center px-2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <Sun className={`w-4 h-4 ${period === "day" ? "opacity-0" : "opacity-100"}`} />
            <Moon className={`w-4 h-4 ${period === "night" ? "opacity-0" : "opacity-100"}`} />
          </div>
        </button>

        <span
          className={`font-gu text-[26px] transition-all duration-200 ${
            period === "night"
              ? "font-bold text-ink dark:text-ink-dark scale-105"
              : "font-medium text-ink/40 dark:text-ink-dark/40"
          }`}
        >
          રાત્રિના ચોઘડિયા
        </span>
      </div>

      {/* Choghadiya List */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden divide-y divide-black/10 dark:divide-white/10">
        {slots.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3.5 py-2.5 transition-colors ${
              s.isNow
                ? "bg-[#e48d0b]/12"
                : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            }`}
          >
            <span className="font-gu text-[22px] text-ink/70 dark:text-ink-dark/70 font-normal">
              {formatMin(Math.round(s.start))} – {formatMin(Math.round(s.end))}
            </span>
            <span
              className={`font-gu text-[22px] font-semibold flex items-center gap-1.5 ${NATURE_CLASS[s.nature]}`}
            >
              {s.isNow && (
                <span className="text-[16px] font-bold text-[#e48d0b] border border-[#e48d0b] rounded-3xl px-1.5 py-0.5 bg-white dark:bg-black/40 shadow-xs">
                  હાલ
                </span>
              )}
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Share Button */}
      <div className="flex justify-center mt-4 ">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl  text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
          {/* <span>ચોઘડિયા શેર કરો</span> */}
        </button>
      </div>

    </div>
  );
}