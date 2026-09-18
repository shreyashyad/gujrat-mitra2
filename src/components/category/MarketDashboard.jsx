// src/components/category/MarketDashboard.jsx
import { useState } from "react";
import { MapPin, DollarSign, PoundSterling, Globe } from "lucide-react";

import {
  globalMarketsUSA,
  globalMarketsUK,
  globalMarketsAsia,
  marketIndices,
  marketCurrency,
  fuelPrices,
  marketCommodities,
  marketCrypto,
  topGainers,
  topLosers,
  mutualFunds,
} from "../../data/markets.js";

const REGIONS = [
  {
    key: "india",
    label: "ભારત",
    icon: MapPin,
    color: "text-emerald-600 dark:text-emerald-400",
    data: marketIndices,
  },
  {
    key: "usa",
    label: "USA",
    icon: DollarSign,
    color: "text-blue-600 dark:text-blue-400",
    data: globalMarketsUSA,
  },
  {
    key: "uk",
    label: "UK",
    icon: PoundSterling,
    color: "text-rose-600 dark:text-rose-400",
    data: globalMarketsUK,
  },
  {
    key: "asia",
    label: "એશિયા",
    icon: Globe,
    color: "text-indigo-600 dark:text-indigo-400",
    data: globalMarketsAsia,
  },
];

function SectionLabel({ children }) {
  return (
    <div className="mb-2.5 mt-5 flex items-center gap-2 first:mt-0 sm:mb-3 sm:mt-7">
      <h4 className="font-gu text-[13px] font-bold tracking-wide text-[#e48d0b] sm:text-sm md:text-[15px] dark:text-[#e6c27a]">
        {children}
      </h4>
      <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />
    </div>
  );
}

