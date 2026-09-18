import { Trophy, Award } from "lucide-react";
import MainGrid from "../components/layout/MainGrid.jsx";
import { useGameDetail } from "../context/GameDetailContext.jsx";

function SectionHeader({ title }) {
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <h1 className="font-gu text-xl sm:text-2xl md:text-3xl font-bold text-[#e48d0b] flex gap-x-2 sm:gap-x-3 items-center">
        {title}
        <span className="flex items-center gap-0.5 mb-0.5 sm:mb-1">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]" />
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </h1>
    </div>
  );
}

const LEADERBOARD_DATA = [
  { rank: 1, name: "ધવલ પટેલ", points: "૨,૪૫૦ pt", medalColor: "text-amber-400" },
  { rank: 2, name: "મીરા શાહ", points: "૨,૧૬૦ pt", medalColor: "text-slate-300" },
  { rank: 3, name: "કિરણ ઠાકોર", points: "૧,૯૮૦ pt", medalColor: "text-amber-700 dark:text-amber-600" },
  { rank: 4, name: "રવિ મહેતા", points: "૧,૭૪૦ pt", medalColor: null },
  { rank: 5, name: "તમે (વાચક)", points: "૧,૬૨૦ pt", medalColor: null, isUser: true },
];

export default function GamesPage() {
  const { games, openGame } = useGameDetail();

  return (
    <MainGrid>
      <div className="py-1 sm:py-2">
        <SectionHeader title="ગેમ્સ" />

        {/* ===== Games Grid ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
          {games.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => openGame(g)}
              className="relative flex flex-col items-center justify-center
                         p-2.5 sm:p-4 md:p-5
                         rounded-xl sm:rounded-2xl text-left
                         bg-white dark:bg-white/[0.04]
                         border border-gray-200/70 dark:border-white/10
                         shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                         dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]
                         hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]
                         dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)]
                         transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:-translate-y-0.5 active:scale-[0.98]
                         group"
            >
              {/* Badge */}
              {g.badge && (
                <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3
                                 rounded-[7px] pt-1 bg-black/60 backdrop-blur-md text-[#fbc02d]
                                 px-1.5 sm:px-2 py-0.5
                                 text-[11px] md:text-[14px] sm:text-xs font-gu font-bold tracking-wide">
                  {g.badge}
                </span>
              )}

              {/* Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                              rounded-2xl sm:rounded-2xl md:rounded-3xl
                              bg-black/[0.04] dark:bg-white/[0.08]
                              flex items-center justify-center
                              mb-1.5 sm:mb-2.5 md:mb-3
                              transition-colors duration-300
                              group-hover:bg-[#e48d0b]/15 overflow-hidden">
                <div
                  className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14
                             [&>svg]:w-full [&>svg]:h-full
                             dark:[&>svg]:brightness-0 dark:[&>svg]:invert"
                  dangerouslySetInnerHTML={{ __html: g.svg }}
                />
              </div>

              {/* Title */}
              <h3 className="article-headline">
                <span className="font-semibold">{g.title}</span>
              </h3>

              {/* Description */}
              <p className="mt-1 article-metaRow">
                <span className="text-center">{g.description}</span>
              </p>
            </button>
          ))}
        </div>

        {/* ===== Leaderboard ===== */}
        <div className="mt-7 sm:mt-10 md:mt-12">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-4 md:mb-5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10
                            items-center justify-center rounded-xl
                            bg-[#ffc107]/15 dark:bg-[#3a2d00]/50 text-[#e48d0b]">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <h2 className="font-gu text-[19px] sm:text-lg md:text-[26px]
                           font-bold text-ink dark:text-ink-dark leading-tight">
              લીડરબોર્ડ{" "}
              <span className="text-ink/40 dark:text-ink-dark/40 font-normal
                               text-[19px] sm:text-sm md:text-[26px]">
                — આ સપ્તાહ
              </span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl sm:rounded-2xl
                          bg-white dark:bg-white/[0.04]
                          border border-gray-200/70 dark:border-white/10
                          shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                          dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]">
            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {LEADERBOARD_DATA.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between gap-2 sm:gap-3
                              px-3 sm:px-4 md:px-5
                              py-2.5 sm:py-3 md:py-3.5
                              transition-colors duration-200 ${
                    item.isUser
                      ? "bg-[#e48d0b]/15 dark:bg-[#e48d0b]/10"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <div className="w-5 sm:w-6 md:w-8 flex justify-center items-center shrink-0">
                      {item.medalColor ? (
                        <Award className={`w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${item.medalColor}`} />
                      ) : (
                        <span className="font-gu font-bold text-[15px] sm:text-[16.5px] md:text-[18px]
                                         text-ink/60 dark:text-ink-dark/60">
                          {item.rank}
                        </span>
                      )}
                    </div>

                    <span
                      className={`article-headline ${
                        item.isUser
                          ? "text-[#e48d0b] dark:text-[#e48d0b] font-bold"
                          : "text-ink dark:text-ink-dark font-medium"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <span className="font-gu text-[15px] sm:text-sm md:text-[20px]
                                   font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainGrid>
  );
}