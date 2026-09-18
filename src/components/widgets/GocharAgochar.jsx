import React from "react";
import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";
import { getReadTime } from "../../utils/articleMeta.js";

/** Simple Meta details row */
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

/* First news — image on top, text below (Hero Card) */
function HeroCard({ article }) {
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
      className="group flex w-full flex-col cursor-pointer
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
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
          className={`absolute top-2 right-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={14} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      <div className="mt-2.5 min-w-0">
        <p className="article-headline line-clamp-3 md:!min-h-0 md:!h-auto">
          {article?.headline || article?.title}
        </p>
        <MetaRow article={article} />
      </div>
    </div>
  );
}

/* Text-only card (items 2–4) */
function TextOnlyCard({ article }) {
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
      className="group relative flex w-full flex-col justify-between cursor-pointer pr-7
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="min-w-0">
        <p className="article-headline">
          {article?.headline || article?.title}
        </p>

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className="absolute top-0 right-0 p-0.5 text-ink/40 dark:text-ink-dark/40
                     hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer"
        >
          <Bookmark
            size={14}
            className={isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""}
          />
        </button>
      </div>

      <MetaRow article={article} />
    </div>
  );
}

export default function GucharAgochar() {
  const gucharArticles = articles?.sports
    ? articles.sports.slice(-4).reverse()
    : [];

  const [first, ...rest] = gucharArticles;

  return (
    <div className="w-full flex flex-col gap-2 space-y-1 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 px-5 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300">
      <div className="flex items-center gap-1.5 select-none">
        <h3 className="font-gu tracking-tight text-[#e48d0b] text-[24px] sm:text-[26px] leading-[1.2] font-bold">
          ગોચર અગોચર
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      <div className="w-full flex flex-col gap-3.5">
        {first && (
          <div className="pb-1">
            <HeroCard article={first} />
          </div>
        )}

        {rest.map((item, index) => (
          <div
            key={item?.id || index}
          >
            <TextOnlyCard article={item} />
          </div>
        ))}
      </div>
    </div>
  );
}