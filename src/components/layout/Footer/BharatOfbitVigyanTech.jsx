// ============================================================
// FILE: src/components/layout/Footer/BharatOfbitVigyanTech.jsx
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

/** Horizontal Card (Image left + Text right) */
function HorizontalCard({ article }) {
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
      <div className="relative h-[72px] w-[90px] sm:h-[96px] sm:w-[106px] shrink-0 overflow-hidden rounded-[7px]">
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
        {/* No forced 3-line height – MetaRow sits right after actual headline */}
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

/** Single Category Column */
function CategoryColumn({ title, articlesList }) {
  if (!articlesList || !articlesList.length) return null;

  // reverse the data as requested
  const list = [...articlesList]
    .filter((a) => a.type !== "hero")
    .reverse()
    .slice(0, 4);

  if (!list.length) return null;

  return (
    <div className="flex h-full min-w-0 flex-col shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] pt-7 pb-6 px-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-gu text-lg sm:text-2xl font-bold text-[#e48d0b]">
          {title}
        </h2>
        <span className="flex items-center gap-0.5 mb-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* Cards stacked */}
      <div className="flex flex-col gap-3">
        {list.map((article, index) => (
          <div key={article.id || index}>
            <HorizontalCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BharatOfbitVigyanTech() {
  const indiaList = articles.india || [];
  const entertainmentList = articles.entertainment || [];
  const businessList = articles.business || [];  
  const gujaratList = articles.gujarat || [];

  return (
    <section className="w-full pb-7">
      <div className="mx-auto max-w-8xl pt-3">
        {/* 
          < 640px          → 1 column
          640px – 1023px   → 2 columns (already good for tablet)
          ≥ 1024px         → 4 columns (desktop untouched)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8.5 gap-y-10 items-start">
          {/* ભારત સમાચાર → india */}
          <CategoryColumn
            title="ભારત સમાચાર"
            articlesList={indiaList}
          />

          {/* ઓફબીટ → entertainment */}
          <CategoryColumn
            title="ઓફબીટ"
            articlesList={entertainmentList}
          />

          {/* વિજ્ઞાન → business */}
          <CategoryColumn
            title="વિજ્ઞાન"
            articlesList={businessList}
          />

          {/* ટેકનોલોજી → gujarat */}
          <CategoryColumn
            title="ટેકનોલોજી"
            articlesList={gujaratList}
          />
        </div>
      </div>
    </section>
  );
}