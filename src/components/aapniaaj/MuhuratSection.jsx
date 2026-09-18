// src/components/aapniAaj/MuhuratSection.jsx
import { useState } from "react";
import { Share } from "lucide-react";
import {
  SHUBH_DIVAS_LIST,
  MARRIAGE_MUHURATS,
  JANOI_MUHURATS,
  FESTIVAL_LIST,
} from "../../data/aapniAajData.js";
import { SectionCard } from "./ChoghadiyaSection.jsx";

const TABS = [
  { id: "festival", icon: "🎉", label: "તહેવારો", data: FESTIVAL_LIST },
  { id: "shubhdivas", icon: "🌸", label: "શુભ દિવસો", data: SHUBH_DIVAS_LIST },
  { id: "marriage", icon: "💍", label: "લગ્ન", data: MARRIAGE_MUHURATS },
  { id: "janoi", icon: "🕉️", label: "જનોઈ", data: JANOI_MUHURATS },
];

export default function MuhuratSection() {
  const [tab, setTab] = useState("shubhdivas");
  const active = TABS.find((t) => t.id === tab);
  const idx = TABS.findIndex((t) => t.id === tab);

  const handleShare = async () => {
    const titleText = `શુભ મુહૂર્તો અને તહેવારો ૨૦૨૬ - ${active.label}`;
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
    <SectionCard title="શુભ મુહૂર્તો અને તહેવારો ૨૦૨૬">
      {/* Tab Selector matched with RashiSection style */}
              <div className="relative flex rounded-3xl bg-black/[0.03] dark:bg-white/[0.06] p-1 mb-4 shadow-inner py-1">
                <div
                  className="absolute top-1 bottom-1 left-1 rounded-3xl bg-[#e48d0b] shadow-sm transition-transform duration-300 ease-out"
          style={{
            width: "calc((100% - 8px) / 4)",
            transform: `translateX(${idx * 100}%)`,
          }}
        />
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative z-10 flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-gu text-[20px] font-extrabold leading-none transition-colors cursor-pointer ${
              tab === t.id
                ? "text-[#161616]"
                : "text-ink/50 dark:text-ink-dark/50 hover:text-ink dark:hover:text-ink-dark"
            }`}
          >
            <span className="flex items-center justify-center shrink-0">{t.icon}</span>
            <span className="flex items-center justify-center whitespace-nowrap">{t.label}</span>
          </button>
        ))}
      </div>

      {/* List Container with JainTimingsSection style inner box & Panchang Button */}
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10">
        {active.data.map((item) => (
          <div
            key={item.date + item.label}
            className="flex items-center justify-between gap-3 px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="font-gu text-[22px] font-normal text-ink/60 dark:text-ink-dark/60 shrink-0">
              {item.date}
            </span>

            <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
              <span className="font-gu text-[22px] font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                {item.label}
              </span>
              <button
                type="button"
                className="shrink-0 px-3 py-1.5 rounded-3xl border border-[#e48d0b] bg-[#e48d0b]/10 text-[#e48d0b] font-gu text-xs text-[15px] font-bold hover:bg-[#e48d0b]/20 transition-colors cursor-pointer shadow-sm"
              >
                પંચાંગ ખોલો
              </button>
            </div>
          </div>
        ))}
      </div>

        <p className="mt-2 font-gu text-[14px] text-ink/40 dark:text-ink-dark/40">
          *તારીખો ડેમો હેતુ માટે છે, ચોક્કસ મુહૂર્ત માટે તમારા પંડિત/જ્યોતિષીની સલાહ લો
        </p>

        {/* Bottom Share Button matched with RashiSection style */}
        <div className="flex justify-center mt-4 ">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
          {/* <span>ચોઘડિયા શેર કરો</span> */}
        </button>
      </div>
    </SectionCard>
  );
}