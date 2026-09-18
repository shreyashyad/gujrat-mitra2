import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/** Simple Meta details row – always single line + truncate */
function MetaRow({ article }) {
  return (
    <div className="article-metaRow">
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

/** Featured Card Component (Image + Text ઉપર-નીચે) */
function FeaturedCard({ article }) {
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
                 transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col flex-1">
        {/* Image — full width of container */}
        <div className="mb-2 relative overflow-hidden rounded-[7px] w-full aspect-[18/8]">
          {article.img ? (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              className="absolute inset-0 h-full w-full max-w-none object-cover transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="absolute inset-0 h-full w-full bg-black/5 dark:bg-white/5" />
          )}

          <button
            type="button"
            aria-label="સેવ કરો"
            onClick={handleBookmark}
            title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
            className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
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

        <MetaRow article={article} />
      </div>
    </div>
  );
}

/** Side Mid Card — image height matches content (full stretch) */
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
      className={`group relative flex w-full flex-1 items-stretch gap-3 cursor-pointer p-0 lg:min-h-[102px]
                 transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985] ${className}`}
    >
      {/* Image stretches to full card/content height */}
      <div className="relative shrink-0 w-[86px] sm:w-[110px] self-stretch min-h-[64px] overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
        {article.img ? (
          <img
            src={article.img}
            alt={article.headline || ""}
            loading="lazy"
            className="absolute inset-0 h-full w-full max-w-none object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex h-full w-full items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-1 right-1.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
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

      <div className="flex flex-1 flex-col justify-between md:justify-start! py-0.5 min-w-0">
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

export default function RecipeNewsSection() {
  const list = articles.business || [];
  if (!list.length) return null;

  const nonHero = list.filter((a) => a.type !== "hero");
  const items = nonHero.slice(0, 4);

  const featured = items[0];
  const midCards = items.slice(1, 4);

  if (!featured) return null;

  return (
    <section className="shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      <div className="mt-[-7px] mb-2 flex items-center gap-3">
        <h2 className="font-gu text-xl sm:text-2xl font-bold text-[#e48d0b]">
          રેસિપી
        </h2>
        <span className="flex items-center gap-0.5 mb-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* 
        < 1024px (includes 768-1023) → 1 column (Featured on top + MidCards list)
        ≥ 1024px                     → original 2-column (untouched)
      */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <FeaturedCard article={featured} />

        <div className="flex flex-col justify-between gap-6">
          {midCards.map((article) => (
            <MidCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}