import { useState } from "react";
import { Link } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getPoll } from "../../services/newsService.js";
import { toGujDigits } from "../../utils/articleMeta.js";

export default function PollWidgetCard() {
  const { data: poll, loading } = useAsyncData(getPoll, []);
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(false);

  const handleVote = (e) => {
    e.stopPropagation();
    if (!selected) return;
    setVoted(true);
  };

  const optionPrefixes = ["A", "B", "C", "D", "E", "F"];

  if (loading || !poll) {
    return (
      <div className="select-none space-y-2 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300">
        <Link
          to="/opinion-poll"
          className="group flex items-center gap-1.5 select-none w-fit"
        >
          <h3 className="font-gu tracking-tight text-[#e48d0b] text-[26px] font-bold group-hover:opacity-80 transition-opacity">
            તમને શું લાગે છે
          </h3>
          <span className="flex items-center gap-0.5 shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
          </span>
        </Link>
        <div className="rounded-[18px] p-4 animate-pulse space-y-3 bg-white dark:bg-[#121212] border border-black/5 dark:border-white/10">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-11 rounded-xl bg-black/5 dark:bg-[#121212]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="select-none space-y-2 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300">
      {/* Title Header with Link */}
      <Link
        to="/opinion-poll"
        className="group flex items-center gap-1.5 w-fit select-none active:opacity-50 transition-opacity duration-150"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-bold">
          તમને શું લાગે છે
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </Link>

      {/* Poll Card Form */}
      <div className="rounded-[7px] p-2 bg-white dark:bg-[#121212]">
        <p className="article-headline pb-2">{poll.question}</p>

        <div className="flex flex-col gap-2 mb-3">
          {poll.options.map((opt, index) => {
            const isSelected = selected === opt.id;
            const prefix = optionPrefixes[index] || "";

            return (
              <button
                key={opt.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(opt.id);
                }}
                disabled={voted}
                className={`relative overflow-hidden rounded-[5px] p-2 text-left article-headline font-gu font-normal
                           border transition-all duration-200 active:scale-[0.99] cursor-pointer
                           ${
                             isSelected
                               ? "border-[#ebaa3e]/70 ring-1 ring-[#ebaa3e]/20"
                               : "border-black/5 dark:border-white/10 bg-white dark:bg-[#121212]"
                           }`}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-[#ebaa3e]/50 dark:bg-[#ebaa3e]/30 transition-all duration-500 ease-out"
                  style={{ width: voted ? `${opt.pct}%` : "0%" }}
                  aria-hidden="true"
                />

                <span className="relative z-10 flex items-center justify-between gap-2">
                  <span className="font-normal text-ink/90 dark:text-ink-dark/90">
                    <span className="mr-1">{prefix}.</span> {opt.label}
                  </span>
                  {voted && (
                    <span className="font-normal text-ink dark:text-ink-dark shrink-0 text-lg">
                      {toGujDigits(opt.pct)}%
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleVote}
          disabled={!selected || voted}
          className="w-full rounded-[5px] bg-[#ebaa3e] py-1.5 font-gu text-[15px] font-bold text-white
                     shadow-xs hover:brightness-95 active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                     transition-all duration-200 cursor-pointer"
        >
          {voted ? "તમારો મત નોંધાયો!" : "વોટ કરો"}
        </button>
      </div>
    </div>
  );
}