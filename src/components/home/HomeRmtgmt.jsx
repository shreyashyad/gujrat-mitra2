import { Bookmark } from "lucide-react";
import HeroArticleCard from "../category/HeroArticleCard.jsx";
import { getReadTime } from "../../utils/articleMeta.js";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getArticlesByCategory } from "../../services/newsService.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

function RmtgmtCard({ article }) {
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
      className="group relative flex w-full items-stretch gap-3 border-b border-black/0 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985] dark:border-white/0"
    >
      {/* Mobile: fixed width + fixed height 86px */}
      <div className="relative w-24 sm:w-28 h-[86px] shrink-0 overflow-hidden rounded-[7px]">
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

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={14} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      {/* justify-start + gap so metaRow sits exactly under headline */}
      <div className="flex min-w-0 flex-1 flex-col justify-start gap-1 py-0.5">
        <p className="article-headline">
          {article.headline}
        </p>

        <div className="article-metaRow">
          <div className="flex flex-wrap items-center gap-x-1 truncate pr-1">
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

export default function HomeRmtgmt() {
  const { data: articles, loading, error } = useAsyncData(
    () => getArticlesByCategory("sports"),
    [],
  );
  if (loading) return null;
  if (error || !articles) return null;

  const sportsArticles = articles.slice(0, 7);

  if (!sportsArticles.length) return null;

  return (
    <section className="mt-6 md:hidden">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-gu text-2xl font-bold text-[#e48d0b]">
          રમતગમત
        </h2>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sportsArticles.map((article) =>
          article.type === "hero" ? (
            <HeroArticleCard
              key={article.id}
              article={article}
              categoryLabel={article.tag || article.cat}
            />
          ) : (
            <RmtgmtCard key={article.id} article={article} />
          )
        )}
      </div>
    </section>
  );
}