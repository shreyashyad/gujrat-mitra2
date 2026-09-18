import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { charchaPatroData } from "../../data/CharchaPatroData.js";
import { useCharchaPatraDetail } from "../../context/CharchaPatraDetailContext.jsx";

export default function CharchaPatroWidgetCard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { openDetail } = useCharchaPatraDetail();

  // isHero: true સૌથી ઉપર, પછી બાકીના (કુલ 6)
  const latestItems = useMemo(() => {
    const hero = charchaPatroData.find((item) => item.isHero);
    const others = charchaPatroData.filter((item) => item.id !== hero?.id);
    return hero ? [hero, ...others].slice(0, 6) : charchaPatroData.slice(0, 6);
  }, []);

  const openArticle = (item) => {
    if (!item) return;
    // openDetail() updates the panel instantly; navigate() below is the
    // only history entry this should push (see CharchaPatraDetailContext
    // for why an extra manual pushState here used to triple it up).
    openDetail(item);
    navigate(`/charcha-patra/${item.id}`);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (!latestItems.length) return null;

  return (
    <div className="w-full flex flex-col space-y-2.5 p-4 bg-white dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-3xl shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]">
      {/* Title Header */}
      <Link
        to="/charcha-patra"
        className="group flex items-center gap-1.5 w-fit select-none active:opacity-50 transition-opacity duration-150"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-bold">
          ચર્ચાપત્રો
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </Link>

      <div className="w-full">
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden flex flex-col gap-2 ${
            isOpen ? "max-h-[3000px]" : "max-h-[310px]"
          }`}
        >
          {latestItems.map((item) => {
            const profileImg =
              item.profilePhoto ||
              item.authorImage ||
              item.profilePic ||
              item.avatar ||
              null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openArticle(item)}
                className="flex items-center gap-3.5 rounded-[7px] bg-white dark:bg-[#1a1a1a] p-1 text-left transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer border-0 w-full"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-black/10 dark:border-white/10 bg-slate-100 flex items-center justify-center">
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt={item.author || ""}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <span className="font-gu font-bold text-ink/50 text-lg">
                      {(item.author || "?").charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <p className="font-gu text-[20px] leading-[1.25] text-black dark:text-ink-dark line-clamp-2 font-medium">
                    {item.title}
                  </p>

                  <div className="mt-1 flex items-center gap-1 font-gu text-[14px] font-semibold text-black/70 dark:text-ink-dark/70">
                    <span className="text-red-600 font-serif font-bold text-base leading-none">
                      “
                    </span>
                    <span className="truncate text-[14px]">{item.author}</span>
                    {item.location && (
                      <>
                        <span className="opacity-50">·</span>
                        <span className="truncate text-[13px] opacity-80">
                          📍 {item.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {latestItems.length > 3 && (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full py-2 mt-2 flex items-center justify-center border-t border-gray-500/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Toggle charcha patro list"
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