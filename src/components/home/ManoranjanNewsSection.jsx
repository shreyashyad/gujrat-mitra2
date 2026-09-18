import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

function MetaRow({ article }) {
  return (
    <div className="article-metaRow">
      {/* Always single row + truncate on overflow (all devices) */}
      <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate">
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
  );
}

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
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[336px] cursor-pointer
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col flex-1 min-w-0">
        <div className="mb-2 relative w-full aspect-[18/11] overflow-hidden rounded-[7px]">
          {article.img ? (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              data-no-scale
              className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
          )}

          <button
            type="button"
            aria-label="સેવ કરો"
            onClick={handleBookmark}
            title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
            className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isBookmarked
                ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>

        {/* No forced 3-line height – MetaRow sits right after actual headline */}
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <MetaRow article={article} />
      </div>
    </div>
  );
}

function MidCard({ article, className = "" }) {
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
      className={`group relative flex w-full items-start gap-3 cursor-pointer lg:min-h-[102px]
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985] ${className}`}
    >
      {/* છેલ્લા કૉલમ ની ઈમેજ માટે rounded-[4px] */}
      <div className="relative h-[72px] w-[96px] sm:h-[95px] sm:w-[112px] shrink-0 overflow-hidden rounded-[4px] bg-black/5 dark:bg-white/5">
        {article.img ? (
          <img
            src={article.img}
            alt={article.headline || ""}
            loading="lazy"
            data-no-scale
            className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-1 right-1 z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between md:justify-start! self-stretch">
        {/* No forced 3-line height */}
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        {/* MetaRow — always 1 line + truncate */}
        <div className="article-metaRow">
          <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate">
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
      </div>
    </div>
  );
}

export default function ManoranjanNewsSection() {
  const list = articles.entertainment || [];
  if (!list.length) return null;

  const nonHero = list.filter((a) => a.type !== "hero");
  const items = [...nonHero].reverse();

  const imageCards = items.slice(0, 2);
  const midCards = items.slice(2, 5);

  if (!imageCards.length) return null;

  return (
    <section className="shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl"> 
      <div className="mt-[-7px] mb-2 flex items-center gap-3">
        <h2 className="font-gu text-xl sm:text-2xl font-bold text-[#e48d0b]">
          મનોરંજન
        </h2>
        <span className="flex items-center gap-0.5 mb-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* 
        Mobile (<768)     : 1 column
        md (768-1023)     : 2 columns → first 2 ImageCards side-by-side, then MidCards list full-width
        lg (≥1024)        : original 3-column layout (untouched)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1.1fr] gap-6 lg:items-stretch">
        {imageCards.map((article) => (
          <ImageCard key={article.id} article={article} />
        ))}

        {/* MidCards list 
            md → spans both columns (full-width list below the 2 image cards)
            lg → back to 3rd column only */}
        <div className="flex flex-col justify-between gap-3.5 
                        md:col-span-2 
                        lg:col-span-1">
          {midCards.map((article) => (
            <MidCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}