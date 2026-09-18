// ============================================================
// FILE: src/components/layout/Footer/ArogyaJivansaili.jsx
// ============================================================
import { Bookmark } from "lucide-react";
import { articles } from "../../../data/articles.js";
import { getReadTime } from "../../../utils/articleMeta.js";
import { useNewsDetail } from "../../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../../context/SavedNewsContext.jsx";

/** Simple Meta details row – always single line + truncate */
function MetaRow({ article }) {
  return (
    <div className="article-metaRow">
      <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate">
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
  );
}

/** Large Hero Card (Image + Text ઉપર-નીચે) */
function HeroCard({ article }) {
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
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[340px] cursor-pointer p-0 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col flex-1 min-w-0">
        {/* Image Container */}
        <div className="mb-2 relative overflow-hidden rounded-[7px] w-full aspect-[18/14]">
          {article.img ? (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out"
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
              className={isBookmarked ? "fill-current" : ""}
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

/** Small horizontal card (Image + Text આજુ-બાજુ) */
function SmallCard({ article }) {
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
      className="group relative flex w-full flex-1 items-stretch gap-3 cursor-pointer p-0 lg:min-h-[102px] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      {/* Thumbnail */}
      <div className="relative h-[68px] w-[86px] sm:h-[84px] sm:w-[95px] shrink-0 overflow-hidden rounded-[5px]">
        {article.img ? (
          <img
            src={article.img}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="h-full w-full bg-black/5 dark:bg-white/5" />
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-90 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col justify-between md:justify-start! py-0.5">
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

/** Single Category Block */
function CategoryBlock({ title, articlesList }) {
  if (!articlesList || !articlesList.length) return null;

  const reversedList = articlesList
    .filter((a) => a.type !== "hero")
    .slice()
    .reverse();

  const hero = reversedList[0];
  const smallItems = reversedList.slice(1, 4);

  if (!hero) return null;

  return (
    <div className="flex h-full min-w-0 flex-col shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] pt-7 pb-6 px-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      {/* Heading with red dots */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-gu text-xl sm:text-2xl font-bold text-[#e48d0b]">
          {title}
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
        md (768-1023)     : 2 columns (Hero | SmallCards list) – already good
        lg (≥1024)        : same 2 columns inside each block (untouched)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <HeroCard article={hero} />

        <div className="flex flex-col justify-between gap-3 h-full">
          {smallItems.map((article, index) => (
            <div key={article.id || index}>
              <SmallCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArogyaJivansaili() {
  const sportsList = articles.sports || [];
  const worldList = articles.world || [];

  return (
    <section className="w-full pt-3 pb-7">
      <div className="mx-auto max-w-8xl pt-3">
        {/* Outer grid stays original: 1 col → 2 cols on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12 items-start">
          {/* આરોગ્ય → sports */}
          <CategoryBlock
            title="આરોગ્ય"
            articlesList={sportsList}
          />

          {/* જીવનશૈલી → world */}
          <CategoryBlock
            title="જીવનશૈલી"
            articlesList={worldList}
          />
        </div>
      </div>
    </section>
  );
}