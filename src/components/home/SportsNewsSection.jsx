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

/** Clean Image Card - Bookmark on top right of image */
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
      className="group flex h-full flex-col justify-start lg:min-h-[265px] cursor-pointer p-0
                 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      {/* Image Container with Top-Right Bookmark */}
      <div className="mb-2 relative overflow-hidden rounded-[7px] w-full">
        {article.img ? (
          <img
            src={article.img}
            alt={article.headline || ""}
            loading="lazy"
            className="relative w-full aspect-[18/11] flex-1 overflow-hidden rounded-[7px] transition-transform duration-300"
          />
        ) : (
          <div className="w-full aspect-[18/11] bg-black/5 dark:bg-white/5" />
        )}

        {/* Bookmark Button Top Right on Image */}
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-2 right-2 flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
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

      {/* Headline & Meta – no forced 3-line height */}
      <div className="flex flex-col justify-start">
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>
        <MetaRow article={article} />
      </div>
    </div>
  );
}

export default function SportsNewsSection() {
  const list = articles.sports || [];
  if (!list.length) return null;

  const nonHeroItems = list.filter((article) => article.type !== "hero");
  const cards = nonHeroItems.slice(0, 4);

  if (!cards.length) return null;

  return (
    <section className="mt-[3px] lg:items-stretch shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      {/* Grid remains untouched – already correct across all breakpoints */}
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4 xl:items-stretch">
        {cards.map((article) => (
          <ImageCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}