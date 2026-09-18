import { useRef, useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { trendingTopics } from "../../../data/trendingTopics.js";

export default function TrendingNavbar() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    checkScrollPosition();
    const el = scrollContainerRef.current;
    const observer = new ResizeObserver(() => checkScrollPosition());
    if (el) observer.observe(el);
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="w-full min-w-0 overflow-hidden backdrop-blur-md select-none pt-1 px-2 md:px-0">
      <div
        className="mx-auto flex min-h-10 w-full min-w-0 max-w-[1440px] items-center gap-1.5 overflow-hidden sm:min-h-8 sm:gap-2  pr-0 md:pr-2"
        style={{ borderTopColor: "rgba(185, 127, 38, 0.30)" }}
      >
        {/* Sticky Label */}
        <div className="flex shrink-0 items-start">
          <span className="flex items-center gap-2 whitespace-nowrap font-gu text-[22px] sm:text-[24px] font-extrabold tracking-wide text-[#e48d0b]">
            ચર્ચામાં
          </span>
        </div>

        {/* Scrollable Container with Left/Right Buttons */}
        <div className="relative flex w-full items-center min-w-0 flex-1">
          {/* Left Button (હવે મોબાઇલમાં પણ દેખાશે) */}
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`flex shrink-0 items-center justify-center h-7 w-7 rounded-full
                       backdrop-blur-sm transition-all duration-300 mr-1 sm:mr-2 z-10
                       ${canScrollLeft
                ? "bg-white/90 dark:bg-neutral-800/90 text-[#e48d0b] dark:text-[#E6C27A] border border-[#e48d0b]/30 dark:border-[#E6C27A]/30 hover:bg-[#e48d0b] hover:text-white dark:hover:bg-[#e48d0b] dark:hover:text-white hover:border-[#e48d0b] hover:shadow-md hover:shadow-[#e48d0b]/20 active:scale-90 cursor-pointer opacity-100"
                : "bg-slate-100/50 dark:bg-neutral-900/40 text-slate-400 dark:text-neutral-600 border border-slate-200/50 dark:border-neutral-800/50 opacity-40 cursor-not-allowed"
              }`}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>

          <ul
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex min-w-0 w-full items-center gap-3 overflow-x-auto no-scrollbar px-0.5 pb-1 scroll-smooth sm:gap-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {trendingTopics.map((topic, index) => (
              <li key={topic.id} className="shrink-0 flex items-center gap-3 sm:gap-4">
                <NavLink
                  to={`/trending/${topic.slug}`}
                  className="group relative inline-flex items-center whitespace-nowrap
                             font-gu text-[16px]  sm:text-[18px] transition-colors duration-200 active:scale-95"
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`transition-colors duration-200 ${isActive
                            ? "text-[#e48d0b] dark:text-[#E6C27A] font-bold"
                            : "text-black dark:text-ink-dark/80 font-semibold"
                          }`}
                      >
                        <div className="flex items-start gap-1">
                          {topic.title}
                        </div>
                      </span>

                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -bottom-0.5 left-1/2 h-[2px]
                                    -translate-x-1/2 rounded-full bg-[#e48d0b] dark:bg-[#E6C27A]
                                    transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </>
                  )}
                </NavLink>

                {/* Separator Pipe symbol except for the last item */}
                {index < trendingTopics.length - 1 && (
                  <span className="mx-[-5px] text-base text-slate-300 dark:text-neutral-700 select-none">
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Right Button (હવે મોબાઇલમાં પણ દેખાશે) */}
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`flex shrink-0 items-center justify-center h-7 w-7 rounded-full
                       backdrop-blur-sm transition-all duration-300 ml-1 sm:ml-2 z-10
                       ${canScrollRight
                ? "bg-white/90 dark:bg-neutral-800/90 text-[#e48d0b] dark:text-[#E6C27A] border border-[#e48d0b]/30 dark:border-[#E6C27A]/30 hover:bg-[#e48d0b] hover:text-white dark:hover:bg-[#e48d0b] dark:hover:text-white hover:border-[#e48d0b] hover:shadow-md hover:shadow-[#e48d0b]/20 active:scale-90 cursor-pointer opacity-100"
                : "bg-slate-100/50 dark:bg-neutral-900/40 text-slate-400 dark:text-neutral-600 border border-slate-200/50 dark:border-neutral-800/50 opacity-40 cursor-not-allowed"
              }`}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}