function MarketScroll({ items }) {
  return (
    <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 pt-0.5 scrollbar-none sm:gap-3">
      {items.map((m) => (
        <div
          key={m.id}
          className="group min-w-[128px] shrink-0 rounded-xl border border-black/5 bg-black/[0.02] p-2.5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/[0.03] hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] sm:min-w-[145px] sm:rounded-2xl sm:p-3.5 md:min-w-[160px]"
        >
          <div className="truncate font-gu text-[11px] font-medium text-ink/70 transition-colors duration-200 group-hover:text-[#e48d0b] sm:text-[12px] md:text-[13px] dark:text-ink-dark/70">
            {m.name}
          </div>
          <div className="mt-1 font-en text-[14px] font-bold tracking-tight text-ink sm:mt-1.5 sm:text-[15px] md:text-base dark:text-ink-dark">
            {m.value}
          </div>
          <div
            className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-en text-[10px] font-semibold sm:text-xs ${
              m.up
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            <span>{m.up ? "▲" : "▼"}</span>
            <span>{m.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GainLoseCol({ title, tone, items }) {
  const isGain = tone === "gain";
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.02] sm:rounded-2xl">
      <div
        className={`flex items-center justify-between border-b border-black/5 px-3 py-2 font-gu text-[11px] font-bold tracking-wide sm:px-4 sm:py-2.5 sm:text-xs md:text-sm dark:border-white/5 ${
          isGain
            ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-red-50/80 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        }`}
      >
        <span>{title}</span>
        <span className="font-en text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">
          24H
        </span>
      </div>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between px-3 py-2 font-gu text-[13px] transition-colors hover:bg-black/[0.02] sm:px-4 sm:py-2.5 sm:text-sm dark:hover:bg-white/[0.02]"
          >
            <span className="min-w-0 truncate font-medium text-ink dark:text-ink-dark">
              {it.stock}
            </span>
            <span
              className={`ml-2 shrink-0 rounded-md px-1.5 py-0.5 font-en text-[11px] font-bold sm:px-2 sm:text-xs md:text-sm ${
                isGain
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {it.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketDashboard() {
  const [region, setRegion] = useState("india");
  const activeRegionData =
    REGIONS.find((r) => r.key === region)?.data ?? marketIndices;

  return (
    <section className="border-t border-black/5 pt-4 dark:border-white/5 sm:pt-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="flex items-center gap-2 font-gu text-base font-bold text-ink sm:text-lg md:text-xl dark:text-ink-dark">
          <span>બજારના તાજા આંકડા</span>
        </h3>
      </div>

      {/* Shell: tighter on mobile */}
      <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:rounded-3xl sm:p-4 md:p-6">
        {/* શેરબજાર */}
        <SectionLabel>શેરબજાર</SectionLabel>

        {/* Region selector — horizontal scroll on very small screens */}
        <div className="-mx-0.5 mb-3 overflow-x-auto scrollbar-none sm:mb-4">
          <div className="inline-flex min-w-full items-center gap-1 rounded-xl border border-black/5 bg-gray-100/80 p-1 shadow-inner backdrop-blur-md dark:border-white/5 dark:bg-neutral-800/60 sm:min-w-0 sm:rounded-2xl sm:p-1.5">
            {REGIONS.map((r) => {
              const isActive = region === r.key;
              const IconComponent = r.icon;

              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRegion(r.key)}
                  className={`group relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 font-gu text-[11px] font-semibold leading-none tracking-wide transition-all duration-300 ease-out select-none sm:flex-none sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs md:text-[14px] ${
                    isActive
                      ? "scale-[1.02] bg-[#e48d0b] text-white shadow-md shadow-[#e48d0b]/20 dark:bg-[#e6c27a] dark:text-[#221a10] dark:shadow-[#e6c27a]/10"
                      : "border border-transparent text-slate-600 hover:border-black/5 hover:bg-black/[0.04] hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/5 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  }`}
                >
                  <IconComponent
                    size={14}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 transition-all duration-300 group-hover:scale-110 sm:h-4 sm:w-4 ${
                      isActive
                        ? "text-white dark:text-[#221a10]"
                        : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"
                    }`}
                  />
                  <span className="inline-block translate-y-[0.5px] leading-none whitespace-nowrap">
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <MarketScroll items={activeRegionData} />

        <SectionLabel>કોમોડિટીઝ</SectionLabel>
        <MarketScroll items={marketCommodities} />

        <SectionLabel>ચલણ વિનિમય દર</SectionLabel>
        <MarketScroll items={marketCurrency} />

        <SectionLabel>ઇંધણના ભાવ — ગુજરાત</SectionLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {fuelPrices.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-2 rounded-xl border border-black/5 bg-black/[0.015] p-2.5 transition-all hover:bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] sm:gap-3 sm:rounded-2xl sm:p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-base dark:bg-white/[0.06] sm:h-10 sm:w-10 sm:rounded-xl sm:text-xl">
                {f.emoji}
              </div>
              <div className="min-w-0">
                <div className="truncate font-gu text-[10px] text-ink/60 sm:text-[11px] dark:text-ink-dark/60">
                  {f.label}
                </div>
                <div className="font-en text-[13px] font-bold tracking-tight text-ink sm:text-sm md:text-[15px] dark:text-ink-dark">
                  {f.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <SectionLabel>ટોપ ગેઇનર / ટોપ લુઝર</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <GainLoseCol title="ટોપ ગેઇનર" tone="gain" items={topGainers} />
          <GainLoseCol title="ટોપ લુઝર" tone="loss" items={topLosers} />
        </div>

        <SectionLabel>ક્રિપ્ટો કરન્સી</SectionLabel>
        <MarketScroll items={marketCrypto} />

        <SectionLabel>ભારતીય મ્યુચ્યુઅલ ફન્ડ્સ</SectionLabel>
        <div className="divide-y divide-black/5 overflow-hidden rounded-xl border border-black/5 bg-black/[0.015] dark:divide-white/5 dark:border-white/10 dark:bg-white/[0.02] sm:rounded-2xl">
          {mutualFunds.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-black/[0.02] sm:px-4 sm:py-3 dark:hover:bg-white/[0.02]"
            >
              <div className="min-w-0 pr-2">
                <div className="truncate font-gu text-[13px] font-semibold text-ink sm:text-sm dark:text-ink-dark">
                  {f.name}
                </div>
                <div className="mt-0.5 font-en text-[10px] text-ink/50 sm:text-xs dark:text-ink-dark/50">
                  {f.sub}
                </div>
              </div>
              <div
                className={`shrink-0 rounded-md px-2 py-0.5 font-en text-[11px] font-bold sm:px-2.5 sm:py-1 sm:text-xs md:text-sm ${
                  f.up
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {f.ret}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 border-t border-black/5 pt-3 font-gu text-[10px] leading-relaxed text-ink/40 sm:mt-6 sm:pt-4 sm:text-[11px] dark:border-white/5 dark:text-ink-dark/40">
          *શેરબજાર, ટોપ ગેઇનર/લુઝર અને મ્યુચ્યુઅલ ફંડના આંકડા ડેમો હેતુ માટે છે.
          ચલણ દર અને ઇંધણના ભાવ તાજેતરના સંદર્ભ આંકડા પર આધારિત છે.
        </p>
      </div>
    </section>
  );
}