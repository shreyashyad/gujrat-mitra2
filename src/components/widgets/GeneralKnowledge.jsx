import React from "react";
import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";
import { getReadTime } from "../../utils/articleMeta.js";

/** Simple Meta details row — force 1 line */
function MetaRow({ article }) {
  return (
    <div className="article-metaRow">
      <div className="mt-1 flex flex-nowrap items-center gap-x-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {article.cat && (
          <>
            <span className="font-semibold text-[#e48d0b] shrink-0">{article.cat}</span>
            <span className="opacity-50 shrink-0">•</span>
          </>
        )}
        <span className="shrink-0">{article.time}</span>
        <span className="opacity-50 shrink-0">•</span>
        <span className="truncate">{getReadTime(article)}</span>
      </div>
    </div>
  );
}

/* Hero Card — big vertical (first item) */
function HeroFashionCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article?.id);

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
      className="group w-full cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      {/* Big Image */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-[8px] bg-black/5 dark:bg-white/5">
        {article?.img ? (
          <img
            src={article.img}
            alt={article?.headline || article?.title || ""}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      {/* Text below image */}
      <div className="mt-2.5 flex flex-col min-w-0">
        <p className="article-headline line-clamp-3">
          {article?.headline || article?.title}
        </p>
        <MetaRow article={article} />
      </div>
    </div>
  );
}

/* Fashion Card — horizontal (rest of the items) */
function FashionCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article?.id);

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
      className="group flex w-full items-stretch gap-2.5 cursor-pointer lg:min-h-[102px]
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="relative h-[56px] w-[76px] sm:h-[72px] sm:w-[88px] shrink-0 overflow-hidden rounded-[5px] bg-black/5 dark:bg-white/5">
        {article?.img ? (
          <img
            src={article.img}
            alt={article?.headline || article?.title || ""}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-1 right-1 flex h-5 w-5 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between md:justify-start! min-w-0">
        <p className="article-headline line-clamp-3 md:!min-h-0 md:!h-auto md:!leading-[1.35]">
          {article?.headline || article?.title}
        </p>
        <MetaRow article={article} />
      </div>
    </div>
  );
}

export default function Fashion() {
  const fashionArticles = articles.world
    ? articles.world.slice(-4).reverse()
    : [];

  const [hero, ...rest] = fashionArticles;

  return (
    <div className="w-full flex flex-col gap-2 space-y-1 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 px-5 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300">
      <div className="flex items-center gap-1.5 select-none">
        <h3 className="font-gu tracking-tight text-[#e48d0b] text-[24px] sm:text-[26px] leading-tight font-bold">
          સામાન્ય જ્ઞાન
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* First item → Hero layout */}
        {hero && <HeroFashionCard article={hero} />}

        {/* Rest → horizontal cards */}
        {rest.map((item, index) => (
          <FashionCard key={item?.id || index} article={item} />
        ))}
      </div>
    </div>
  );
}