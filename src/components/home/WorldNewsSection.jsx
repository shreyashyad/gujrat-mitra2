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

      {/* Save button inside MetaRow (for TextCard) */}
      {showSave && (
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={onBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center
                     text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a]
                     transition-colors cursor-pointer z-10"
        >
          <Bookmark
            size={16}
            className={`${isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""}`}
          />
        </button>
      )}
    </div>
  );
}

/** Large Image Card */
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
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[343px] cursor-pointer p-0 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col">
        <div className="mb-2 relative w-full aspect-[18/11] overflow-hidden rounded-[7px]">
          {article.img ? (
            <img
              src={article.img}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="h-full w-full" />
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

        {/* No forced 3-line height – MetaRow sits right after actual headline */}
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>
      </div>

      <MetaRow article={article} />
    </div>
  );
}

/** Text card – pure text by default & on lg; image-left + text-right only on md (768-1023) */
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
        flex-col justify-between md:flex-row md:items-start md:gap-3 md:min-h-0
        lg:flex-col lg:justify-start! lg:gap-0 lg:min-h-[102px]
        ${className}`}
    >
      {/* Image – visible ONLY on md (768-1023), hidden on mobile & lg */}
      <div className="relative hidden md:block lg:hidden flex-shrink-0 w-[110px] aspect-[4/3] overflow-hidden rounded-[7px]">
        {article.img ? (
          <img
            src={article.img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-black/5 dark:bg-white/5" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Headline – keep pr-8 so no content under button */}
        <div className="pr-8">
          <p className="article-headline line-clamp-3 min-h-0!">
            {article.headline}
          </p>
        </div>

        {/* Meta row – save button is inside MetaRow */}
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

export default function TopNewsSection() {
  const list = articles.world || [];
  if (!list.length) return null;

  const nonHeroItems = list.filter((article) => article.type !== "hero");

  const imageCards = nonHeroItems.slice(0, 2);
  const textCards = nonHeroItems.slice(2, 5);

  if (!imageCards.length && !textCards.length) return null;

  return (
    <section className="lg:items-stretch shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 lg:pt-7 lg:px-7 lg:pb-2 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      {/* 
        Mobile (<768)     : 1 column
        md (768-1023)     : 2 columns → first 2 ImageCards side-by-side, then text list full-width
        lg (≥1024)        : original 3-column layout (untouched)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-stretch">
        {imageCards.map((article) => (
          <ImageCard key={article.id} article={article} />
        ))}

        {/* Text stack 
            md → spans both columns (full-width list of horizontal cards)
            lg → back to 3rd column only */}
        <div className="flex flex-col justify-between gap-2 
                        md:col-span-2 
                        lg:col-span-1 lg:border-t-0 lg:pt-0">
          {textCards.map((article) => (
            <TextCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}