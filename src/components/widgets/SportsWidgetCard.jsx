import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getSportsPointsTable } from "../../services/newsService.js";

export default function SportsWidgetCard() {
  const { data: sportsPointsTable, loading } = useAsyncData(
    getSportsPointsTable,
    []
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = pathname === "/category/ramatgamat";

  // આખા કાર્ડ કન્ટેનર પર ક્લિક કરવાથી /category/ramatgamat પેજ પર નેવિગેટ થશે
  const handleCardClick = () => {
    navigate("/category/ramatgamat");
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && navigate("/category/ramatgamat")}
      className="select-none space-y-2 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
    >
      {/* Title Header */}
      <Link
        to="/category/ramatgamat"
        onClick={(e) => e.stopPropagation()}
        className="group flex items-center gap-1.5 w-fit select-none active:opacity-50 transition-opacity duration-150"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-semibold">
          રમતગમત
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
        className="group relative block rounded-[7px] overflow-hidden bg-white dark:bg-[#121212] transition-transform duration-300 ease-out"
      >
        <div className="flex flex-col items-center pt-3 pb-1 px-3">
          <p className="font-gu font-bold text-[14px] sm:text-[15px] text-ink dark:text-ink-dark text-center leading-tight">
            કોમનવેલ્થ ગેમ્સ | અમદાવાદ ૨૦૩૦
          </p>
          <p className="font-gu text-[12px] sm:text-[13px] text-ink dark:text-ink-dark/55 mt-0.5">
            ચંદ્રક તાલિકા
          </p>
        </div>

        {loading || !sportsPointsTable ? (
          <div className="px-3 pb-3 space-y-2 animate-pulse">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-4 rounded bg-black/5 dark:bg-[#121212]"
              />
            ))}
          </div>
        ) : (
          <div className="px-2 pb-3">
            <table className="w-full font-gu border-collapse">
              <thead>
                <tr className="text-ink/55 dark:text-ink-dark/55 text-[15px] border-b border-black/10 dark:border-white/10">
                  <th className="font-semibold py-2 px-1 text-center w-8">
                    ક્રમ
                  </th>
                  <th className="font-semibold py-2 px-1.5 text-left">દેશ</th>
                  <th className="font-semibold py-2 px-1 text-center w-8">
                    🥇
                  </th>
                  <th className="font-semibold py-2 px-1 text-center w-8">
                    🥈
                  </th>
                  <th className="font-semibold py-2 px-1 text-center w-8">
                    🥉
                  </th>
                  <th className="font-semibold py-2 px-1 text-center w-9">
                    કુલ
                  </th>
                </tr>
              </thead>
              <tbody>
                {sportsPointsTable.map((row) => (
                  <tr
                    key={row.id || row.team}
                    className="border-b border-black/5 dark:border-white/5 last:border-none"
                  >
                    <td className="py-2 px-1 text-center text-[15px] font-bold text-ink/70 dark:text-ink-dark/70">
                      {row.rank}
                    </td>
                    <td className="py-2 px-1.5 text-[15px] font-normal text-ink dark:text-ink-dark">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {row.flag && (
                          <img
                            src={row.flag}
                            alt={row.team}
                            className="w-5 h-3.5 object-cover shrink-0"
                          />
                        )}
                        <span className="truncate">{row.team}</span>
                      </div>
                    </td>
                    <td className="py-2 px-1 text-center text-[15px] font-semibold text-ink/80 dark:text-ink-dark/80">
                      {row.gold}
                    </td>
                    <td className="py-2 px-1 text-center text-[15px] font-semibold text-ink/80 dark:text-ink-dark/80">
                      {row.silver}
                    </td>
                    <td className="py-2 px-1 text-center text-[15px] font-semibold text-ink/80 dark:text-ink-dark/80">
                      {row.bronze}
                    </td>
                    <td className="py-2 px-1 text-center text-[15px] font-bold text-ink dark:text-ink-dark">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}