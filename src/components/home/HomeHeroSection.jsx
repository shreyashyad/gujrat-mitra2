import { Bookmark } from "lucide-react";
import HeroArticleCard from "../category/HeroArticleCard.jsx";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/* ------------------------------------------------------------------ */
/* Side cards (right of hero) — with image                           */
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
      className="group relative flex h-full flex-row md:flex-col justify-between md:justify-start! lg:min-h-[220px] cursor-pointer gap-3 md:gap-0
                 border-b md:border-b-0 border-black/0 dark:border-white/0 pb-3 md:pb-0
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
      {/* Mobile: fixed width + fixed height 86px | Desktop: full width + aspect ratio */}
      <div className="relative w-24 sm:w-32 h-[86px] md:h-auto shrink-0 md:w-full md:aspect-[16/9] overflow-hidden rounded-lg">
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
          className={`absolute top-2 right-2 md:top-2 md:right-2 flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${isBookmarked
            ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
            : "bg-black/40 text-white hover:bg-black/60"
            }`}
        >
          <Bookmark
            size={16}
            className={`sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${isBookmarked ? "fill-current" : ""
              }`}
          />
        </button>
      </div>

      {/* Mobile: justify-start so metaRow sits tight under headline */}
      <div className="flex flex-1 flex-col justify-start md:justify-start! min-w-0 gap-1">
        <p className="mt-0 md:mt-2 article-headline">
          {article.headline}
        </p>

        <div className="article-metaRow">
          <div className="flex items-center gap-x-1 min-w-0 truncate pr-1">
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
/* Responsive Side Card (Under 768px: Image + Text | 768px+: Text Only) */
/* ------------------------------------------------------------------ */
function SideCardResponsive({ article }) {
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
                 border-b md:border-b-0 md:border-t pb-3 md:pb-0 pt-0 md:pt-2 border-black/0 dark:border-white/0
                 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
    >
      {/* Mobile only: fixed width + fixed height 86px */}
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
          className={`absolute top-2 right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${isBookmarked
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

      {/* Mobile: justify-start so metaRow sits tight under headline */}
      <div className="relative flex flex-1 flex-col justify-start md:justify-start! lg:min-h-[100px] min-w-0 gap-1">
        <div className="relative pr-6">
          <p className="article-headline">
            {article.headline}
          </p>

          <div className="article-metaRow mt-1 flex items-center justify-between">
            <div className="flex items-center gap-x-1 min-w-0 truncate pr-1">
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

            {/* Desktop save button – same as before */}
            <button
              type="button"
              aria-label="સેવ કરો"
              onClick={handleBookmark}
              title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
              className="absolute bottom-0 right-0 hidden md:flex p-1 text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer z-10 shrink-0"
            >
              <Bookmark
                size={16}
                className={`${isBookmarked
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

function AdSlot() {
  return (
    <div className="flex h-full min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
      <span className="font-gu text-xs text-ink/30 dark:text-ink-dark/30">
        જાહેરાત / Advertisement
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom strip card                                                 */
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
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[240px] cursor-pointer pt-2
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
            className={`absolute top-2 right-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${isBookmarked
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

        <p className="mt-2 article-headline">
          {article.headline}
        </p>
      </div>

      <div className="article-metaRow">
        <div className="mt-1 flex min-w-0 items-center gap-x-1 truncate">
          {article.cat && (
            <>
              <span className="font-semibold text-[#e48d0b]">
                {article.cat}
              </span>
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
/* Main export                                                       */
/* ------------------------------------------------------------------ */

function getAllHeroes() {
  const keys = [
    "foryou",
    "gujarat",
    "india",
    "business",
    "sports",
    "world",
    "entertainment",
    "technology",
    "health",
    "agriculture",
    "auto",
    "editorial",
  ];

  const heroes = [];

  for (const key of keys) {
    for (const a of articles[key] || []) {
      if (a.type === "hero") heroes.push(a);
    }
  }

  return heroes.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
  );
}

export default function HomeHeroSection() {
  const foryou = articles.foryou || [];

  const mainHero =
    foryou.find((a) => a.id === "a1") ||
    foryou.find((a) => a.type === "hero") ||
    foryou[0];

  const sideStories = foryou
    .filter((a) => a.id !== mainHero?.id)
    .slice(0, 6);

  const extraPool = [
    ...(articles.gujarat || []),
    ...(articles.india || []),
    ...(articles.business || []),
    ...(articles.sports || []),
  ].filter(
    (a) =>
      a.id !== mainHero?.id &&
      !sideStories.some((s) => s.id === a.id)
  );

  while (sideStories.length < 6 && extraPool.length) {
    sideStories.push(extraPool.shift());
  }

  const bottomStories = getAllHeroes()
    .filter((a) => a.id !== mainHero?.id)
    .slice(0, 3);

  const row1 = sideStories.slice(0, 2);
  const textCards = sideStories.slice(2, 6);
  const textRow1 = textCards.slice(0, 2);
  const textRow2 = textCards.slice(2, 4);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* ========== TOP BLOCK ========== */}
      <section className="grid grid-cols-1 gap-4 lg:gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-stretch
                    md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                    md:p-5 md:bg-white dark:md:bg-[#121212]
                    md:border md:border-gray-200/0 dark:md:border-white/0
                    md:rounded-3xl">
        {mainHero && (
          <HeroArticleCard
            article={mainHero}
            categoryLabel={mainHero.tag || mainHero.cat}
            slug="home"
          />
        )}

        <div className="flex h-full flex-col gap-2 md:gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
            {row1.map((article) => (
              <SideCardWithImage key={article.id} article={article} />
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-2 md:gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
              {textRow1.map((article) => (
                <SideCardResponsive key={article.id} article={article} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
              {textRow2.map((article) => (
                <SideCardResponsive key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== BOTTOM STRIP ========== */}
      <section className="hidden gap-4 lg:gap-5 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible
                    lg:items-stretch
                    md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                    md:p-5 md:bg-white dark:md:bg-[#121212]
                    md:border md:border-gray-200/0 dark:md:border-white/0
                    md:rounded-3xl">
        {bottomStories.map((article) => (
          <div
            key={article.id}
            className="w-full"
          >
            <BottomCard article={article} />
          </div>
        ))}
        <div className="w-full pt-2">
          <AdSlot />
        </div>
      </section>
    </div>
  );
}