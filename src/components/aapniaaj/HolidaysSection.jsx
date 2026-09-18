// src/components/aapniAaj/HolidaysSection.jsx
import { PUBLIC_HOLIDAYS } from "../../data/aapniAajData.js";
import { SectionCard } from "./ChoghadiyaSection.jsx";
import { Share } from "lucide-react";

export default function HolidaysSection() {
  const handleShare = async () => {
    const titleText = "જાહેર રજાઓ ૨૦૨૬";
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

  // રાજ્ય પ્રમાણે અલગ કલર આપવા માટેનું હેલ્પર ફંક્શન
  const getStateBadgeStyle = (stateName) => {
    if (stateName.includes("ગુજરાત")) {
      // ગુજરાત માટે ઓરેન્જ/એમ્બર કલર (તમે બદલી શકો છો)
      return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
    } else if (stateName.includes("મહારાષ્ટ્ર")) {
      // મહારાષ્ટ્ર માટે બ્લુ અથવા પર્પલ કલર (તમે બદલી શકો છો)
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
    }
    // ડિફોલ્ટ કલર
    return "bg-[#e48d0b]/15 text-[#b97f26]";
  };

  return (
    <SectionCard title="જાહેર રજાઓ ૨૦૨૬">
      {/* Inner Box with Shadow and JainTimingsSection/MuhuratSection Style */}
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10 shadow-sm">
        {PUBLIC_HOLIDAYS?.map((h) => (
          <div
            key={h.date + h.name}
            className="flex items-center justify-between gap-3 px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="font-gu text-[22px] font-normal text-ink/60 dark:text-ink-dark/60 shrink-0">
              {h.date}
            </span>
            <div className="text-right flex-1">
              <span className="font-gu text-[22px] font-normal text-ink font-semibold block">
                {h.name}
              </span>
              <div className="flex flex-wrap justify-end gap-1 mt-1">
                {Array.isArray(h.states) &&
                  h.states.map((s) => (
                    <span
                      key={s}
                      className={`inline-block text-[15px] font-gu font-medium px-2 py-0.5 rounded-3xl ${getStateBadgeStyle(
                        s
                      )}`}
                    >
                      {s}
                    </span>
                  ))}
                {h.marketClosed && (
                  <span className="inline-block text-[15px] font-gu font-medium py-0.5 rounded-3xl px-2 bg-red-500/15 text-red-600">
                    શેર બજાર બંધ
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </SectionCard>
  );
}