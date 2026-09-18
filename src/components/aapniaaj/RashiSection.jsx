import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Share } from "lucide-react";
import { rashiList } from "../../data/rashi.js";
import { SectionCard } from "./ChoghadiyaSection.jsx";
import RashifalModal from "../rashifal/RashifalModal.jsx";

const PERIODS = [
  { id: "daily", icon: "☀️", label: "દૈનિક" },
  { id: "weekly", icon: "📅", label: "સાપ્તાહિક" },
  { id: "yearly", icon: "⭐", label: "વાર્ષિક" },
];

export default function RashiSection() {
  const [period, setPeriod] = useState("daily");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchParams] = useSearchParams();
  const idx = PERIODS.findIndex((p) => p.id === period);

  // Deep-link support
  useEffect(() => {
    const idFromUrl = searchParams.get("rashi");
    const periodFromUrl = searchParams.get("period");
    if (idFromUrl && rashiList?.length) {
      const found = rashiList.findIndex(
        (r) => r.id === idFromUrl || r.name === idFromUrl
      );
      if (found >= 0) {
        setSelectedIndex(found);
        if (periodFromUrl && ["daily", "weekly", "yearly"].includes(periodFromUrl)) {
          setPeriod(periodFromUrl);
        }
      }
    }
  }, [searchParams]);

  const handleShare = async () => {
    const currentPeriodLabel =
      PERIODS.find((p) => p.id === period)?.label || "";
    const titleText = `રાશિફળ (${currentPeriodLabel})`;

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
    <>
      <SectionCard title="રાશિફળ">
        {/* Period Selector Toggle */}
        <div className="relative flex rounded-3xl bg-black/[0.03] dark:bg-white/[0.06] p-1 mb-4 shadow-inner py-1">
          <div
            className="absolute top-1 bottom-1 left-1 rounded-3xl bg-[#e48d0b] shadow-sm transition-transform duration-300 ease-out"
            style={{
              width: "calc((100% - 8px) / 3)",
              transform: `translateX(${idx * 100}%)`,
            }}
          />
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`relative z-10 flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-gu text-[20px] font-extrabold leading-none transition-colors cursor-pointer ${
                period === p.id
                  ? "text-[#161616]"
                  : "text-ink/50 dark:text-ink-dark/50 hover:text-ink dark:hover:text-ink-dark"
              }`}
            >
              <span className="flex items-center justify-center shrink-0">{p.icon}</span>
              <span className="flex items-center justify-center">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Responsive Grid View */}
        <div className="grid grid-cols-4 gap-2">
          {rashiList.map((r, index) => (
            <button
              key={r.id || r.name}
              type="button"
              onClick={() => setSelectedIndex(r.id || index)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] hover:border-gray-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-95 transition-all cursor-pointer group shadow-xs"
            >
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                {r.sym}
              </span>
              <span className="font-gu text-[22px] font-normal text-ink dark:text-ink-dark">
                {r.name}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Share Button */}
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

      {/* Modal */}
      {selectedIndex !== null && (
        <RashifalModal
          rashiList={rashiList}
          initialIndex={selectedIndex}
          initialPeriod={period}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}