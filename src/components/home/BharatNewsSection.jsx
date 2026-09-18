import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/**
 * Image on the RIGHT, Clean No-Card Style.
 * Meta: category • time • readTime
 * Save Button on Image (Top-Right)
 */
function BharatCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    openNews(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === "Enter" && handleOpen(e)}
      className="group relative flex w-full items-stretch justify-between gap-3 p-0 cursor-pointer
                 lg:min-h-[103px]
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      {/* Content — LEFT */}
      <div className="flex flex-1 flex-col justify-between md:justify-start! py-0.5 min-w-0">
        {/* No forced 3-line height – MetaRow sits right after actual headline */}
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <div className="article-metaRow">
          {/* Always single row + truncate on overflow (all devices) */}
          <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-1">
            {article.cat && (
              <>
                <span className="font-semibold text-[#e48d0b]">{article.cat}</span>
                <span className="opacity-50">•</span>
              </>
            )}
            <span>{article.time}</span>
            <span className="opacity-50">•</span>
            <span className="truncate">{getReadTime(article)}</span>
          </div>
        </div>
      </div>

      {/* Thumbnail — RIGHT */}
      <div className="relative h-20 w-24 sm:h-[104px] sm:w-[130px] shrink-0 overflow-hidden rounded-[7px]">
        {article.img ? (
          <img
            src={article.img}
            alt={article.headline || ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/5 dark:bg-white/5 text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Bookmark
            size={16}
            className={`${isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

export default function BharatNewsSection() {
  const list = (articles.india || []).filter((a) => a.type !== "hero");
  if (!list.length) return null;

  const items = list.slice(0, 6);

  return (
    <section className="lg:items-stretch shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      {/* 
        • < 913px          → 1 column (list)
        • 913px – 1023px   → 2 columns
        • ≥ 1024px (lg)    → 3 columns (desktop untouched)
      */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 min-[913px]:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <BharatCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}