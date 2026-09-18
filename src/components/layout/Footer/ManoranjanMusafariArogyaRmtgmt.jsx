// ============================================================
// FILE: src/components/layout/Footer/ManoranjanMusafariArogyaRmtgmt.jsx
// ============================================================
import { Bookmark } from "lucide-react";
import { articles } from "../../../data/articles.js";
import { getReadTime } from "../../../utils/articleMeta.js";
import { useNewsDetail } from "../../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../../context/SavedNewsContext.jsx";

/** Simple Meta details row with integrated Bookmark Button */
function MetaRow({ article, showBookmark = false }) {
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  return (
    <div className="article-metaRow flex items-center justify-between gap-2 mt-1">
      {/* Always single row + truncate on overflow (all devices) */}
      <div className="flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate min-w-0">
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

      {showBookmark && (
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className="flex h-6 w-6 shrink-0 items-center justify-center text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer z-10"
        >
          <Bookmark
            size={15}
            className={`${isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""}`}
          />
        </button>
      )}
    </div>
  );
}

/** Vertical Image Card (પહેલો મુખ્ય સમાચાર) */
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
      className="group flex min-h-[260px] w-full flex-col justify-start cursor-pointer p-0 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      {/* Image Container */}
      <div className="mb-2 relative overflow-hidden rounded-[7px] w-full aspect-[18/10]">
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

        {/* Bookmark Button Image ની ઉપર જ રહેશે */}
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${isBookmarked
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

      {/* Content wrapper – no forced 3-line height */}
      <div>
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>
        <MetaRow article={article} />
      </div>
    </div>
  );
}

/** Text-only stacked card (બાકીના ૩ સમાચાર) */
function TextCard({ article }) {
  const { openNews } = useNewsDetail();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(e) => e.key === "Enter" && openNews(article)}
      className="group relative flex min-h-[96px] w-full flex-col justify-start cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      {/* Content wrapper – no forced 3-line height */}
      <div className="w-full">
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>
        {/* MetaRow અને Bookmark Button હવે એક જ રો માં સાથે રહેશે */}
        <MetaRow article={article} showBookmark={true} />
      </div>
    </div>
  );
}

/** Single Category Block */
function CategoryBlock({ title, articlesList }) {
  if (!articlesList || !articlesList.length) return null;

  const list = [...articlesList]
    .filter((a) => a.type !== "hero")
    .reverse()
    .slice(0, 4);

  const firstArticle = list[0];
  const remainingArticles = list.slice(1, 4);

  if (!firstArticle) return null;

  return (
    <div className="flex h-full min-w-0 flex-col gap-3 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] pt-7 pb-6 px-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-[-3px]">
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

      {/* 1st Article: Image + Text Card */}
      <ImageCard article={firstArticle} />

      {/* Remaining 3 Articles: Text Cards */}
      {remainingArticles.length > 0 && (
        <div className="flex flex-col gap-3">
          {remainingArticles.map((art, idx) => (
            <TextCard key={art.id || idx} article={art} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManoranjanMusafariArogyaRmtgmt() {
  const indiaList = articles.india || [];
  const sportsList = articles.sports || [];
  const worldList = articles.world || [];
  const entertainmentList = articles.entertainment || [];

  return (
    <section className="mt-[16px] w-full pb-10">
      <div className="mx-auto max-w-8xl">
        {/* 
          < 640px          → 1 column
          640px – 1023px   → 2 columns (already good for tablet)
          ≥ 1024px         → 4 columns (desktop untouched)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8.5 gap-y-10 items-start">
          {/* મનોરંજન ➔ india */}
          <CategoryBlock title="મનોરંજન" articlesList={indiaList} />

          {/* મુસાફરી ➔ sports */}
          <CategoryBlock title="મુસાફરી" articlesList={sportsList} />

          {/* આરોગ્ય ➔ world */}
          <CategoryBlock title="આરોગ્ય" articlesList={worldList} />

          {/* રમતગમત ➔ entertainment */}
          <CategoryBlock title="રમતગમત" articlesList={entertainmentList} />
        </div>
      </div>
    </section>
  );
}