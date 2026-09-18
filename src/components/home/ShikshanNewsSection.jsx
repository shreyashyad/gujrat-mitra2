import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/** Simple Meta details row + optional save button inside */
function MetaRow({ article, showSave = false, isBookmarked = false, onBookmark }) {
  return (
    <div className="article-metaRow relative">
      {/* Always single row + truncate on overflow (all devices) */}
      <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-8">
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

      {showSave && (
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={onBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className="absolute bottom-0 right-0 z-10 flex h-7 w-7 items-center justify-center
                     text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a]
                     transition-colors cursor-pointer"
        >
          <Bookmark
            size={16}
            className={isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""}
          />
        </button>
      )}
    </div>
  );
}

/** Large image + text card */
function ImageCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(e) => e.key === "Enter" && openNews(article)}
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[347px] cursor-pointer p-0
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col flex-1">
        <div className="mb-2 relative w-full aspect-[16/14] lg:aspect-[16/14.5] overflow-hidden rounded-[7px]">
          {article.img ? (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="h-full w-full bg-black/5 dark:bg-white/5" />
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

        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <MetaRow article={article} />
      </div>
    </div>
  );
}

/** Text card – pure text by default & on lg; image-left + text-right only 768-1023 */
function TextCard({ article, className = "" }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(e) => e.key === "Enter" && openNews(article)}
      className={`group relative flex w-full cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]
        flex-col justify-between 
        min-[768px]:flex-row min-[768px]:items-start min-[768px]:gap-3 min-[768px]:min-h-0
        lg:flex-col lg:justify-start! lg:gap-0 lg:min-h-[108px]
        ${className}`}
    >
      {/* Image – visible ONLY on 768-1023 */}
      <div className="relative hidden min-[768px]:block lg:hidden flex-shrink-0 
                      h-[72px] w-[96px] sm:h-[90px] sm:w-[110px] 
                      overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
        {article.img ? (
          <img
            src={article.img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="pr-8">
          <p className="article-headline line-clamp-3 min-h-0!">
            {article.headline}
          </p>
        </div>

        <MetaRow
          article={article}
          showSave
          isBookmarked={isBookmarked}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );
}

export default function ShikshanNewsSection() {
  const list = articles.world || [];
  if (!list.length) return null;

  const nonHero = list.filter((a) => a.type !== "hero");
  const items = nonHero.slice(0, 8);

  const imageLeft = items[0];
  const textCol1 = items.slice(1, 4);
  const imageRight = items[4];
  const textCol2 = items.slice(5, 8);

  if (!imageLeft) return null;

  return (
    <section className="shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      <div className="mt-[-7px] mb-2 flex items-center gap-3">
        <h2 className="font-gu text-xl sm:text-2xl font-bold text-[#e48d0b]">
          શિક્ષણ
        </h2>
        <span className="flex items-center gap-0.5 mb-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* 
        < 768px          → 1 column
        768px – 912px    → 1 column (single list, still with image+text style)
        913px – 1023px   → 2 columns (balanced: two images on top, two lists below)
        ≥ 1024px         → original 4-column (untouched)
      */}
      <div className="grid grid-cols-1 min-[913px]:grid-cols-2 lg:grid-cols-4 gap-6 lg:items-stretch">
        {/* Image Left */}
        <div className="min-[913px]:order-1 lg:order-1">
          {imageLeft && <ImageCard article={imageLeft} />}
        </div>

        {/* Text Col 1 */}
        <div className="flex flex-col justify-between gap-3 min-[913px]:order-3 lg:order-2">
          {textCol1.map((article) => (
            <TextCard key={article.id} article={article} />
          ))}
        </div>

        {/* Image Right */}
        <div className="min-[913px]:order-2 lg:order-3">
          {imageRight && <ImageCard article={imageRight} />}
        </div>

        {/* Text Col 2 */}
        <div className="flex flex-col justify-between gap-3 min-[913px]:order-4 lg:order-4">
          {textCol2.map((article) => (
            <TextCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}