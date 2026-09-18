import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useGameDetail } from "../../context/GameDetailContext.jsx";
import WordSearchGame from "../games/WordSearchGame.jsx";
import SudokuGame from "../games/SudokuGame.jsx";
import CrosswordGame from "../games/CrosswordGame.jsx";
import QuizGame from "../games/QuizGame.jsx";
import TriviaGame from "../games/TriviaGame.jsx";
import { useNavigate } from "react-router-dom";

function truncateWords(text, max = 3) {
  if (!text) return "";
  const words = String(text).trim().split(/\s+/);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ") + "…";
}

export default function GameDetailPanel() {
  const { games, activeGame, closeGame, openGame } = useGameDetail();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!activeGame?.id) return;
    const t = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => window.clearTimeout(t);
  }, [activeGame?.id]);

  if (!activeGame) return null;

  const otherGames = games.filter((g) => g.id !== activeGame.id);

  const renderGame = () => {
    if (!activeGame.available) {
      return (
        <div className="rounded-2xl bg-black/[0.02] px-4 py-8 text-center dark:bg-white/[0.03] sm:px-5 sm:py-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black/[0.05] text-ink/50 dark:bg-white/[0.08] dark:text-ink-dark/50 sm:h-16 sm:w-16">
            <Clock className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h2 className="mb-2 font-gu text-lg font-bold text-ink sm:text-xl md:text-2xl dark:text-ink-dark">
            {activeGame.title} વર્તમાનમાં ઉપલબ્ધ નથી
          </h2>
          <p className="mb-6 font-gu text-[13px] text-ink/60 sm:text-sm dark:text-ink-dark/60">
            અમે આ ગેમ પર કામ કરી રહ્યા છીએ — ટૂંક સમયમાં અપડેટ કરવામાં આવશે!
          </p>
          <button
            type="button"
            onClick={closeGame}
            className="rounded-full bg-[#e48d0b] px-6 py-2.5 font-gu text-sm font-bold text-white shadow-[0_2px_8px_rgba(185,127,38,0.25)] transition-all duration-200 hover:bg-[#a06d20] active:scale-[0.98] sm:px-8"
          >
            મુખ્ય મેનૂ પર જાઓ
          </button>
        </div>
      );
    }

    switch (activeGame.id) {
      case "crossword":
        return (
          <div className="rounded-xl bg-black/[0.015] p-3 dark:bg-white/[0.03] sm:rounded-2xl sm:p-4 md:p-6">
            <CrosswordGame />
          </div>
        );
      case "wordsearch":
        return (
          <div className="rounded-xl bg-black/[0.015] p-3 dark:bg-white/[0.03] sm:rounded-2xl sm:p-4 md:p-6">
            <WordSearchGame />
          </div>
        );
      case "sudoku":
        return (
          <div className="rounded-xl bg-black/[0.015] p-3 dark:bg-white/[0.03] sm:rounded-2xl sm:p-4 md:p-6">
            <SudokuGame />
          </div>
        );
      case "quiz":
        return <QuizGame />;
      case "trivia":
        return <TriviaGame />;
      default:
        return (
          <p className="py-10 text-center font-gu text-[14px] text-ink/60 sm:text-[15px] dark:text-ink-dark/60">
            આ ગેમ હજુ ઉપલબ્ધ નથી.
          </p>
        );
    }
  };

  return (
    <div
      ref={panelRef}
      className="
        w-full min-w-0 scroll-mt-28
        rounded-none border-0 bg-transparent p-0 shadow-none
        sm:scroll-mt-32 sm:rounded-3xl sm:border sm:border-gray-200/70 sm:bg-white sm:p-5
        sm:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
        md:p-7
        dark:sm:border-white/10 dark:sm:bg-[#121212]
      "
      role="article"
      aria-label={activeGame.title}
    >
      {/* Breadcrumb — same pattern as News / Opinion / Charcha */}
      <div className="mb-4 flex min-w-0 items-center gap-1 border-b border-black/5 pb-3 font-gu text-[15px] font-semibold text-ink sm:mb-5 sm:text-[17px] dark:border-white/10 dark:text-ink-dark">
        <button
          type="button"
          onClick={closeGame}
          className="mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-black/5 text-inherit transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] sm:mr-3 sm:h-9 sm:w-9 dark:bg-white/10"
          aria-label="બંધ કરો"
        >
          <ArrowLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-[14px] font-gu text-ink/60 sm:text-[15px] md:text-[17px] dark:text-ink-dark/60"
        >
          <button
            type="button"
            onClick={() => {
              closeGame();
              navigate("/");
            }}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium transition-colors hover:text-[#e48d0b]"
          >
            હોમ
          </button>
          <ChevronRight
            size={14}
            className="shrink-0 text-ink/40 dark:text-ink-dark/40"
          />
          <button
            type="button"
            onClick={() => {
              closeGame();
              navigate("/games");
            }}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-ink/80 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/80"
          >
            ગેમ્સ
          </button>
          <ChevronRight
            size={14}
            className="shrink-0 text-ink/40 dark:text-ink-dark/40"
          />
          <span
            className="min-w-0 truncate font-semibold text-[#e48d0b]"
            title={activeGame.title}
            aria-current="page"
          >
            {truncateWords(activeGame.title, 3)}
          </span>
        </nav>
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="w-full min-w-0">{renderGame()}</div>

        {/* વધુ રમો */}
        {otherGames.length > 0 && (
          <div className="mt-4 w-full sm:mt-6">
            <div className="mb-4 sm:mb-5 md:mb-6">
              <h2 className="flex items-center gap-x-2 font-gu text-xl font-bold text-[#e48d0b] sm:gap-x-3 sm:text-2xl md:text-3xl">
                વધુ રમો
                <span className="mb-0.5 flex items-center gap-0.5 sm:mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26] sm:h-2 sm:w-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/75 sm:h-2 sm:w-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/50 sm:h-2 sm:w-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/25 sm:h-2 sm:w-2" />
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3 xl:gap-5">
              {otherGames.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => openGame(g)}
                  className="group relative flex flex-col items-center justify-center rounded-xl border border-gray-200/70 bg-white p-2.5 text-left
                             shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                             transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                             hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]
                             active:scale-[0.98]
                             dark:border-white/10 dark:bg-white/[0.04]
                             dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]
                             dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)]
                             sm:rounded-2xl sm:p-4 md:p-5"
                >
                  {g.badge && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 font-gu text-[10px] font-bold tracking-wide text-[#fbc02d] backdrop-blur-md sm:right-3 sm:top-3 sm:px-2 sm:text-xs">
                      {g.badge}
                    </span>
                  )}

                  <div className="mb-1.5 flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-black/[0.04] transition-colors duration-300 group-hover:bg-[#e48d0b]/15 dark:bg-white/[0.08] sm:mb-3 sm:h-16 sm:w-16 sm:rounded-2xl md:h-20 md:w-20">
                    {g.svg ? (
                      <div
                        className="h-5 w-5 sm:h-12 sm:w-12 md:h-14 md:w-14 [&>svg]:h-full [&>svg]:w-full dark:[&>svg]:brightness-0 dark:[&>svg]:invert"
                        dangerouslySetInnerHTML={{ __html: g.svg }}
                      />
                    ) : (
                      <span className="font-gu text-xs font-bold text-[#e48d0b]">
                        {(g.title || "?").charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-0.5 text-center font-gu text-sm font-bold text-ink transition-colors duration-200 group-hover:text-[#e48d0b] sm:mb-1 sm:text-base md:text-[22px] dark:text-ink-dark dark:group-hover:text-[#e48d0b]">
                    {g.title}
                  </h3>

                  <p className="line-clamp-2 max-w-[16rem] text-center font-gu text-[11px] leading-snug text-ink/70 sm:text-xs md:text-[15px] md:line-clamp-none dark:text-ink-dark/60">
                    {g.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}