import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getMarketSnapshot } from "../../services/newsService.js";

export default function MarketWidgetCard() {
  const { data: rows, loading } = useAsyncData(getMarketSnapshot, []);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = pathname === "/category/vyapar";

  // આખા કાર્ડ કન્ટેનર પર ક્લિક કરવાથી /category/vyapar પેજ પર નેવિગેટ થશે
  const handleCardClick = () => {
    navigate("/category/vyapar");
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && navigate("/category/vyapar")}
      className="select-none space-y-2 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
    >
      {/* Title Header */}
      <Link
        to="/category/vyapar"
        onClick={(e) => e.stopPropagation()}
        className="group flex items-center gap-1.5 w-fit select-none active:opacity-50 transition-opacity duration-150"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-semibold">
          વ્યાપાર
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </Link>

      {/* Main Content Container */}
      <div
        aria-current={isActive ? "page" : undefined}
        className="group relative block rounded-[7px] overflow-hidden bg-white dark:bg-[#121212] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        <div className="w-full pt-2 pb-1">
          {loading || !rows ? (
            <div className="p-4 space-y-2 animate-pulse">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="h-4 rounded bg-black/5 dark:bg-[#121212]" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 px-1">
              {rows.map((row, idx) => {
                const isPositive = row.up ?? !String(row.value).startsWith("-");
                const formattedValue = String(row.value).replace(/^[+-]/, "");

                return (
                  <div
                    key={row.name || idx}
                    className="flex items-center justify-between text-[20px] font-gu font-normal leading-tight"
                  >
                    <span className="text-black dark:text-white">
                      {row.name}
                    </span>
                    <span
                      className={`font-en font-bold text-[16px] ${
                        isPositive
                          ? "text-[#16a34a] dark:text-[#22c55e]"
                          : "text-[#dc2626] dark:text-[#ef4444]"
                      }`}
                    >
                      {isPositive ? `+${formattedValue}` : `-${formattedValue}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-3 py-2 text-center">
          <p className="text-[12px] font-gu text-black/50 dark:text-white/50">
            તારીખ 27 ફેબ્રુઆરી ના આંકડા મુજબ
          </p>
        </div>
      </div>
    </div>
  );
}