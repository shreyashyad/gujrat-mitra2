// src/components/aapniaaj/ExtraInfoSections.jsx
import {
  HISTORY_TODAY,
  LUCKY_COLOR_NUMBER,
  GRAHAN_LIST,
  PANOTI_LIST,
  AQI_DATA,
  BIRTHDAY_RASHIFAL,
} from "../../data/aapniAajData.js";
import { SectionCard } from "./ChoghadiyaSection.jsx";
import { useState } from "react";
import { Share } from "lucide-react";

// Helper function to handle sharing for any section
const handleShare = async (titleText) => {
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

export function HistoryTodaySection() {
  const events = HISTORY_TODAY?.events || [];
  const dateStr = HISTORY_TODAY?.date;
  const title = `આજનો ઇતિહાસ${dateStr ? ` — ${dateStr}` : ""}`;

  return (
    <SectionCard title={title}>
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10 shadow-sm">
        {events.map((h) => (
          <div
            key={h.year}
            className="flex items-start gap-3 px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="font-gu text-[22px] font-bold text-[#e48d0b] shrink-0">
              {h.year}
            </span>
            <p className="font-gu text-[22px] font-normal text-ink/70 dark:text-ink-dark/70">
              {h.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => handleShare(title)}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </SectionCard>
  );
}

export function AqiSection({ city = AQI_DATA.city }) {
  const title = `હવાની ગુણવત્તા (AQI) — ${city}`;

  return (
    <SectionCard title={title}>
      <div className="flex items-center gap-4 rounded-xl p-2 dark:bg-white/[0.03] shadow-sm">
        <div className="flex items-center justify-center shrink-0 leading-none">
          <span className="font-gu text-[70px] font-extrabold text-[#e48d0b]">
            {AQI_DATA.value}
          </span>
        </div>
        <div className="leading-[1.25]">
          <div className="font-gu text-[22px] font-extrabold text-ink dark:text-ink-dark">
            {AQI_DATA.label}
          </div>
          <p className="font-gu text-[22px] text-ink/50 dark:text-ink-dark/50 mt-0.5">
            {AQI_DATA.tip}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => handleShare(title)}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </SectionCard>
  );
}

export function LuckySection() {
  const title = "શુભ રંગ અને શુભ અંક";

  return (
    <SectionCard title={title}>
      <div className="grid grid-cols-2 gap-3">
        {/* શુભ રંગ */}
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-white/[0.04] shadow-sm">
          <div className="flex items-center justify-center text-4xl shrink-0">
            🎨
          </div>
          <div className="flex flex-col justify-center text-left leading-[1.25]">
            <div className="font-gu text-[22px] text-ink/50 dark:text-ink-dark/50 font-semibold">
              શુભ રંગ
            </div>
            <div className="font-gu text-[22px] font-bold text-ink dark:text-ink-dark leading-tight">
              {LUCKY_COLOR_NUMBER.color}
            </div>
          </div>
        </div>

        {/* શુભ અંક */}
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-white/[0.04] shadow-sm">
          <div className="flex items-center justify-center text-4xl shrink-0">
            🔢
          </div>
          <div className="flex flex-col justify-center text-left leading-[1.25]">
            <div className="font-gu text-[22px] text-ink/50 dark:text-ink-dark/50 font-semibold">
              શુભ અંક
            </div>
            <div className="font-gu text-[22px] font-bold text-ink dark:text-ink-dark leading-tight">
              {LUCKY_COLOR_NUMBER.number}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => handleShare(title)}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </SectionCard>
  );
}

export function GrahanPanotiSection() {
  const [tab, setTab] = useState("grahan");
  const list = tab === "grahan" ? GRAHAN_LIST : PANOTI_LIST;
  const TABS = [
    { id: "grahan", icon: "🌑", label: "ગ્રહણ" },
    { id: "panoti", icon: "🪐", label: "પનોતિ" },
  ];
  const idx = TABS.findIndex((t) => t.id === tab);
  const title = "ગ્રહણ અને પનોતિ";

  return (
    <SectionCard title={title}>
      {/* Sliding Tab Toggle */}
      <div className="relative flex rounded-3xl bg-black/[0.03] dark:bg-white/[0.06] p-1 mb-4 shadow-inner">
        <div
          className="absolute top-1 bottom-1 left-1 rounded-3xl bg-[#e48d0b] shadow-sm transition-transform duration-300 ease-out"
          style={{
            width: "calc((100% - 8px) / 2)",
            transform: `translateX(${idx * 100}%)`,
          }}
        />
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg font-gu text-[18px] font-extrabold transition-colors cursor-pointer ${
              tab === t.id
                ? "text-[#161616]"
                : "text-ink/50 dark:text-ink-dark/50 hover:text-ink dark:hover:text-ink-dark"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Simple Key-Value List */}
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10 shadow-sm">
        {list.map((item) => (
          <div
            key={item.label}
            className="px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <p className="font-gu text-[22px] text-ink dark:text-ink-dark">
              <span className="font-semibold text-ink/80 dark:text-ink-dark/80">
                {item.label}:
              </span>{" "}
              <span className="text-ink/70 dark:text-ink-dark/70">
                {item.value}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-2 font-gu text-[14px] text-ink/40 dark:text-ink-dark/40">
        *ગ્રહણની ચોક્કસ વિગતો માટે તમારા જ્યોતિષીની સલાહ લો.
      </p>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => handleShare(title)}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </SectionCard>
  );
}

export function BirthdayRashifalSection() {
  const events = BIRTHDAY_RASHIFAL?.events || [];
  const title = BIRTHDAY_RASHIFAL?.title || "જન્મદિવસ રાશિફળ";

  return (
    <SectionCard title={title}>
      <div className="space-y-3">
        {events.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-black/10 dark:border-white/10 p-4 sm:p-5 bg-white dark:bg-white/[0.03] shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-2xl shrink-0">{item.icon || "🎂"}</span>
              <h3 className="font-gu text-[22px] font-semibold text-ink dark:text-ink-dark">
                {item.title}
              </h3>
            </div>
            <p className="font-gu text-[22px] leading-[1.45] text-ink/70 dark:text-ink-dark/70">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => handleShare(title)}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>
    </SectionCard>
  );
}