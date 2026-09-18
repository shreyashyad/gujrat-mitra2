import { useState } from "react";
import { Share } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { allContent } from "../../data/opinion.js";
import ShareModal from "../common/ShareModal.jsx";

const editorial = allContent.editorial || [];
const commentAndColumns = allContent.commentAndColumns || [];

export default function OpinionWidgetCard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [shareItem, setShareItem] = useState(null);

  // Hero: editorial માંથી isHero: true
  const heroCard =
    editorial.find((item) => item.isHero) || editorial[0] || null;

  // List: commentAndColumns ના પહેલા 6
  const listCards = commentAndColumns.slice(0, 6);

  const openArticle = (item) => {
    if (!item?.id) return;
    navigate(`/opinion/${item.id}`);
  };

  const stripHtml = (html) =>
    html ? html.replace(/<\/?[^>]+(>|$)/g, "") : "";

  const handleShare = (e, item) => {
    e.stopPropagation();
    setShareItem(item);
  };

  if (!heroCard && listCards.length === 0) return null;

  return (
    <div className="w-full flex flex-col space-y-1">
      {/* Title */}
      <div className="flex items-center gap-1.5 select-none">
        <Link
          to="/opinion"
          className="font-gu tracking-tight text-[#e48d0b] dark:text-[#f0b84a] text-[26px] font-bold cursor-pointer"
        >
          ઓપીનિયન
        </Link>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-[7px] border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#121212] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[3000px]" : "max-h-[500px]"
            }`}
        >
          <div className="p-4 flex flex-col gap-4">
            {/* Hero Card – editorial isHero */}
            {heroCard && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => openArticle(heroCard)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openArticle(heroCard);
                }}
                className="relative rounded-[5px] p-3.5 pt-5 flex flex-col cursor-pointer
                           bg-gradient-to-b from-[#FAE589] to-white 
                           dark:from-[#2a2512] dark:to-[#1c1c1e]
                           transition-all hover:-translate-y-0.5"
              >
                <span
                  className="absolute -top-3 left-2 text-[#C41E3A] dark:text-[#e03a55] font-serif font-black text-[60px] leading-none select-none z-10 drop-shadow-sm"
                  aria-hidden
                >
                  “
                </span>

                <h4 className="article-headline text-ink dark:text-ink-dark">
                  {heroCard.title}
                </h4>

                <div className="my-2 border-b border-dashed border-black/20 dark:border-white/20 w-full" />

                <p className="font-gu text-[15px] sm:text-[16px] leading-[1.45] text-ink/70 dark:text-ink-dark/70 line-clamp-2">
                  {stripHtml(heroCard.body || heroCard.summary || "")}
                </p>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="inline-flex items-center gap-0.5 font-gu font-semibold text-[20px] text-[#C41E3A] dark:text-[#e03a55]">
                      <span className="font-serif text-[20px] leading-none">“</span>
                      <span className="text-ink dark:text-ink-dark">ઓપીનિયન</span>
                    </span>

                    <span className="font-gu text-[14px] text-ink/60 dark:text-ink-dark/60 truncate flex items-center gap-1">
                      <span>{heroCard.author}</span>
                      {heroCard.date && (
                        <>
                          <span className="opacity-50">·</span>
                          <span>{heroCard.date}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="શેર કરો"
                    onClick={(e) => handleShare(e, heroCard)}
                    className="shrink-0 text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] transition-colors p-1 cursor-pointer"
                  >
                    <Share size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* List Section – commentAndColumns */}
            {listCards.length > 0 && (
              <div className="flex flex-col">
                <Link
                  to="/opinion"
                  className="bg-[#FFD700] text-black font-gu font-medium text-[12.5px] sm:text-[16px] px-5 py-1 rounded-r-[5px] w-fit shadow-sm flex items-center justify-start z-10 cursor-pointer"
                >
                  <span className="text-left pr-5">ઓપીનિયન</span>
                </Link>

                <div className="flex flex-col border-l-[1.5px] border-b-[1.5px] border-[#FFD700] pl-3 pt-4 -mt-1 rounded-bl-[5px]">
                  {listCards.map((item, index) => (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openArticle(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") openArticle(item);
                      }}
                      className={`pb-3 flex flex-col gap-1 group cursor-pointer transition-all hover:-translate-y-0.5 ${index !== listCards.length - 1
                        ? "border-b border-dashed border-black/15 dark:border-white/15 mb-3"
                        : ""
                        }`}
                    >
                      <h5 className="article-headline text-ink dark:text-ink-dark transition-colors">
                        {item.title}
                      </h5>

                      <div className="flex items-center justify-between gap-2 text-[11.5px] sm:text-[12px] font-gu text-ink/55 dark:text-ink-dark/55">
                        <div className="flex items-center gap-1 flex-wrap min-w-0">
                          <span className="inline-flex items-center text-[#C41E3A] dark:text-[#e03a55] font-semibold shrink-0">
                            <span className="font-serif text-[13px] leading-none">“</span>
                            <span className="text-[15px] font-medium text-ink/55 dark:text-ink-dark/55 ml-0.5">
                              ઓપીનિયન
                            </span>
                          </span>
                          <span>,</span>
                          <span className="font-medium text-[15px]">{item.author}</span>
                          {item.date && (
                            <>
                              <span>,</span>
                              <span className="text-[15px]">{item.date}</span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          aria-label="શેર કરો"
                          onClick={(e) => handleShare(e, item)}
                          className="shrink-0 text-ink/35 dark:text-ink-dark/35 hover:text-[#e48d0b] transition-colors p-1 cursor-pointer"
                        >
                          <Share size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {listCards.length > 0 && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-2.5 flex items-center justify-center border-t border-gray-500/10 cursor-pointer"
            aria-label="Toggle opinion list"
          >
            <svg
              className={`w-5 h-5 text-[#c2a503] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
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
      <ShareModal
        open={Boolean(shareItem)}
        onClose={() => setShareItem(null)}
        title={shareItem?.title}
        text={shareItem?.title}
        url={
          shareItem
            ? `${window.location.origin}/opinion/${shareItem.id}`
            : ""
        }
        image={shareItem?.img || shareItem?.image}
      />
    </div>
  );
}