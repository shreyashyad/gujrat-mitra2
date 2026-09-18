import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GAMES_LIST } from "../../data/gamesList.js";

export default function GamesWidgetCard({ title = "ગેમ્સ", to = "/games", expandAll = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const games = GAMES_LIST.filter((g) => g.available);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(to);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && navigate(to)}
      className="w-full flex flex-col space-y-1.5 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-red-500/70 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
    >
      {/* Title Header */}
      <Link
        to={to}
        onClick={(e) => e.stopPropagation()}
        className="group flex items-center gap-1.5 w-fit select-none active:opacity-50 transition-opacity duration-150"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-semibold">
          {title}
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </Link>

      {/* Main Container */}
      <div className="w-full rounded-[7px] overflow-hidden bg-white dark:bg-[#121212]">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen || expandAll ? "max-h-[2000px]" : "max-h-[215px]"
          }`}
        >
          {games.map((g, index) => (
            <div key={g.id}>
              <div className="flex items-center justify-between gap-3 px-4 py-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors active:opacity-70">
                {/* Left: Title + Description */}
                <div className="flex flex-col min-w-0">
                  <h4 className="font-gu text-[20px] font-normal text-ink dark:text-ink-dark leading-tight">
                    {g.title}
                  </h4>
                  <p className="font-gu text-[15px] text-ink/50 dark:text-ink-dark/50 mt-0.5 leading-snug line-clamp-1">
                    {g.description}
                  </p>
                </div>

                {/* Right: SVG Icon — dark mode માં સફેદ */}
                <div className="w-12 h-12 shrink-0 flex items-center justify-center overflow-hidden">
                  <div
                    className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full dark:[&>svg]:brightness-0 dark:[&>svg]:invert"
                    dangerouslySetInnerHTML={{ __html: g.svg }}
                  />
                </div>
              </div>

              {index !== games.length - 1 && (
                <div className="mx-4 border-b border-red-500" />
              )}
            </div>
          ))}
        </div>

        {games.length > 2 && !expandAll && (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full py-2.5 flex items-center justify-center border-t border-gray-500/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Toggle games list"
          >
            <svg
              className={`w-5 h-5 text-red-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
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