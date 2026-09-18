// src/components/category/CategoryFeed.jsx
import { Bookmark, CheckCircle2 } from "lucide-react";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getArticlesByCategory } from "../../services/newsService.js";
import { hoursAgo, getReadTime } from "../../utils/articleMeta.js";
import HeroArticleCard from "./HeroArticleCard.jsx";
import MarketDashboard from "./MarketDashboard.jsx";
import SportsDashboard from "./SportsDashboard.jsx";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/* ------------------------------------------------------------------ */
/*  Side cards (right of hero) — with image                          */
/* ------------------------------------------------------------------ */
function SideCardWithImage({ article }) {
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
      className="group relative flex h-full flex-row md:flex-col justify-between md:justify-start! lg:min-h-[265px] cursor-pointer gap-3 md:gap-0
                 border-b md:border-b-0 border-black/0 dark:border-white/0 md:pb-1
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
      <div className="relative w-24 sm:w-32 h-[86px] md:h-auto shrink-0 md:w-full md:aspect-[14/8] overflow-hidden rounded-lg">
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
          className={`absolute top-2 right-2 md:top-2 md:right-2 flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Bookmark
            size={16}
            className={`sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${
              isBookmarked ? "fill-current" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-start md:justify-start! min-w-0 gap-1">
        <p className="mt-0 md:mt-1.5 article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <div className="article-metaRow">
          <div className="flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-1">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Responsive Side Card (Under 768px: Image + Text | 768px+: Text Only) */
/* ------------------------------------------------------------------ */
function SideCardTextOnly({ article }) {
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
      className="group relative flex h-full w-full flex-row md:flex-col justify-between cursor-pointer gap-3 md:gap-0
                 border-b md:border-b-0 md:border-t pb-1 md:pb-0 pt-0 md:pt-2 border-black/0 dark:border-white/0
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
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
            size={16}
            className={`sm:w-3.5 sm:h-3.5 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col justify-start md:justify-start! lg:min-h-[110px] min-w-0 gap-1">
        <div className="relative pr-0 md:pr-8">
          <p className="article-headline line-clamp-3 min-h-0!">
            {article.headline}
          </p>

          <div className="article-metaRow flex items-center justify-between">
            <div className="flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-1 min-w-0">
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

            <button
              type="button"
              aria-label="સેવ કરો"
              onClick={handleBookmark}
              title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
              className="absolute bottom-0 right-0 hidden md:flex p-1 text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer z-10 shrink-0"
            >
              <Bookmark
                size={16}
                className={`${
                  isBookmarked
                    ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom strip card — vertical (image on top)                        */
/* ------------------------------------------------------------------ */
function BottomCard({ article }) {
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
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[265px] cursor-pointer pt-3
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
      <div className="min-w-0">
        <div className="relative w-full aspect-[14/8] overflow-hidden rounded-lg">
          {article.img && (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300"
            />
          )}

          <button
            type="button"
            aria-label="સેવ કરો"
            onClick={handleBookmark}
            title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
            className={`absolute top-2 right-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
              isBookmarked
                ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Bookmark
              size={16}
              className={`sm:w-4 sm:h-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <p className="mt-2 article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>
      </div>

      <div className="article-metaRow">
        <div className="flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-1">
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
  );
}

/* ------------------------------------------------------------------ */
/*  List card — horizontal on mobile + tablet, vertical on desktop     */
/* ------------------------------------------------------------------ */
function ListCard({ article }) {
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
      className="group relative flex cursor-pointer gap-3
                 flex-row lg:flex-col
                 justify-between lg:justify-start!
                 lg:min-h-[265px] lg:pt-3
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
      {/* Image: fixed size on mobile/tablet, full aspect on lg+ */}
      <div className="relative w-24 sm:w-28 h-[86px] lg:h-auto shrink-0 lg:w-full lg:aspect-[14/8] overflow-hidden rounded-lg">
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
          className={`absolute top-1.5 right-1.5 lg:top-2 lg:right-2 flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Bookmark
            size={14}
            className={`lg:w-4 lg:h-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col justify-start min-w-0 gap-1 lg:mt-2">
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <div className="article-metaRow">
          <div className="flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-1">
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
    </div>
  );
}

function SkeletonFeed() {
  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8 animate-pulse">
      <div className="grid grid-cols-1 gap-3 sm:gap-3.5 lg:grid-cols-[1fr_1.15fr] lg:gap-4">
        <div className="h-[220px] sm:h-[280px] md:h-[320px] lg:h-[400px] rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="h-24 rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/5" />
            <div className="h-24 rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="h-16 sm:h-20 rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/5" />
            <div className="h-16 sm:h-20 rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EndOfFeed() {
  return (
    <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3">
      <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      <span className="flex items-center gap-1.5 text-xs font-gu text-ink/40 dark:text-ink-dark/40 whitespace-nowrap">
        <CheckCircle2 size={14} />
        તમે આ કેટેગરીના તમામ સમાચાર જોઈ લીધા છે.
      </span>
      <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
    </div>
  );
}

export default function CategoryFeed({ dataKey, slug, categoryLabel }) {
  const { data: all, loading, error } = useAsyncData(
    () => getArticlesByCategory(dataKey),
    [dataKey]
  );

  if (loading) return <SkeletonFeed />;

  if (error) {
    return (
      <p className="font-gu text-sm sm:text-base text-red-600 dark:text-red-400">
        સમાચાર લોડ કરવામાં સમસ્યા આવી. ફરી પ્રયત્ન કરો.
      </p>
    );
  }

  if (!all || !all.length) {
    return (
      <p className="font-gu text-sm sm:text-base text-ink/70 dark:text-ink-dark/70">
        આ કેટેગરીના સમાચાર ટૂંક સમયમાં અહીં ઉમેરાશે.
      </p>
    );
  }

  const sorted = [...all].sort((a, b) => hoursAgo(a.time) - hoursAgo(b.time));

  const [mainHero, ...rest] = sorted;

  // Side of hero: max 6
  const sideStories = rest.slice(0, 6);
  const row1 = sideStories.slice(0, 2);
  const textCards = sideStories.slice(2, 6);
  const textRow1 = textCards.slice(0, 2);
  const textRow2 = textCards.slice(2, 4);

  // Bottom: groups of 4
  const bottomStories = rest.slice(6);
  const bottomRows = [];
  for (let i = 0; i < bottomStories.length; i += 4) {
    bottomRows.push(bottomStories.slice(i, i + 4));
  }

  const showMarketDashboard = slug === "vyapar";
  const showSportsDashboard = slug === "ramatgamat";

  // Shadow + card chrome from 768px upwards
  const desktopSectionStyles =
    "md:bg-white dark:md:bg-white/[0.04] md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] dark:md:shadow-[0_2px_3px_rgba(0,0,0,0.25),0_0_20px_rgba(0,0,0,0.15)] md:pt-7 md:pb-6 md:px-7 md:rounded-3xl md:border md:border-black/0 dark:md:border-white/0";

  /**
   * Mobile + Tablet (<1024):
   *   even rowIndex → grid-cols-2 + BottomCard (vertical)
   *   odd  rowIndex → grid-cols-1 + ListCard  (horizontal list)
   * Desktop (≥1024):
   *   always 4-col + vertical cards
   *
   * Shadow appears from 768px (md) upwards.
   */
  const getRowSectionClass = (rowIndex) => {
    const isGridOnMobile = rowIndex % 2 === 0;

    if (isGridOnMobile) {
      return `grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5 ${desktopSectionStyles}`;
    }

    return `grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5 ${desktopSectionStyles}`;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ========== TOP BLOCK (hero + side) — unchanged ========== */}
      <section
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch
                   md:bg-white dark:md:bg-white/[0.04]
                   md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                   dark:md:shadow-[0_2px_3px_rgba(0,0,0,0.25),0_0_20px_rgba(0,0,0,0.15)]
                   md:pt-7 md:pb-6 md:px-7 md:rounded-3xl
                   md:border md:border-black/0 dark:md:border-white/0"
      >
        {mainHero && (
          <HeroArticleCard
            article={mainHero}
            categoryLabel={categoryLabel}
            slug={slug}
          />
        )}

        <div className="flex h-full flex-col gap-1">
          {row1.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
              {row1.map((article, i) => (
                <SideCardWithImage key={article.id || i} article={article} />
              ))}
            </div>
          )}

          <div className="flex flex-1 flex-col gap-1 mt-1">
            {textRow1.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                {textRow1.map((article, i) => (
                  <SideCardTextOnly key={article.id || i} article={article} />
                ))}
              </div>
            )}

            {textRow2.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                {textRow2.map((article, i) => (
                  <SideCardTextOnly key={article.id || i} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== BOTTOM ROWS ========== */}
      {bottomRows.map((row, rowIndex) => {
        const isListRow = rowIndex % 2 === 1; // odd → list style on mobile + tablet

        return (
          <section
            key={`bottom-row-${rowIndex}`}
            className={getRowSectionClass(rowIndex)}
          >
            {row.map((article, i) =>
              isListRow ? (
                <ListCard
                  key={article.id || `${rowIndex}-${i}`}
                  article={article}
                />
              ) : (
                <BottomCard
                  key={article.id || `${rowIndex}-${i}`}
                  article={article}
                />
              )
            )}
          </section>
        );
      })}

      {showMarketDashboard && <MarketDashboard />}
      {showSportsDashboard && <SportsDashboard />}

      <EndOfFeed />
    </div>
  );
}