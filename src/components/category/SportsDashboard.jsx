// src/components/category/SportsDashboard.jsx
import {
  upcomingMatches,
  sportsPointsTable,
  topRunScorers,
  topWicketTakers,
} from "../../data/sportsData.js";

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

function MatchScroll({ items }) {
  return (
    <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 pt-0.5 scrollbar-none sm:gap-3">
      {items.map((m) => (
        <div
          key={m.id}
          className="group min-w-[140px] shrink-0 rounded-xl border border-black/5 bg-black/[0.02] p-2.5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/[0.03] hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] sm:min-w-[155px] sm:rounded-2xl sm:p-3.5 md:min-w-[170px]"
        >
          <div className="truncate font-gu text-[11px] font-medium text-ink/70 transition-colors duration-200 group-hover:text-[#e48d0b] sm:text-[12px] md:text-[13px] dark:text-ink-dark/70">
            {m.name}
          </div>
          <div className="mt-1 font-en text-[13px] font-bold tracking-tight text-emerald-600 sm:mt-1.5 sm:text-[14px] md:text-[15px] dark:text-emerald-400">
            {m.value}
          </div>
          <div className="mt-1 font-gu text-[10px] text-ink/50 sm:text-xs dark:text-ink-dark/50">
            {m.change}
          </div>
        </div>
      ))}
    </div>
  );
}

function PerformerCol({ title, tone, items }) {
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
          STATS
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

export default function SportsDashboard() {
  return (
    <section className="border-t border-black/5 pt-4 dark:border-white/5 sm:pt-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="flex items-center gap-2 font-gu text-base font-bold text-ink sm:text-lg md:text-xl dark:text-ink-dark">
          <span>રમતગમતના તાજા અપડેટ</span>
        </h3>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:rounded-3xl sm:p-4 md:p-6">
        {/* લાઇવ / આગામી મેચ */}
        <SectionLabel>લાઇવ / આગામી મેચ</SectionLabel>
        <MatchScroll items={upcomingMatches} />

        {/* પોઈન્ટ ટેબલ */}
        <SectionLabel>પોઈન્ટ ટેબલ</SectionLabel>
        <div className="divide-y divide-black/5 overflow-hidden rounded-xl border border-black/5 bg-black/[0.015] dark:divide-white/5 dark:border-white/10 dark:bg-white/[0.02] sm:rounded-2xl">
          {sportsPointsTable.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-black/[0.02] sm:px-4 sm:py-3 dark:hover:bg-white/[0.02]"
            >
              <span className="min-w-0 truncate font-gu text-[13px] font-semibold text-ink sm:text-sm dark:text-ink-dark">
                {t.team}
              </span>
              <span className="ml-2 shrink-0 rounded-md bg-black/[0.03] px-2 py-0.5 font-en text-[11px] font-medium text-ink/70 dark:bg-white/[0.06] dark:text-ink-dark/70 sm:px-2.5 sm:py-1 sm:text-xs md:text-sm">
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* ટોપ પર્ફોર્મર્સ */}
        <SectionLabel>ટોપ પર્ફોર્મર્સ</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <PerformerCol
            title="ટોપ રન સ્કોરર"
            tone="gain"
            items={topRunScorers}
          />
          <PerformerCol
            title="ટોપ વિકેટ ટેકર"
            tone="loss"
            items={topWicketTakers}
          />
        </div>

        <p className="mt-4 border-t border-black/5 pt-3 font-gu text-[10px] leading-relaxed text-ink/40 sm:mt-6 sm:pt-4 sm:text-[11px] dark:border-white/5 dark:text-ink-dark/40">
          *ટીમ/ખેલાડીના નામ અને આંકડા ડેમો હેતુ માટે છે, વાસ્તવિક નથી.
        </p>
      </div>
    </section>
  );
}