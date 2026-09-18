import { Bookmark } from "lucide-react";
import { getFillerArticles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

export function FillerCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSave(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(event) => event.key === "Enter" && openNews(article)}
      className="group relative flex h-full w-full flex-row md:flex-col justify-between cursor-pointer gap-3 md:gap-0
                 border-b md:border-b-0 md:border-t pb-3 md:pb-0 pt-0 md:pt-2 border-black/0 dark:border-white/0
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
      {/* Mobile: fixed width + fixed height 86px */}
      <div className="relative w-24 sm:w-32 h-[86px] shrink-0 overflow-hidden rounded-lg md:hidden">
        {article.img ? (
          <img
            src={article.img}
            alt={article.headline || ""}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-black/5 dark:bg-white/5" />
        )}

        {/* Mobile Bookmark Button */}
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-2 right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Bookmark
            size={13}
            className={`sm:w-3.5 sm:h-3.5 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Text Container - justify-start so metaRow sits tight under headline */}
      <div className="flex flex-1 flex-col justify-start min-w-0 gap-1 md:pr-7">
        <div className="relative min-w-0">
          <p className="article-headline">
            {article.headline}
          </p>

          {/* Desktop Bookmark Button */}
          <button
            type="button"
            aria-label="સેવ કરો"
            onClick={handleBookmark}
            title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
            className="hidden md:block absolute top-0 right-0 p-0.5 text-ink/40 dark:text-ink-dark/40
                       hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer"
          >
            <Bookmark
              size={14}
              className={`sm:w-4 sm:h-4 ${
                isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""
              }`}
            />
          </button>
        </div>

        {/* MetaRow - sits exactly under headline */}
        <div className="article-metaRow">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 truncate pr-1">
            {article.cat && (
              <>
                <span className="font-semibold text-[#e48d0b]">
                  {article.cat}
                </span>
                <span className="opacity-50">•</span>
              </>
            )}
            <span>{article.time || "હમણાં"}</span>
            <span className="opacity-50">•</span>
            <span className="truncate">{getReadTime(article)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeFiller1() {
  const items = getFillerArticles().slice(0, 6);

  if (!items.length) return null;

  return (
    <section className="mt-6 md:hidden">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-gu text-2xl font-bold text-[#e48d0b] ">
          વધુ સમાચાર
        </h2>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((article) => (
          <FillerCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}