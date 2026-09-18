// src/components/aapniAaj/JainTimingsSection.jsx
import { useMemo, useState } from "react";
import { Share } from "lucide-react";
import { computeJainTimings } from "../../utils/aapniAajUtils.js";

export default function JainTimingsSection({ sunriseMin, sunsetMin }) {
  const [expanded, setExpanded] = useState(false);
  const all = useMemo(
    () => computeJainTimings(sunriseMin, sunsetMin),
    [sunriseMin, sunsetMin]
  );

  const initialRows = all.slice(0, 3);
  const extraRows = all.slice(3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "જૈન સમય પત્રક",
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
    <div className="rounded-2xl border border-gray-200/70 bg-white dark:bg-white/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="p-4">
        {/* Header with Title and Share Button */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-gu text-[26px] font-semibold text-ink dark:text-ink-dark">
            જૈન સમય પત્રક
          </p>
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg text-ink dark:text-white/50 hover:text-[#e48d0b] dark:hover:text-[#e48d0b] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Share"
          >
            <Share className="w-6 h-6" />
          </button>
        </div>

        {/* Timings List */}
        <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10">
          {/* Default Visible 3 Rows */}
          {initialRows.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between px-3.5 py-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-gu text-[22px] font-normal text-ink/60 dark:text-ink-dark/60">
                {row.name}
              </span>
              <span className="font-gu text-[22px] font-semibold text-emerald-600 dark:text-emerald-400">
                {row.value}
              </span>
            </div>
          ))}

          {/* Smooth Collapsible Extra Rows */}
          {extraRows.length > 0 && (
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden divide-y divide-black/5 dark:divide-white/10">
                {extraRows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between px-3.5 py-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors font-semibold"
                  >
                    <span className="font-gu text-[20px] font-normal text-ink/60 dark:text-ink-dark/60">
                      {row.name}
                    </span>
                    <span className="font-gu text-[22px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Arrow Toggle Button */}
        {all.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full mt-3 py-2 flex items-center justify-center hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Toggle Jain Timings"
          >
            <svg
              className={`w-5 h-5 text-[#e48d0b] transition-transform duration-300 ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}